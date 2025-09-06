import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { grantBadges } from "../lib/scoring.js";

const router = Router();

const saveDataSchema = z.object({
  journal: z.object({
    title: z.string(),
    body: z.string(),
    tags: z.array(z.string())
  }).optional(),
  checkin: z.object({
    energy: z.number().min(0).max(10),
    rest: z.number().min(0).max(10),
    focus: z.number().min(0).max(10),
    connection: z.number().min(0).max(10),
    note: z.string(),
    balanceScore: z.number().min(0).max(10)
  }).optional(),
  gratitude: z.object({
    text: z.string(),
    category: z.string()
  }).optional(),
  practice: z.object({
    text: z.string(),
    durationMin: z.number().min(1).max(10)
  }).optional()
});

const DEMO_USER_ID = "demo-user";

router.post("/", async (req, res) => {
  try {
    const data = saveDataSchema.parse(req.body);
    
    // Ensure demo user exists
    await prisma.user.upsert({
      where: { id: DEMO_USER_ID },
      update: {},
      create: { id: DEMO_USER_ID, displayName: "Demo" }
    });

    const results = [];

    // Save journal entry
    if (data.journal) {
      const journalEntry = await prisma.entry.create({
        data: {
          userId: DEMO_USER_ID,
          type: "JOURNAL",
          content: data.journal.body,
          meta: {
            title: data.journal.title,
            tags: data.journal.tags
          }
        }
      });
      results.push({ type: 'journal', id: journalEntry.id });
    }

    // Save check-in
    if (data.checkin) {
      const checkin = await prisma.checkin.create({
        data: {
          userId: DEMO_USER_ID,
          energy: data.checkin.energy,
          rest: data.checkin.rest,
          focus: data.checkin.focus,
          connection: data.checkin.connection,
          note: data.checkin.note
        }
      });

      // Also create an entry for the checkin
      await prisma.entry.create({
        data: {
          userId: DEMO_USER_ID,
          type: "CHECKIN",
          content: data.checkin.note,
          meta: {
            score: data.checkin.balanceScore,
            energy: data.checkin.energy,
            rest: data.checkin.rest,
            focus: data.checkin.focus,
            connection: data.checkin.connection
          }
        }
      });

      results.push({ type: 'checkin', id: checkin.id });
    }

    // Save gratitude entry
    if (data.gratitude) {
      const gratitudeEntry = await prisma.entry.create({
        data: {
          userId: DEMO_USER_ID,
          type: "GRATITUDE",
          content: data.gratitude.text,
          meta: {
            category: data.gratitude.category
          }
        }
      });
      results.push({ type: 'gratitude', id: gratitudeEntry.id });
    }

    // Save practice (as a journal entry with special meta)
    if (data.practice) {
      const practiceEntry = await prisma.entry.create({
        data: {
          userId: DEMO_USER_ID,
          type: "JOURNAL",
          content: data.practice.text,
          meta: {
            type: 'practice',
            durationMin: data.practice.durationMin
          }
        }
      });
      results.push({ type: 'practice', id: practiceEntry.id });
    }

    // Grant badges based on new entries
    await grantBadges(DEMO_USER_ID, prisma);

    res.json({
      success: true,
      saved: results,
      message: "Data saved successfully"
    });
  } catch (error) {
    console.error("Save data error:", error);
    res.status(400).json({ 
      error: "Failed to save data",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
