from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LeadCreate(BaseModel):
    name: str
    company: str
    role: str
    email: Optional[str] = ""
    linkedin: Optional[str] = ""
    phone: Optional[str] = ""
    industry: Optional[str] = ""
    source: Optional[str] = "Manual"

class LeadOut(LeadCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class MessageRequest(BaseModel):
    lead_id: int
    message_type: str
    tone: str
    sender_name: str
    offer: str

class BulkMessageRequest(BaseModel):
    message_type: str
    tone: str
    sender_name: str
    offer: str

class MessageOut(BaseModel):
    id: int
    lead_name: str
    lead_company: str
    lead_role: str
    message_type: str
    tone: str
    content: str
    created_at: datetime
    class Config:
        from_attributes = True

class ScrapeRequest(BaseModel):
    source: Optional[str] = ""
    query: Optional[str] = ""
    domain: Optional[str] = ""
    url: Optional[str] = ""
    limit: Optional[int] = 10