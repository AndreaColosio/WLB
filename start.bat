@echo off
REM Simple launcher for Balance Agent
REM Just runs: npm run dev

echo 🚀 Starting Balance Agent...
echo.

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  No .env file found. Creating one from .env.example...
    copy .env.example .env
    echo ✅ Created .env - Please add your OPENAI_API_KEY and run again
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies (first time only)...
    call npm install
    cd apps\server
    call npm install
    cd ..\client
    call npm install
    cd ..\..
    echo ✅ Dependencies installed!
    echo.
)

REM Setup Prisma mock (needed in restricted environments)
if not exist "apps\server\node_modules\.prisma\client\index.js" (
    echo 🔧 Setting up Prisma client...
    call setup-prisma-mock.bat
)

echo 🎯 Starting both servers...
npm run dev
