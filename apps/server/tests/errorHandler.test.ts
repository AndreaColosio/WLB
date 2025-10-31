import { describe, it, expect, vi } from 'vitest';
import { AppError, errorHandler } from '../src/middleware/errorHandler.js';
import { Request, Response, NextFunction } from 'express';

describe('Error Handler', () => {
  it('should create AppError with correct properties', () => {
    const error = new AppError(404, 'NOT_FOUND', 'Resource not found');

    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Resource not found');
    expect(error.isOperational).toBe(true);
  });

  it('should handle AppError correctly', () => {
    const error = new AppError(400, 'BAD_REQUEST', 'Invalid input');
    const req = {} as Request;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid input',
      },
    });
  });
});
