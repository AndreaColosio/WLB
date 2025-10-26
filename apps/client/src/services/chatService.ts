import { apiClient } from '../api/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'voice';
}

export interface ChatResponse {
  success: boolean;
  analysis?: any;
  reflection?: string;
  message?: string;
}

export class ChatService {
  static async sendMessage(message: string, conversationHistory?: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await apiClient.post('/chat/ingest', {
        text: message,
        timeOfDay: getTimeOfDay(),
        conversationHistory: conversationHistory?.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        }))
      });
      
      return response.data;
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error. Please try again.'
      };
    }
  }

  static async getAgentCard(timeOfDay: 'morning' | 'midday' | 'evening') {
    try {
      const response = await apiClient.post('/agent/card', { timeOfDay });
      return response.data;
    } catch (error) {
      console.error('Agent card error:', error);
      return {
        prompt: "How are you feeling right now?",
        reflection: "You're doing your best with what you have.",
        practice: "Take 3 slow breaths and notice how you feel.",
        category: "reset"
      };
    }
  }
}

function getTimeOfDay(): 'morning' | 'midday' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'midday';
  return 'evening';
}
