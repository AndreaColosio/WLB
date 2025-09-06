import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { computeStreakDays } from "../lib/scoring.js";

const router = Router();

const DEMO_USER_ID = "demo-user";

router.get("/", async (req, res) => {
  try {
    const streakDays = await computeStreakDays(DEMO_USER_ID, prisma);
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

export default router;
