@echo off
setlocal enabledelayedexpansion

title Balance Agent – Quick Start
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🚀 QUICK START 🚀                         ║
echo ║               Starting Balance Agent with npm               ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

set SCRIPT_DIR=%~dp0
pushd "%SCRIPT_DIR%" >nul

REM Verify Node.js is available
echo [INFO] Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo         Install Node.js 18 or later from https://nodejs.org/ and try again.
    goto :error
)

REM Ensure an .env file exists
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Creating .env from .env.example...
        copy /Y .env.example .env >nul
        echo [NOTICE] Added .env. Update OPENAI_API_KEY before using AI features.
    ) else (
        echo [ERROR] .env.example is missing. Cannot create configuration file.
        goto :error
    )
)

REM Install dependencies when needed
set INSTALL_REQUIRED=
if not exist "node_modules" set INSTALL_REQUIRED=1
if not exist "apps\server\node_modules" set INSTALL_REQUIRED=1
if not exist "apps\client\node_modules" set INSTALL_REQUIRED=1

if defined INSTALL_REQUIRED (
    echo [INFO] Installing npm dependencies (first run only)...
    call npm run install:all
    if errorlevel 1 (
        echo [ERROR] npm install failed. Check the output above for details.
        goto :error
    )
    echo [SUCCESS] Dependencies installed.
)

echo.
echo [INFO] Starting Balance Agent using npm run dev...
start "Balance Agent Dev Server" cmd /k "cd /d \"%CD%\" && npm run dev"

echo.
echo [SUCCESS] Servers launching:
echo          Backend → http://localhost:3001
echo          Frontend → http://localhost:5173
echo.
echo [INFO] Opening the app in your default browser...
start "" http://localhost:5173/

echo.
echo [TIP] Keep the new command window open while you use the app.
echo [TIP] Press Ctrl+C in that window to stop the servers.
echo.
pause
popd >nul
exit /b 0

:error
echo.
echo [INFO] Quick Start did not complete successfully.
echo [INFO] Fix the issue above, then run quick-start.bat again or use npm run dev.
echo.
pause
popd >nul
exit /b 1
