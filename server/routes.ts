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

// Conversational AI types and functions
type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type WellnessInsight = {
  type: 'journal' | 'gratitude' | 'checkin' | 'mood';
  content: string;
  extractedData?: any;
  confidence: number;
};

type ChatResponse = {
  response: string;
  insights: WellnessInsight[];
  mood?: number;
  energy?: number;
};

async function processConversation(userMessage: string, conversationHistory: ConversationMessage[] = []): Promise<ChatResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5";
  
  if (!apiKey) {
    return {
      response: "I'm here to listen and support you. Tell me more about how you're feeling today.",
      insights: []
    };
  }

  try {
    const client = new OpenAI({ apiKey });
    
    // First, generate conversational response
    const conversationMessages = [
      {
        role: "system" as const,
        content: `You are Sage, a gentle wellness companion. You're having a natural conversation with someone about their day, feelings, and well-being. 

Your role:
- Be empathetic, warm, and genuinely interested
- Ask follow-up questions that encourage reflection
- Gently guide toward gratitude, self-care, and balance
- Respond naturally like a caring friend who happens to be wise about wellness
- Keep responses conversational, not clinical

Guidelines:
- Keep responses to 1-3 sentences
- Don't be overly cheerful or pushy
- Listen more than you advise
- When appropriate, ask about mood, energy, sleep, connections, or gratitude
- Acknowledge their feelings without trying to "fix" everything`
      },
      ...conversationHistory.slice(-6), // Last 6 messages for context
      { role: "user" as const, content: userMessage }
    ];

    const conversationResponse = await client.chat.completions.create({
      model,
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 150
    });

    const agentResponse = conversationResponse.choices[0]?.message?.content ?? "I understand. Tell me more.";

    // Second, analyze for wellness insights
    const analysisPrompt = `Analyze this conversation message for wellness insights. Extract any mentions of:

User message: "${userMessage}"

Return JSON with an array of insights. Each insight should have:
- type: "journal" | "gratitude" | "checkin" | "mood"
- content: the relevant text or extracted information
- confidence: 0.1-1.0 how confident you are this should be saved
- extractedData: structured data (mood score 1-10, energy level, etc.)

Examples:
- "I'm feeling really grateful for my friend's support" → type: "gratitude", content: "grateful for friend's support"
- "I had a rough day at work, feeling stressed" → type: "mood", extractedData: {mood: 4, energy: 3}
- "Today I realized I need to set better boundaries" → type: "journal", content: "realized I need to set better boundaries"

Only extract insights with confidence > 0.6. Return empty array if nothing significant.`;

    const analysisResponse = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a wellness content analyzer. Return valid JSON only." },
        { role: "user", content: analysisPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 300
    });

    const analysisText = analysisResponse.choices[0]?.message?.content ?? '{"insights": []}';
    const analysisResult = JSON.parse(analysisText);
    
    return {
      response: agentResponse,
      insights: analysisResult.insights || [],
      mood: analysisResult.mood,
      energy: analysisResult.energy
    };
    
  } catch (error) {
    console.error("Conversation processing error:", error);
    return {
      response: "I'm here with you. Sometimes it helps just to share what's on your mind.",
      insights: []
    };
  }
}

async function saveWellnessInsights(insights: WellnessInsight[], userId: number = 1): Promise<void> {
  for (const insight of insights) {
    if (insight.confidence < 0.6) continue;
    
    try {
      switch (insight.type) {
        case 'journal':
          await prisma.entry.create({
            data: {
              userId,
              type: 'JOURNAL',
              content: insight.content,
              createdAt: new Date()
            }
          });
          break;
          
        case 'gratitude':
          await prisma.entry.create({
            data: {
              userId,
              type: 'GRATITUDE',
              content: insight.content,
              createdAt: new Date()
            }
          });
          break;
          
        case 'checkin':
        case 'mood':
          if (insight.extractedData) {
            await prisma.checkin.create({
              data: {
                userId,
                energy: insight.extractedData.energy || 5,
                rest: insight.extractedData.rest || 5,
                focus: insight.extractedData.focus || 5,
                connection: insight.extractedData.connection || 5,
                balanceScore: insight.extractedData.mood || 5,
                createdAt: new Date()
              }
            });
          }
          break;
      }
    } catch (error) {
      console.error(`Error saving ${insight.type} insight:`, error);
    }
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

  // Conversational AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const chatSchema = z.object({
        message: z.string().min(1),
        conversationHistory: z.array(z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
          timestamp: z.string()
        })).optional()
      });

      const { message, conversationHistory = [] } = chatSchema.parse(req.body);
      
      // Ensure demo user exists
      await prisma.user.upsert({
        where: { id: DEMO_USER_ID },
        update: {},
        create: { id: DEMO_USER_ID, displayName: "Demo" }
      });

      // Convert history to proper format
      const history: ConversationMessage[] = conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      }));

      // Process conversation with AI
      const chatResponse = await processConversation(message, history);
      
      // Save any wellness insights to database (convert DEMO_USER_ID to number)
      if (chatResponse.insights.length > 0) {
        await saveWellnessInsights(chatResponse.insights, parseInt(DEMO_USER_ID) || 1);
      }

      // Grant badges if new entries were created
      await grantBadges(DEMO_USER_ID);

      res.json({
        response: chatResponse.response,
        insights: chatResponse.insights,
        mood: chatResponse.mood,
        energy: chatResponse.energy,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Chat processing error:", error);
      res.status(500).json({ 
        response: "I'm here to listen. Sometimes it helps just to share what's on your mind.",
        insights: [],
        error: "Chat processing failed" 
      });
    }
  });

  // Get conversation insights (for the insights panel)
  app.get("/api/insights", async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      
      // Get recent entries that were auto-generated from conversations
      const recentEntries = await prisma.entry.findMany({
        where: { userId: DEMO_USER_ID },
        orderBy: { createdAt: "desc" },
        take: Number(limit)
      });

      const recentCheckins = await prisma.checkin.findMany({
        where: { userId: DEMO_USER_ID },
        orderBy: { createdAt: "desc" },
        take: 5
      });

      const insights = [
        ...recentEntries.map((entry: any) => ({
          type: entry.type.toLowerCase(),
          content: entry.content,
          timestamp: entry.createdAt,
          generated: true
        })),
        ...recentCheckins.map((checkin: any) => ({
          type: 'checkin',
          content: `Balance check-in: Energy ${checkin.energy}/10`,
          timestamp: checkin.createdAt,
          generated: true,
          data: {
            energy: checkin.energy,
            rest: checkin.rest,
            focus: checkin.focus,
            connection: checkin.connection
          }
        }))
      ];

      // Sort by timestamp
      insights.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      res.json({ insights: insights.slice(0, Number(limit)) });
      
    } catch (error) {
      console.error("Insights error:", error);
      res.status(500).json({ error: "Failed to fetch insights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
