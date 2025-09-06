import { Router } from "express";
import { z } from "zod";
import { analyzeMessage } from "../services/messageAnalyzer.js";

const router = Router();

const messageSchema = z.object({
  text: z.string().min(1),
  audioUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  transcript: z.string().optional(),
  timeOfDay: z.enum(["morning", "midday", "evening"]).optional(),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
    timestamp: z.string()
  })).optional()
});

// Main message ingestion endpoint
router.post("/ingest", async (req, res) => {
  try {
    const messageData = messageSchema.parse(req.body);
    
    // Analyze the message and extract structured data
    const analysis = await analyzeMessage(messageData);
    
    res.json({
      success: true,
      analysis,
      reflection: analysis.reflection
    });
  } catch (error) {
    console.error("Message analysis error:", error);
    res.status(400).json({ 
      error: "Failed to analyze message",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
