@echo off
title Quick Start - Balance Agent
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 QUICK START 🚀                         ║
echo ║              Balance Agent - Avatar First                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Killing any existing processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [INFO] Starting servers...

REM Start backend
echo [INFO] Starting backend on port 3001...
start "Backend" cmd /k "cd /d %~dp0apps\server & npm run dev"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start frontend
echo [INFO] Starting frontend on port 5173...
start "Frontend" cmd /k "cd /d %~dp0apps\client & npm run dev"

REM Wait for startup
echo [INFO] Waiting for servers to start...
timeout /t 8 /nobreak >nul

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✅ READY TO GO! ✅                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo [SUCCESS] Balance Agent is running!
echo [INFO] Frontend: http://localhost:5173
echo [INFO] Backend:  http://localhost:3001
echo.
echo [INFO] Opening in browser...
start http://localhost:5173

echo.
echo [INFO] Press any key to stop all servers...
pause >nul

echo [INFO] Stopping servers...
taskkill /f /im node.exe >nul 2>&1
echo [SUCCESS] All stopped!
pause
