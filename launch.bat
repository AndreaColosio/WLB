@echo off
title Balance Agent Launcher
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    Balance Agent Launcher                    ║
echo ║              Avatar-First Life Balance Companion             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found
    pause
    exit /b 1
)

echo [INFO] System requirements check passed
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo [INFO] Installing root dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install root dependencies
        pause
        exit /b 1
    )
)

if not exist "apps\server\node_modules" (
    echo [INFO] Installing server dependencies...
    cd apps\server
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install server dependencies
        pause
        exit /b 1
    )
    cd ..\..
)

if not exist "apps\client\node_modules" (
    echo [INFO] Installing client dependencies...
    cd apps\client
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install client dependencies
        pause
        exit /b 1
    )
    cd ..\..
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating .env file...
    echo # Balance Agent Environment Variables > .env
    echo OPENAI_API_KEY=your_openai_api_key_here >> .env
    echo OPENAI_MODEL=gpt-4o-mini >> .env
    echo PORT=5050 >> .env
    echo NODE_ENV=development >> .env
    echo [WARNING] Created .env file. Please add your OpenAI API key.
)

echo.
echo [INFO] Starting Balance Agent in development mode...
echo.

REM Start both server and client concurrently
start "Balance Agent Server" cmd /k "cd apps\server && npm run dev"
timeout /t 3 /nobreak >nul
start "Balance Agent Client" cmd /k "cd apps\client && npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo [SUCCESS] Balance Agent is running!
echo [INFO] Frontend: http://localhost:5173
echo [INFO] Backend:  http://localhost:5050
echo.
echo [INFO] Opening application in browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo [INFO] Press any key to stop all processes...
pause >nul

REM Kill all Node.js processes
taskkill /f /im node.exe >nul 2>&1
echo [INFO] All processes stopped.
pause
