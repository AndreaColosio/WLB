# Architecture Improvements

This document outlines the major improvements made to the Balance Agent application to enhance production-readiness, security, and maintainability.

## Summary of Changes

### 1. ✅ Consolidated to Single ORM (Prisma)

**Problem**: The project had both Drizzle ORM and Prisma, causing confusion and potential data model conflicts.

**Solution**:
- Removed Drizzle ORM completely (`drizzle-orm`, `drizzle-zod`, `drizzle-kit`)
- Deleted `shared/schema.ts` and `drizzle.config.ts`
- Consolidated all data models to Prisma
- Added `username` and `password` fields to Prisma User model

**Migration Required**:
```bash
cd apps/server
npx prisma migrate dev --name add_auth_fields
```

---

### 2. 🔐 Authentication System

**Problem**: No authentication system existed, making the app insecure for production.

**Solution**: Implemented JWT-based authentication with bcrypt password hashing.

#### New Files:
- `apps/server/src/lib/jwt.ts` - JWT token generation and verification
- `apps/server/src/middleware/auth.ts` - Authentication middleware
- `apps/server/src/routes/auth.ts` - Auth endpoints

#### New Endpoints:

**POST /api/auth/signup**
```json
Request:
{
  "username": "john_doe",
  "password": "securePassword123",
  "displayName": "John Doe" // optional
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "clx...",
      "username": "john_doe",
      "displayName": "John Doe",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**POST /api/auth/login**
```json
Request:
{
  "username": "john_doe",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { /* same as signup */ }
  }
}
```

**GET /api/auth/me** (requires Bearer token)
```
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "success": true,
  "data": {
    "user": { /* user object */ }
  }
}
```

#### Frontend Integration:

Store the JWT token in localStorage or memory:
```typescript
// After login/signup
localStorage.setItem('token', response.data.token);

// Add to axios requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

#### Protecting Routes:

Add `authMiddleware` to routes that require authentication:
```typescript
import { authMiddleware } from '../middleware/auth.js';

router.get('/protected', authMiddleware, (req: AuthRequest, res) => {
  const userId = req.user!.userId; // User is authenticated
  // ...
});
```

---

### 3. 🛡️ Standardized Error Handling

**Problem**: Inconsistent error handling across routes.

**Solution**: Created centralized error handling middleware.

#### New Files:
- `apps/server/src/middleware/errorHandler.ts` - Error handling middleware and AppError class

#### Usage:

**Throw custom errors**:
```typescript
import { AppError } from '../middleware/errorHandler.js';

// In route handler
if (!resource) {
  throw new AppError(404, 'NOT_FOUND', 'Resource not found');
}
```

**Async route handlers**:
```typescript
import { asyncHandler } from '../middleware/errorHandler.js';

router.get('/data', asyncHandler(async (req, res) => {
  const data = await someAsyncOperation();
  res.json({ success: true, data });
}));
```

**Error Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

---

### 4. ⚙️ Environment Variable Validation

**Problem**: No validation that required environment variables are set, causing runtime crashes.

**Solution**: Added Zod-based environment validation.

#### New Files:
- `apps/server/src/config/env.ts` - Environment validation with Zod

#### Features:
- Validates all required environment variables at startup
- Provides clear error messages if vars are missing
- Type-safe access to environment variables
- Warns if using default JWT_SECRET in production

#### Usage:
```typescript
import { env } from './config/env.js';

const port = env.PORT; // Type-safe, validated
const apiKey = env.OPENAI_API_KEY; // Guaranteed to exist
```

#### Environment Variables:
See `.env.example` for all required variables:
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production/test)
- `DATABASE_URL` - PostgreSQL connection string (optional for dev)
- `OPENAI_API_KEY` - OpenAI API key (required)
- `OPENAI_MODEL` - Model to use (default: gpt-4o-mini)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time (default: 7d)

---

### 5. 🧪 Testing Infrastructure

**Problem**: No tests existed, making refactoring risky.

**Solution**: Set up Vitest testing framework with sample tests.

#### New Files:
- `vitest.config.ts` - Vitest configuration
- `apps/server/tests/setup.ts` - Test setup and teardown
- `apps/server/tests/auth.test.ts` - Authentication tests
- `apps/server/tests/errorHandler.test.ts` - Error handler tests

#### Running Tests:
```bash
# Run tests once
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

#### Writing Tests:
```typescript
import { describe, it, expect } from 'vitest';

describe('Feature Name', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

---

### 6. 🚦 Rate Limiting & Cost Tracking

**Problem**: No protection against abuse and no tracking of OpenAI costs.

**Solution**: Added rate limiting and token usage tracking.

#### New Files:
- `apps/server/src/middleware/rateLimiter.ts` - Rate limiting middleware
- `apps/server/src/lib/openaiTracker.ts` - OpenAI cost tracking

#### Rate Limits:

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| General API | 100 requests | 15 minutes |
| Auth (login/signup) | 5 requests | 15 minutes |
| AI endpoints | 20 requests | 1 hour |

#### Cost Tracking:

The `openaiTracker` module:
- Logs token usage for every OpenAI call
- Calculates estimated cost based on model pricing
- Tracks daily usage per user (in memory)
- Console logs all API calls with cost estimates

**Example log output**:
```
[OpenAI Usage] User: clx123, Model: gpt-4o-mini, Endpoint: chat
  Tokens: 150 prompt + 200 completion = 350 total
  Estimated cost: $0.000083
```

#### Using Token Tracking:
```typescript
import { trackUsage } from '../lib/openaiTracker.js';

// After OpenAI call
const usage = response.usage;
trackUsage(userId, usage, 'gpt-4o-mini');
```

---

## Next Steps

### Immediate (Before First Deploy):

1. **Run Prisma migration**:
   ```bash
   cd apps/server
   npx prisma migrate dev --name add_auth_fields
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Generate secure JWT secret**:
   ```bash
   openssl rand -base64 32
   # Copy output to JWT_SECRET in .env
   ```

5. **Update frontend to use auth**:
   - Add login/signup pages
   - Store JWT token after authentication
   - Add Authorization header to API requests
   - Handle 401 errors (redirect to login)

### Recommended (For Production):

1. **Add route protection**: Add `authMiddleware` to routes that need authentication
2. **Database**: Switch from SQLite to PostgreSQL for production
3. **Session management**: Add refresh token support for better security
4. **Logging**: Add structured logging (Winston, Pino, or similar)
5. **Monitoring**: Add Sentry for error tracking
6. **Analytics**: Add Plausible or PostHog for user analytics
7. **CI/CD**: Add GitHub Actions for automated testing and deployment

### Optional Enhancements:

1. **Password reset**: Add email-based password reset flow
2. **Email verification**: Verify user emails during signup
3. **OAuth**: Add Google/GitHub login
4. **2FA**: Add two-factor authentication
5. **Persistent token tracking**: Save usage data to database instead of memory
6. **User settings**: Allow users to set token budgets/limits

---

## Breaking Changes

⚠️ **Important**: These changes introduce breaking changes that require updates:

1. **User model updated**: Existing users in the database need `username` and `password` fields
2. **Authentication required**: Routes will need `authMiddleware` to enforce authentication
3. **Response format**: Errors now use standardized `{ success, error }` format

### Migration Path:

If you have existing data, create a migration script to:
1. Add `username` field to existing users (use `id` or `displayName` as default)
2. Set a temporary password for existing users
3. Prompt users to reset their password on first login

---

## Testing the New Features

### 1. Test Authentication:
```bash
# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Get current user (use token from login response)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Test Rate Limiting:
```bash
# Make 6 rapid login requests - the 6th should be rate limited
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}'
  echo "\nRequest $i"
done
```

### 3. Run Tests:
```bash
npm test
```

---

## Questions?

If you have questions about these improvements or need help implementing them, please refer to:
- JWT documentation: https://jwt.io/
- Prisma docs: https://www.prisma.io/docs
- Vitest docs: https://vitest.dev/
- Express rate limiting: https://www.npmjs.com/package/express-rate-limit
