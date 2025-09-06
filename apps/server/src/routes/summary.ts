import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { computeStreakDays } from "../lib/scoring.js";

const router = Router();

const DEMO_USER_ID = "demo-user";

router.get("/weekly", async (req, res) => {
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
    
    const streakDays = await computeStreakDays(DEMO_USER_ID, prisma);
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

export default router;
