@echo off
setlocal
cd /d "%~dp0backend"
if not exist node_modules\express (
  echo Installing CampusFind backend packages...
  call npm install
)
if not exist node_modules\mongoose (
  echo Installing MongoDB driver...
  call npm install mongoose@^8.18.0
)
start "CampusFind Server" cmd /k "node server.js"
timeout /t 3 >nul
start "CampusFind" http://localhost:5000
endlocal
