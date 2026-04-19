@echo off
echo Starting AI Lead Outreach Pro...
cd /d "%~dp0"
start cmd /k "cd backend && python -m uvicorn main:app --reload --port 8000"
timeout /t 2 >nul
start cmd /k "cd frontend && npm run dev"
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
pause