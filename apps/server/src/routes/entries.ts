import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { grantBadges } from "../lib/scoring.js";

const router = Router();

const createEntrySchema = z.object({
  type: z.enum(["JOURNAL", "GRATITUDE"]),
  content: z.string().min(1),
  meta: z.any().optional(),
});

const DEMO_USER_ID = "demo-user";

router.post("/", async (req, res) => {
  try {
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

    await grantBadges(DEMO_USER_ID, prisma);

    res.json(entry);
  } catch (error) {
    console.error("Create entry error:", error);
    res.status(400).json({ error: "Failed to create entry" });
  }
});

router.get("/", async (req, res) => {
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

export default router;
