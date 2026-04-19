from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from db.database import init_db
from api.routes import leads, messages, scraper

app = FastAPI(
    title="AI Lead Outreach Pro",
    version="1.0.0",
    description="Entrepreneur-grade AI lead outreach system"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(leads.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(scraper.router, prefix="/api")

@app.on_event("startup")
def startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}