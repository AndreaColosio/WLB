@echo off
title Balance Agent Test
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    Balance Agent Test                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Testing system requirements...

REM Test Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found
    goto :error
) else (
    echo [SUCCESS] Node.js is available
)

REM Test npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found
    goto :error
) else (
    echo [SUCCESS] npm is available
)

REM Test if dependencies exist
if not exist "apps\server\node_modules" (
    echo [WARNING] Server dependencies not installed
) else (
    echo [SUCCESS] Server dependencies found
)

if not exist "apps\client\node_modules" (
    echo [WARNING] Client dependencies not installed
) else (
    echo [SUCCESS] Client dependencies found
)

REM Test if config files exist
if not exist "apps\client\vite.config.ts" (
    echo [ERROR] Client vite.config.ts not found
    goto :error
) else (
    echo [SUCCESS] Client config found
)

if not exist "apps\server\package.json" (
    echo [ERROR] Server package.json not found
    goto :error
) else (
    echo [SUCCESS] Server config found
)

echo.
echo [SUCCESS] All tests passed! You can launch the app with quick-start.bat or npm run dev now.
echo.
pause
exit /b 0

:error
echo.
echo [ERROR] Some tests failed. Please check the issues above.
echo.
pause
exit /b 1
