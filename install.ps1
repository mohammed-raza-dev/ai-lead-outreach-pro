Set-Location $PSScriptRoot

Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
cd backend
pip install -r requirements.txt
cd ..

Write-Host "Installing Node dependencies..." -ForegroundColor Cyan
cd frontend
npm install
cd ..

Write-Host ""
Write-Host "Done! Now run: .\start.bat" -ForegroundColor Green