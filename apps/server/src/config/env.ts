import { z } from 'zod';

const envSchema = z.object({
  // Server
  PORT: z.string().default('3001').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Database
  DATABASE_URL: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),

  // JWT
  JWT_SECRET: z.string().default('your-secret-key-change-this-in-production'),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);

    // Warn if using default JWT secret in production
    if (parsed.NODE_ENV === 'production' && parsed.JWT_SECRET === 'your-secret-key-change-this-in-production') {
      console.warn('⚠️  WARNING: Using default JWT_SECRET in production! Please set a secure JWT_SECRET environment variable.');
    }

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();
