import { useState, useCallback } from 'react';

export type ConversationState = 'idle' | 'listening' | 'transcribing' | 'analyzing' | 'reviewing' | 'saved';

export interface MessageAnalysis {
  intents: string[];
  journal?: {
    title: string;
    body: string;
    tags: string[];
  };
  checkin?: {
    energy: number;
    rest: number;
    focus: number;
    connection: number;
    note: string;
    balanceScore: number;
  };
  gratitude?: {
    text: string;
    category: string;
  };
  practice?: {
    text: string;
    durationMin: number;
  };
  reflection: string;
  nudge?: {
    reason: string;
    suggestion: string;
  };
}

export interface ConversationMessage {
  id: string;
  content: string;
  sender: 'user' | 'avatar';
  timestamp: Date;
  type: 'text' | 'voice' | 'video';
  analysis?: MessageAnalysis;
}

export const useConversationState = () => {
  const [state, setState] = useState<ConversationState>('idle');
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<MessageAnalysis | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'voice' | 'video' | null>(null);

  const addMessage = useCallback((message: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    const newMessage: ConversationMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<ConversationMessage>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  }, []);

  const startRecording = useCallback((type: 'voice' | 'video') => {
    setState('listening');
    setIsRecording(true);
    setRecordingType(type);
  }, []);

  const stopRecording = useCallback(() => {
    setState('transcribing');
    setIsRecording(false);
    setRecordingType(null);
  }, []);

  const startAnalysis = useCallback(() => {
    setState('analyzing');
  }, []);

  const showResults = useCallback((analysis: MessageAnalysis) => {
    setState('reviewing');
    setCurrentAnalysis(analysis);
  }, []);

  const saveResults = useCallback(() => {
    setState('saved');
    setCurrentAnalysis(null);
    // Reset to idle after a brief moment
    setTimeout(() => setState('idle'), 1000);
  }, []);

  const skipResults = useCallback(() => {
    setState('idle');
    setCurrentAnalysis(null);
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setCurrentAnalysis(null);
    setIsRecording(false);
    setRecordingType(null);
  }, []);

  return {
    state,
    messages,
    currentAnalysis,
    isRecording,
    recordingType,
    addMessage,
    updateMessage,
    startRecording,
    stopRecording,
    startAnalysis,
    showResults,
    saveResults,
    skipResults,
    reset,
  };
};
