import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { generateToken, verifyToken } from '../src/lib/jwt.js';
import bcrypt from 'bcrypt';

describe('Authentication', () => {
  describe('JWT utilities', () => {
    it('should generate and verify a valid token', () => {
      const payload = { userId: '123', username: 'testuser' };
      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.username).toBe(payload.username);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow('Invalid or expired token');
    });
  });

  describe('Password hashing', () => {
    it('should hash and verify password correctly', async () => {
      const password = 'testPassword123';
      const hashed = await bcrypt.hash(password, 10);

      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);

      const isValid = await bcrypt.compare(password, hashed);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare('wrongPassword', hashed);
      expect(isInvalid).toBe(false);
    });
  });
});
