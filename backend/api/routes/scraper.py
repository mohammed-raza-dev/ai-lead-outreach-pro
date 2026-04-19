from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from db.database import get_db, Lead
from models.schemas import ScrapeRequest
from services.scraper_service import search_apollo, search_hunter, scrape_website

router = APIRouter(prefix="/scrape", tags=["Scraper"])

@router.post("/apollo")
def apollo_search(req: ScrapeRequest, db: Session = Depends(get_db)):
    leads = search_apollo(req.query, req.domain, req.limit)
    saved = 0
    for l in leads:
        if l.get("email") and db.query(Lead).filter(Lead.email == l["email"]).first():
            continue
        db.add(Lead(**l))
        saved += 1
    db.commit()
    return {"found": len(leads), "saved": saved, "leads": leads}

@router.post("/hunter")
def hunter_search(req: ScrapeRequest, db: Session = Depends(get_db)):
    leads = search_hunter(req.domain, req.limit)
    saved = 0
    for l in leads:
        if l.get("email") and db.query(Lead).filter(Lead.email == l["email"]).first():
            continue
        db.add(Lead(**l))
        saved += 1
    db.commit()
    return {"found": len(leads), "saved": saved, "leads": leads}

@router.post("/web")
def web_scrape(req: ScrapeRequest, db: Session = Depends(get_db)):
    leads = scrape_website(req.url)
    return {"found": len(leads), "leads": leads}