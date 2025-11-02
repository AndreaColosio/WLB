@echo off
REM Setup script for Prisma mock client
REM This is needed when the environment blocks Prisma engine downloads

echo Setting up Prisma mock client...

set PRISMA_DIR=apps\server\node_modules\.prisma\client

REM Create directory if it doesn't exist
if not exist "%PRISMA_DIR%" mkdir "%PRISMA_DIR%"

REM Create mock Prisma client
(
echo // Temporary mock Prisma Client to bypass engine download restrictions
echo // This allows the app to start without database functionality
echo.
echo class MockPrismaClient {
echo   constructor^(^) {
echo     this.user = {
echo       findUnique: async ^(^) =^> null,
echo       findMany: async ^(^) =^> [],
echo       create: async ^(data^) =^> ^({ id: 'mock-id', ...data.data }^),
echo       update: async ^(data^) =^> ^({ id: data.where.id, ...data.data }^),
echo       delete: async ^(^) =^> ^({ id: 'mock-id' }^),
echo     };
echo.
echo     this.settings = {
echo       findUnique: async ^(^) =^> null,
echo       upsert: async ^(data^) =^> ^({ id: 'mock-id', ...data.create }^),
echo     };
echo.
echo     this.entry = {
echo       findMany: async ^(^) =^> [],
echo       create: async ^(data^) =^> ^({ id: 'mock-id', createdAt: new Date^(^), ...data.data }^),
echo     };
echo.
echo     this.checkin = {
echo       findMany: async ^(^) =^> [],
echo       create: async ^(data^) =^> ^({ id: 'mock-id', createdAt: new Date^(^), ...data.data }^),
echo     };
echo.
echo     this.badge = {
echo       findMany: async ^(^) =^> [],
echo       create: async ^(data^) =^> ^({ id: 'mock-id', ...data.data }^),
echo     };
echo.
echo     this.weeklyReport = {
echo       findMany: async ^(^) =^> [],
echo       create: async ^(data^) =^> ^({ id: 'mock-id', ...data.data }^),
echo     };
echo   }
echo.
echo   $connect^(^) {
echo     console.warn^('[MOCK] Prisma Client: Using mock client - database functionality disabled'^);
echo     return Promise.resolve^(^);
echo   }
echo.
echo   $disconnect^(^) {
echo     return Promise.resolve^(^);
echo   }
echo }
echo.
echo module.exports = {
echo   PrismaClient: MockPrismaClient,
echo };
) > "%PRISMA_DIR%\index.js"

REM Create default.js
(
echo module.exports = require^('./index.js'^);
) > "%PRISMA_DIR%\default.js"

echo ✓ Prisma mock client created successfully
echo.
echo ⚠️  WARNING: Database functionality is disabled
echo    This is a temporary workaround for environments that block Prisma engine downloads
echo    Data will not persist between sessions
echo.
