#!/bin/bash
# Setup script for Prisma mock client
# This is needed when the environment blocks Prisma engine downloads

echo "Setting up Prisma mock client..."

PRISMA_DIR="apps/server/node_modules/.prisma/client"

# Create directory if it doesn't exist
mkdir -p "$PRISMA_DIR"

# Create mock Prisma client
cat > "$PRISMA_DIR/index.js" << 'EOF'
// Temporary mock Prisma Client to bypass engine download restrictions
// This allows the app to start without database functionality

class MockPrismaClient {
  constructor() {
    this.user = {
      findUnique: async () => null,
      findMany: async () => [],
      create: async (data) => ({ id: 'mock-id', ...data.data }),
      update: async (data) => ({ id: data.where.id, ...data.data }),
      delete: async () => ({ id: 'mock-id' }),
    };

    this.settings = {
      findUnique: async () => null,
      upsert: async (data) => ({ id: 'mock-id', ...data.create }),
    };

    this.entry = {
      findMany: async () => [],
      create: async (data) => ({ id: 'mock-id', createdAt: new Date(), ...data.data }),
    };

    this.checkin = {
      findMany: async () => [],
      create: async (data) => ({ id: 'mock-id', createdAt: new Date(), ...data.data }),
    };

    this.badge = {
      findMany: async () => [],
      create: async (data) => ({ id: 'mock-id', ...data.data }),
    };

    this.weeklyReport = {
      findMany: async () => [],
      create: async (data) => ({ id: 'mock-id', ...data.data }),
    };
  }

  $connect() {
    console.warn('[MOCK] Prisma Client: Using mock client - database functionality disabled');
    return Promise.resolve();
  }

  $disconnect() {
    return Promise.resolve();
  }
}

module.exports = {
  PrismaClient: MockPrismaClient,
};
EOF

# Create default.js
cat > "$PRISMA_DIR/default.js" << 'EOF'
module.exports = require('./index.js');
EOF

echo "✓ Prisma mock client created successfully"
echo ""
echo "⚠️  WARNING: Database functionality is disabled"
echo "   This is a temporary workaround for environments that block Prisma engine downloads"
echo "   Data will not persist between sessions"
echo ""
