@echo off
title Test Balance Agent App
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    Testing Balance Agent                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [INFO] Checking if servers are running...

REM Check frontend
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Frontend server is running on port 5173
) else (
    echo [ERROR] Frontend server is NOT running on port 5173
)

REM Check backend
netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Backend server is running on port 3001
) else (
    echo [ERROR] Backend server is NOT running on port 3001
)

echo.
echo [INFO] Testing web accessibility...

REM Test frontend
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 5; Write-Host '[SUCCESS] Frontend accessible - Status:' $response.StatusCode } catch { Write-Host '[ERROR] Frontend not accessible' }"

REM Test backend
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3001/api/health' -UseBasicParsing -TimeoutSec 5; Write-Host '[SUCCESS] Backend accessible - Status:' $response.StatusCode } catch { Write-Host '[ERROR] Backend not accessible' }"

echo.
echo [INFO] Test complete!
echo [INFO] If both servers are running and accessible, you can open:
echo [INFO] http://localhost:5173 in your browser
echo.
pause
