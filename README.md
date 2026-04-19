# AI Lead Outreach Pro

An entrepreneur-grade AI-powered lead generation and outreach automation system built with FastAPI, React, and Google Gemini AI.

## Features
- AI-generated personalised outreach messages (Email, LinkedIn DM, WhatsApp)
- Multi-source lead import: CSV upload, Apollo.io, Hunter.io, web scraping
- 5 tone options: Professional, Friendly, Casual, Urgent, Value-focused
- Bulk message generation for all leads at once
- Export results as CSV
- Clean dark-themed premium dashboard

## Tech Stack
- **Backend**: FastAPI + Python + SQLAlchemy (SQLite)
- **Frontend**: React + Vite + Tailwind CSS
- **AI**: Google Gemini API
- **Database**: SQLite

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/mohammed-raza-dev/ai-lead-outreach-pro.git
cd ai-lead-outreach-pro
```

### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt
```

### 3. Add your Gemini API key
Create a `.env` file in the backend folder:


Get your free key at: https://aistudio.google.com

### 4. Run backend
```bash
python -m uvicorn main:app --reload --port 8000
```

### 5. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Built by
Mohammed Raza — AI Automation Developer
Available for freelance projects.
