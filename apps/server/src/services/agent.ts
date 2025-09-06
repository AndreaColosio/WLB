import OpenAI from "openai";
import { config } from "dotenv";
config();

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-5";

export type AgentContext = {
  timeOfDay: "morning" | "midday" | "evening";
  lastMood?: number;
  lastGratitude?: string;
  lastEntrySnippet?: string;
};

export type AgentCard = {
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

export async function getAgentCard(ctx: AgentContext): Promise<AgentCard> {
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
