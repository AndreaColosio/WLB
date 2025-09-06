import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { balanceScore, grantBadges } from "../lib/scoring.js";

const router = Router();

const createCheckinSchema = z.object({
  energy: z.number().min(0).max(10),
  rest: z.number().min(0).max(10),
  focus: z.number().min(0).max(10),
  connection: z.number().min(0).max(10),
  note: z.string().optional(),
});

const DEMO_USER_ID = "demo-user";

router.post("/", async (req, res) => {
  try {
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

    await grantBadges(DEMO_USER_ID, prisma);

    res.json({ checkin, score });
  } catch (error) {
    console.error("Create checkin error:", error);
    res.status(400).json({ error: "Failed to create checkin" });
  }
});

export default router;
