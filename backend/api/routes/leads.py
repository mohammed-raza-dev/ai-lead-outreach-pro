from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import pandas as pd, io, sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from db.database import get_db, Lead
from models.schemas import LeadCreate, LeadOut

router = APIRouter(prefix="/leads", tags=["Leads"])

@router.get("/", response_model=List[LeadOut])
def get_leads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Lead).offset(skip).limit(limit).all()

@router.post("/", response_model=LeadOut)
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    existing = db.query(Lead).filter(Lead.email == lead.email).first()
    if existing and lead.email:
        raise HTTPException(status_code=400, detail="Lead with this email already exists")
    db_lead = Lead(**lead.model_dump())
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead

@router.delete("/{lead_id}")
def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(lead)
    db.commit()
    return {"message": "Deleted"}

@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    df = pd.read_csv(io.StringIO(content.decode("utf-8")))
    added = 0
    for _, row in df.iterrows():
        email = str(row.get("email","")).strip()
        if email and db.query(Lead).filter(Lead.email == email).first():
            continue
        lead = Lead(
            name=str(row.get("name","")),
            company=str(row.get("company","")),
            role=str(row.get("role","")),
            email=email,
            linkedin=str(row.get("linkedin","")),
            phone=str(row.get("phone","")),
            industry=str(row.get("industry","")),
            source="CSV Upload"
        )
        db.add(lead)
        added += 1
    db.commit()
    return {"added": added, "total_in_file": len(df)}

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total = db.query(Lead).count()
    sources = db.query(Lead.source).distinct().all()
    companies = db.query(Lead.company).distinct().count()
    return {"total_leads": total, "unique_companies": companies, "sources": [s[0] for s in sources]}