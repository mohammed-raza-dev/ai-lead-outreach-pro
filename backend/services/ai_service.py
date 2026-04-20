from groq import Groq
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.config import settings

client = Groq(api_key=settings.groq_api_key)

PROMPTS = {
    "Email": "Write a cold outreach EMAIL with Subject line.\nFormat:\nSubject: ...\n\nBody: ...",
    "LinkedIn DM": "Write a short LinkedIn DM under 200 words. No subject. Direct and conversational.",
    "WhatsApp": "Write a WhatsApp message under 150 words. Friendly with a clear CTA.",
}

def generate_message(lead: dict, message_type: str, tone: str, sender_name: str, offer: str) -> str:
    instruction = PROMPTS.get(message_type, PROMPTS["Email"])
    prompt = f"""You are an expert B2B outreach specialist.

Lead: {lead.get("name","")}, {lead.get("role","")} at {lead.get("company","")} ({lead.get("industry","")})
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
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1000
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Generation error: {str(e)}"
