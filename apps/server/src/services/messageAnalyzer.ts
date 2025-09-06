import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the exact schema from your specification
const AnalysisSchema = z.object({
  intents: z.array(z.enum(["journal", "checkin", "gratitude", "practice"])),
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
    category: z.enum(["people", "place", "moment", "health", "work", "nature", "other"])
  }).optional(),
  practice: z.object({
    text: z.string(),
    durationMin: z.number().min(1).max(10)
  }).optional(),
  reflection: z.string(),
  nudge: z.object({
    reason: z.string(),
    suggestion: z.string()
  }).optional()
});

export type MessageAnalysis = z.infer<typeof AnalysisSchema>;

interface MessageData {
  text: string;
  audioUrl?: string;
  videoUrl?: string;
  transcript?: string;
  timeOfDay?: "morning" | "midday" | "evening";
  conversationHistory?: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
}

export async function analyzeMessage(messageData: MessageData): Promise<MessageAnalysis> {
  const systemPrompt = `You are a concise life balance coach. You will extract structured information from a user message and produce short, practical outputs. Avoid therapy or medical claims. Return only JSON using the following schema.

{
  "intents": ["journal" | "checkin" | "gratitude" | "practice"],
  "journal": { "title": "string", "body": "string", "tags": ["string"] },
  "checkin": { "energy": 0, "rest": 0, "focus": 0, "connection": 0, "note": "string", "balanceScore": 0 },
  "gratitude": { "text": "string", "category": "people|place|moment|health|work|nature|other" },
  "practice": { "text": "string", "durationMin": 1 },
  "reflection": "string",
  "nudge": { "reason": "string", "suggestion": "string" }
}

Guidelines:
- If user mood is low and energy is low, prefer a 1 minute "reset" practice
- If message includes a concrete positive moment, prioritize gratitude extraction
- If numeric check-in values are missing, infer from language, else ask a single clarifying question
- BalanceScore = round((energy + rest + focus + connection) / 4)
- Keep all outputs concise and actionable
- Use neutral, supportive language`;

  const userMessage = messageData.transcript || messageData.text;
  const timeContext = messageData.timeOfDay ? `\nTime of day: ${messageData.timeOfDay}` : "";
  
  const conversationContext = messageData.conversationHistory 
    ? `\nRecent conversation:\n${messageData.conversationHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
    : "";

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User message: "${userMessage}"${timeContext}${conversationContext}` }
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const parsed = JSON.parse(responseText);
    
    // Validate against our schema
    const validated = AnalysisSchema.parse(parsed);
    
    // Calculate balance score if checkin data exists
    if (validated.checkin) {
      const { energy, rest, focus, connection } = validated.checkin;
      validated.checkin.balanceScore = Math.round((energy + rest + focus + connection) / 4);
    }

    return validated;
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Fallback response
    return {
      intents: ["journal"],
      journal: {
        title: "Daily Reflection",
        body: messageData.text,
        tags: ["general"]
      },
      reflection: "I'm here to listen and help you process your thoughts. What would you like to focus on today?",
    };
  }
}
