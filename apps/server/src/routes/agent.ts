import { Router } from "express";
import { z } from "zod";
import { getAgentCard } from "../services/agent.js";

const router = Router();

const agentCardSchema = z.object({
  timeOfDay: z.enum(["morning", "midday", "evening"]),
  lastMood: z.number().optional(),
  lastGratitude: z.string().optional(),
  lastEntrySnippet: z.string().optional(),
});

router.post("/card", async (req, res) => {
  try {
    const ctx = agentCardSchema.parse(req.body);
    const card = await getAgentCard(ctx);
    res.json(card);
  } catch (error) {
    console.error("Agent card error:", error);
    res.status(400).json({ error: "Failed to get agent card" });
  }
});

export default router;
