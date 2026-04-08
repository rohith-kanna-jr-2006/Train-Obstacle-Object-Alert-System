@echo off
echo Starting Train Obstacle Detection System...

:: Start Backend (M2)
start cmd /k "cd backend && title BACKEND && python main.py"

:: Start AI Model (M3)
start cmd /k "cd ai\ai-module && title AI_MODEL && python -m app.main"

:: Start Frontend (M1)
start cmd /k "cd frontend && title FRONTEND && npm run dev"

echo All modules initiated in separate windows.
pause
