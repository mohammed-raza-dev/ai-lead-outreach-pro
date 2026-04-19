import google.generativeai as genai
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.config import settings

genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel("gemini-2.0-flash-lite")

PROMPTS = {
    "Email": "Write a cold outreach EMAIL with Subject line.\nFormat:\nSubject: ...\n\nBody: ...",
    "LinkedIn DM": "Write a short LinkedIn DM under 200 words. No subject. Direct and conversational.",
    "WhatsApp": "Write a WhatsApp message under 150 words. Friendly with a clear CTA.",
}

def generate_message(lead: dict, message_type: str, tone: str, sender_name: str, offer: str) -> str:
    instruction = PROMPTS.get(message_type, PROMPTS["Email"])
    prompt = f"""You are an expert B2B outreach specialist.

Lead: {lead.get('name','')}, {lead.get('role','')} at {lead.get('company','')} ({lead.get('industry','')})
Sender: {sender_name}
Offer: {offer}
Tone: {tone}

{instruction}

Rules:
- Personalize using lead name, company and role
- Lead with value not features
- End with a soft CTA
- No cliches like I hope this finds you well
- Sound human

Write ONLY the message. No explanation."""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Generation error: {str(e)}"


