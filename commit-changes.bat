@echo off
REM Simple commit script that bypasses PowerShell issues
setlocal

echo.
echo [INFO] Staging changes...
git add .

echo.
echo [INFO] Committing...
git commit -m "%~1"

if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Committed successfully!
    git log -1 --oneline
) else (
    echo.
    echo [ERROR] Commit failed or was cancelled
)

pause

