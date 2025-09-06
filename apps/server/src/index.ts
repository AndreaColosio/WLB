import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./lib/prisma.js";

// Import routes
import entriesRouter from "./routes/entries.js";
import checkinsRouter from "./routes/checkins.js";
import agentRouter from "./routes/agent.js";
import gamificationRouter from "./routes/gamification.js";
import summaryRouter from "./routes/summary.js";

const app = express();

// CORS setup for client origin
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:3000"], 
  credentials: true 
}));

app.use(express.json());

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true }));

// Mount routes
app.use("/api/entries", entriesRouter);
app.use("/api/checkins", checkinsRouter);
app.use("/api/agent", agentRouter);
app.use("/api/gamification", gamificationRouter);
app.use("/api/summary", summaryRouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT || 5050);
app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on port ${port}`);
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
