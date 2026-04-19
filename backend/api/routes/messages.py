from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import io, csv, sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from db.database import get_db, Lead, Message
from models.schemas import MessageRequest, BulkMessageRequest, MessageOut
from services.ai_service import generate_message

router = APIRouter(prefix="/messages", tags=["Messages"])

@router.post("/generate", response_model=MessageOut)
def generate_single(req: MessageRequest, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == req.lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    content = generate_message(
        {"name": lead.name, "company": lead.company, "role": lead.role, "industry": lead.industry},
        req.message_type, req.tone, req.sender_name, req.offer
    )
    msg = Message(lead_name=lead.name, lead_company=lead.company, lead_role=lead.role,
                  message_type=req.message_type, tone=req.tone, content=content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

@router.post("/bulk")
def generate_bulk(req: BulkMessageRequest, db: Session = Depends(get_db)):
    leads = db.query(Lead).all()
    if not leads:
        raise HTTPException(status_code=404, detail="No leads found")
    results = []
    for lead in leads:
        content = generate_message(
            {"name": lead.name, "company": lead.company, "role": lead.role, "industry": lead.industry},
            req.message_type, req.tone, req.sender_name, req.offer
        )
        msg = Message(lead_name=lead.name, lead_company=lead.company, lead_role=lead.role,
                      message_type=req.message_type, tone=req.tone, content=content)
        db.add(msg)
        results.append(msg)
    db.commit()
    return {"generated": len(results)}

@router.get("/", response_model=List[MessageOut])
def get_messages(message_type: str = None, db: Session = Depends(get_db)):
    q = db.query(Message)
    if message_type:
        q = q.filter(Message.message_type == message_type)
    return q.order_by(Message.created_at.desc()).all()

@router.get("/export-csv")
def export_csv(db: Session = Depends(get_db)):
    messages = db.query(Message).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Name","Company","Role","Type","Tone","Message","Created"])
    for m in messages:
        writer.writerow([m.lead_name,m.lead_company,m.lead_role,m.message_type,m.tone,m.content,m.created_at])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=messages.csv"})