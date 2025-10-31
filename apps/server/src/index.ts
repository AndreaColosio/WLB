import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter, authLimiter, aiLimiter } from "./middleware/rateLimiter.js";

// Import routes
import authRouter from "./routes/auth.js";
import entriesRouter from "./routes/entries.js";
import checkinsRouter from "./routes/checkins.js";
import agentRouter from "./routes/agent.js";
import gamificationRouter from "./routes/gamification.js";
import summaryRouter from "./routes/summary.js";
import chatRouter from "./routes/chat.js";
import saveRouter from "./routes/save.js";

const app = express();

console.log('🔧 Environment:', env.NODE_ENV);
console.log('🤖 OpenAI Model:', env.OPENAI_MODEL);

// CORS setup for client origin
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Health check (no auth required)
app.get("/api/health", (_, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// Mount routes
// Auth routes with stricter rate limiting
app.use("/api/auth", authLimiter, authRouter);

// Protected routes (require authentication)
// Note: Individual routes need to add authMiddleware where needed
app.use("/api/entries", entriesRouter);
app.use("/api/checkins", checkinsRouter);
app.use("/api/gamification", gamificationRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/save", saveRouter);

// AI routes with cost control rate limiting
app.use("/api/agent", aiLimiter, agentRouter);
app.use("/api/chat", aiLimiter, chatRouter);

// Error handler (must be last)
app.use(errorHandler);

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`🚀 Balance Agent Server listening on http://localhost:${env.PORT}`);
  console.log(`📊 Health check: http://localhost:${env.PORT}/api/health`);
  console.log(`🔐 Auth endpoints: /api/auth/signup, /api/auth/login, /api/auth/me`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
