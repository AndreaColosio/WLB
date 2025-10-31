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
echo [INFO] Checking system requirements...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found
    pause
    exit /b 1
)

echo [SUCCESS] Node.js and npm are available
echo.

REM Kill any existing Node.js processes
echo [INFO] Cleaning up existing processes...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Install dependencies if needed
echo [INFO] Checking dependencies...

if not exist "apps\server\node_modules" (
    echo [INFO] Installing server dependencies...
    cd /d "%~dp0apps\server"
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install server dependencies
        pause
        exit /b 1
    )
    cd /d "%~dp0"
    echo [SUCCESS] Server dependencies installed
)

if not exist "apps\client\node_modules" (
    echo [INFO] Installing client dependencies...
    cd /d "%~dp0apps\client"
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install client dependencies
        pause
        exit /b 1
    )
    cd /d "%~dp0"
    echo [SUCCESS] Client dependencies installed
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating .env file...
    echo # Server Configuration > .env
    echo PORT=3001 >> .env
    echo NODE_ENV=development >> .env
    echo. >> .env
    echo # Database >> .env
    echo # SQLite is used by default for development (file:dev.sqlite) >> .env
    echo # For production, use PostgreSQL: >> .env
    echo # DATABASE_URL=postgresql://user:password@localhost:5432/balance_agent >> .env
    echo. >> .env
    echo # OpenAI Configuration >> .env
    echo OPENAI_API_KEY=your_openai_api_key_here >> .env
    echo OPENAI_MODEL=gpt-4o-mini >> .env
    echo. >> .env
    echo # JWT Authentication >> .env
    echo # IMPORTANT: Change this to a secure random string in production! >> .env
    echo # Generate one with: openssl rand -base64 32 >> .env
    echo JWT_SECRET=your-secret-key-change-this-in-production >> .env
    echo JWT_EXPIRES_IN=7d >> .env
    echo [WARNING] Created .env file. Please add your OpenAI API key.
)

echo.
echo [INFO] Starting Balance Agent servers...
echo.

REM Start server first
echo [INFO] Starting backend server on port 3001...
start "Balance Agent Server" cmd /k "cd /d %~dp0apps\server & echo [SERVER] Starting backend... & npm run dev"

REM Wait for server to start
echo [INFO] Waiting for server to initialize...
timeout /t 5 /nobreak >nul

REM Check if server is running
echo [INFO] Checking server status...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/health' -UseBasicParsing -TimeoutSec 5; Write-Host '[SUCCESS] Backend server is running on port 3001' } catch { Write-Host '[WARNING] Backend server may not be ready yet' }"

REM Start client
echo [INFO] Starting frontend client on port 5173...
start "Balance Agent Client" cmd /k "cd /d %~dp0apps\client & echo [CLIENT] Starting frontend... & npm run dev"

REM Wait for client to start
echo [INFO] Waiting for client to initialize...
timeout /t 8 /nobreak >nul

REM Check if client is running
echo [INFO] Checking client status...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 5; Write-Host '[SUCCESS] Frontend client is running on port 5173' } catch { Write-Host '[WARNING] Frontend client may not be ready yet' }"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 LAUNCH COMPLETE! 🚀                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo [SUCCESS] Balance Agent is starting up!
echo [INFO] Frontend: http://localhost:5173
echo [INFO] Backend:  http://localhost:3001
echo.
echo [INFO] Opening application in browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo [INFO] Both servers are running in separate windows.
echo [INFO] Close those windows or press Ctrl+C to stop the servers.
echo.
echo [INFO] Press any key to stop all processes and exit...
pause >nul

REM Kill all Node.js processes
echo [INFO] Stopping all servers...
taskkill /f /im node.exe >nul 2>&1
echo [SUCCESS] All processes stopped.
echo.
echo [INFO] Thank you for using Balance Agent!
pause