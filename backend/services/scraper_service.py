import requests
from bs4 import BeautifulSoup
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.config import settings

def search_apollo(job_title: str, domain: str = "", limit: int = 10) -> list:
    if not settings.apollo_api_key:
        return []
    try:
        r = requests.post("https://api.apollo.io/v1/mixed_people/search", json={
            "api_key": settings.apollo_api_key,
            "person_titles": [job_title],
            "q_organization_domains": domain,
            "per_page": limit,
        }, timeout=10)
        return [{"name": p.get("name",""), "company": p.get("organization",{}).get("name",""),
                 "role": p.get("title",""), "email": p.get("email",""),
                 "linkedin": p.get("linkedin_url",""), "phone": "",
                 "industry": p.get("organization",{}).get("industry",""), "source": "Apollo.io"}
                for p in r.json().get("people",[])]
    except Exception:
        return []

def search_hunter(domain: str, limit: int = 10) -> list:
    if not settings.hunter_api_key:
        return []
    try:
        r = requests.get("https://api.hunter.io/v2/domain-search", params={
            "domain": domain, "api_key": settings.hunter_api_key, "limit": limit
        }, timeout=10)
        data = r.json().get("data", {})
        return [{"name": f"{e.get('first_name','')} {e.get('last_name','')}".strip(),
                 "company": data.get("organization",""), "role": e.get("position",""),
                 "email": e.get("value",""), "linkedin": e.get("linkedin",""),
                 "phone": "", "industry": "", "source": "Hunter.io"}
                for e in data.get("emails",[])]
    except Exception:
        return []

def scrape_website(url: str) -> list:
    try:
        r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        soup = BeautifulSoup(r.text, "lxml")
        leads = []
        for tag in soup.find_all(["h2","h3","h4","p"]):
            text = tag.get_text(strip=True)
            if any(w in text.lower() for w in ["ceo","founder","manager","director","head of"]) and len(text) < 80:
                leads.append({"name":"","company":url.split("/")[2].replace("www.",""),
                              "role":text,"email":"","linkedin":"","phone":"","industry":"","source":f"Web:{url}"})
        return leads[:15]
    except Exception:
        return []