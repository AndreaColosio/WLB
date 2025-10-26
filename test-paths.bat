@echo off
title Test Paths
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    Testing Directory Paths                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Current directory: %CD%
echo [INFO] Script directory: %~dp0
echo.

echo [TEST] Testing server directory...
cd /d "%~dp0apps\server"
echo [INFO] Now in: %CD%
if exist "package.json" (
    echo [SUCCESS] Server package.json found!
) else (
    echo [ERROR] Server package.json NOT found!
)
echo.

echo [TEST] Testing client directory...
cd /d "%~dp0apps\client"
echo [INFO] Now in: %CD%
if exist "package.json" (
    echo [SUCCESS] Client package.json found!
) else (
    echo [ERROR] Client package.json NOT found!
)
echo.

echo [TEST] Testing npm commands...
cd /d "%~dp0apps\server"
echo [INFO] Testing npm in server directory: %CD%
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] npm works in server directory!
) else (
    echo [ERROR] npm failed in server directory!
)

cd /d "%~dp0apps\client"
echo [INFO] Testing npm in client directory: %CD%
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] npm works in client directory!
) else (
    echo [ERROR] npm failed in client directory!
)

echo.
echo [INFO] Path test complete!
pause
