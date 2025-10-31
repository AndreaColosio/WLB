import { beforeAll, afterAll } from 'vitest';
import { prisma } from '../src/lib/prisma.js';

beforeAll(async () => {
  // Setup test database if needed
  console.log('Setting up tests...');
});

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect();
  console.log('Tests complete, cleaned up.');
});
