import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import cors from 'cors';
import { z } from 'zod';

// Import Prisma client and agent service
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();

// Agent types and service
type AgentContext = {
  timeOfDay: "morning" | "midday" | "evening";
  lastMood?: number;
  lastGratitude?: string;
  lastEntrySnippet?: string;
};

type AgentCard = {
  prompt: string;
  reflection: string;
  practice: string;
  category: "journal" | "gratitude" | "reset" | "wind_down";
};

const offlineCard: AgentCard = {
  prompt: "Write one line about what you want from today.",
  reflection: "You are doing your best with what you have.",
  practice: "Take 3 slow breaths and unclench your jaw.",
  category: "reset"
};

async function getAgentCard(ctx: AgentContext): Promise<AgentCard> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5";
  
  if (!apiKey) return offlineCard;

  try {
    const client = new OpenAI({ apiKey });
    const sys = "You are a gentle life-balance coach. Speak concisely. Return JSON with keys prompt, reflection, practice, category. Categories: journal, gratitude, reset, wind_down. Keep it short and practical. Avoid medical or therapy claims.";
    const user = `timeOfDay=${ctx.timeOfDay}; lastMood=${ctx.lastMood ?? "n/a"}; lastGratitude=${ctx.lastGratitude ?? "n/a"}; lastEntry="${(ctx.lastEntrySnippet ?? "").slice(0, 160)}"`;

    const res = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 200
    });

    const text = res.choices[0]?.message?.content ?? "";
    const obj = JSON.parse(text);
    
    return {
      prompt: obj.prompt ?? offlineCard.prompt,
      reflection: obj.reflection ?? offlineCard.reflection,
      practice: obj.practice ?? offlineCard.practice,
      category: obj.category ?? offlineCard.category
    };
  } catch (error) {
    console.error("Agent service error:", error);
    return offlineCard;
  }
}

// Helper functions
function balanceScore(energy: number, rest: number, focus: number, connection: number): number {
  const clamp = (x: number) => Math.max(0, Math.min(10, Math.round(x)));
  return clamp((energy + rest + focus + connection) / 4);
}

async function computeStreakDays(userId: string): Promise<number> {
  const entries = await prisma.entry.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true }
  });

  if (!entries.length) return 0;

  let streak = 0;
  const today = new Date();
  const daysSet = new Set(entries.map((e: any) => e.createdAt.toISOString().slice(0, 10)));

  // Count back from today
  for (let i = 0; ; i++) {
    const d = new Date(today.getTime() - i * 86400 * 1000).toISOString().slice(0, 10);
    if (daysSet.has(d)) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

async function grantBadges(userId: string): Promise<void> {
  // Grant FIRST_ENTRY badge
  const entryCount = await prisma.entry.count({ where: { userId } });
  if (entryCount === 1) {
    const existingBadge = await prisma.badge.findFirst({
      where: { userId, code: "FIRST_ENTRY" }
    });
    if (!existingBadge) {
      await prisma.badge.create({
        data: { userId, code: "FIRST_ENTRY" }
      });
    }
  }

  // Grant WEEK_STREAK_7 badge
  const streakDays = await computeStreakDays(userId);
  if (streakDays >= 7) {
    const existingBadge = await prisma.badge.findFirst({
      where: { userId, code: "WEEK_STREAK_7" }
    });
    if (!existingBadge) {
      await prisma.badge.create({
        data: { userId, code: "WEEK_STREAK_7" }
      });
    }
  }

  // Grant GRATITUDE_30 badge
  const gratitudeCount = await prisma.entry.count({
    where: { userId, type: "GRATITUDE" }
  });
  if (gratitudeCount >= 30) {
    const existingBadge = await prisma.badge.findFirst({
      where: { userId, code: "GRATITUDE_30" }
    });
    if (!existingBadge) {
      await prisma.badge.create({
        data: { userId, code: "GRATITUDE_30" }
      });
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  const DEMO_USER_ID = "demo-user";

  // CORS setup
  app.use(cors({
    origin: ["http://localhost:5000", "http://localhost:3000", "http://localhost:5173"],
    credentials: true
  }));

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ ok: true });
  });

  // Entries endpoints
  app.post("/api/entries", async (req, res) => {
    try {
      const createEntrySchema = z.object({
        type: z.enum(["JOURNAL", "GRATITUDE"]),
        content: z.string().min(1),
        meta: z.any().optional(),
      });

      const { type, content, meta } = createEntrySchema.parse(req.body);
      
      // Ensure demo user exists
      await prisma.user.upsert({
        where: { id: DEMO_USER_ID },
        update: {},
        create: { id: DEMO_USER_ID, displayName: "Demo" }
      });

      const entry = await prisma.entry.create({
        data: { userId: DEMO_USER_ID, type, content, meta }
      });

      await grantBadges(DEMO_USER_ID);

      res.json(entry);
    } catch (error) {
      console.error("Create entry error:", error);
      res.status(400).json({ error: "Failed to create entry" });
    }
  });

  app.get("/api/entries", async (req, res) => {
    try {
      const { type, limit } = req.query;
      
      const where: any = { userId: DEMO_USER_ID };
      if (type) where.type = type;

      const entries = await prisma.entry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit ? Number(limit) : 50
      });

      res.json(entries);
    } catch (error) {
      console.error("Get entries error:", error);
      res.status(500).json({ error: "Failed to fetch entries" });
    }
  });

  // Checkins endpoint
  app.post("/api/checkins", async (req, res) => {
    try {
      const createCheckinSchema = z.object({
        energy: z.number().min(0).max(10),
        rest: z.number().min(0).max(10),
        focus: z.number().min(0).max(10),
        connection: z.number().min(0).max(10),
        note: z.string().optional(),
      });

      const { energy, rest, focus, connection, note } = createCheckinSchema.parse(req.body);
      
      // Ensure demo user exists
      await prisma.user.upsert({
        where: { id: DEMO_USER_ID },
        update: {},
        create: { id: DEMO_USER_ID, displayName: "Demo" }
      });

      const checkin = await prisma.checkin.create({
        data: { userId: DEMO_USER_ID, energy, rest, focus, connection, note }
      });

      const score = balanceScore(energy, rest, focus, connection);
      
      // Also create an entry for the checkin
      await prisma.entry.create({
        data: {
          userId: DEMO_USER_ID,
          type: "CHECKIN",
          content: note ?? "",
          meta: { score, energy, rest, focus, connection }
        }
      });

      await grantBadges(DEMO_USER_ID);

      res.json({ checkin, score });
    } catch (error) {
      console.error("Create checkin error:", error);
      res.status(400).json({ error: "Failed to create checkin" });
    }
  });

  // Agent endpoint
  app.post("/api/agent/card", async (req, res) => {
    try {
      const agentCardSchema = z.object({
        timeOfDay: z.enum(["morning", "midday", "evening"]),
        lastMood: z.number().optional(),
        lastGratitude: z.string().optional(),
        lastEntrySnippet: z.string().optional(),
      });

      const ctx = agentCardSchema.parse(req.body);
      const card = await getAgentCard(ctx);
      res.json(card);
    } catch (error) {
      console.error("Agent card error:", error);
      res.status(400).json({ error: "Failed to get agent card" });
    }
  });

  // Summary endpoint
  app.get("/api/summary/weekly", async (req, res) => {
    try {
      const since = new Date(Date.now() - 7 * 86400 * 1000);
      
      const entries = await prisma.entry.findMany({
        where: { 
          userId: DEMO_USER_ID, 
          createdAt: { gte: since } 
        }
      });

      const journal = entries.filter((e: any) => e.type === "JOURNAL").length;
      const gratitude = entries.filter((e: any) => e.type === "GRATITUDE").length;
      
      const scores = entries
        .filter((e: any) => e.type === "CHECKIN" && e.meta && (e.meta as any).score !== undefined)
        .map((e: any) => (e.meta as any).score as number);
      
      const avgScore = scores.length ? 
        Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : null;
      
      const streakDays = await computeStreakDays(DEMO_USER_ID);
      const badges = await prisma.badge.findMany({ 
        where: { userId: DEMO_USER_ID },
        orderBy: { grantedAt: "desc" }
      });

      res.json({ journal, gratitude, avgScore, streakDays, badges });
    } catch (error) {
      console.error("Weekly summary error:", error);
      res.status(500).json({ error: "Failed to fetch weekly summary" });
    }
  });

  // Gamification endpoint
  app.get("/api/gamification", async (req, res) => {
    try {
      const streakDays = await computeStreakDays(DEMO_USER_ID);
      const badges = await prisma.badge.findMany({ 
        where: { userId: DEMO_USER_ID },
        orderBy: { grantedAt: "desc" }
      });

      res.json({ streakDays, badges });
    } catch (error) {
      console.error("Gamification error:", error);
      res.status(500).json({ error: "Failed to fetch gamification data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
