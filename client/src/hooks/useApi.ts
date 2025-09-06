import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

// Types
export interface Entry {
  id: string;
  type: 'JOURNAL' | 'GRATITUDE' | 'CHECKIN';
  content: string;
  meta?: any;
  createdAt: string;
}

export interface Checkin {
  id: string;
  energy: number;
  rest: number;
  focus: number;
  connection: number;
  note?: string;
  createdAt: string;
}

export interface AgentCard {
  prompt: string;
  reflection: string;
  practice: string;
  category: 'journal' | 'gratitude' | 'reset' | 'wind_down';
}

export interface Badge {
  id: string;
  code: string;
  grantedAt: string;
}

export interface WeeklySummary {
  journal: number;
  gratitude: number;
  avgScore: number | null;
  streakDays: number;
  badges: Badge[];
}

// Custom hooks
export function useEntries(type?: string) {
  return useQuery({
    queryKey: ['entries', type],
    queryFn: async () => {
      const params = type ? { type } : {};
      const { data } = await apiClient.get('/entries', { params });
      return data as Entry[];
    },
  });
}

export function useCreateEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ type, content, meta }: { type: string; content: string; meta?: any }) => {
      const { data } = await apiClient.post('/entries', { type, content, meta });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries'] });
      queryClient.invalidateQueries({ queryKey: ['gamification'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useCreateCheckin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (checkin: { energy: number; rest: number; focus: number; connection: number; note?: string }) => {
      const { data } = await apiClient.post('/checkins', checkin);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins'] });
      queryClient.invalidateQueries({ queryKey: ['gamification'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useAgentCard(timeOfDay: string) {
  return useQuery({
    queryKey: ['agent-card', timeOfDay],
    queryFn: async () => {
      const { data } = await apiClient.post('/agent/card', { timeOfDay });
      return data as AgentCard;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useWeeklySummary() {
  return useQuery({
    queryKey: ['summary', 'weekly'],
    queryFn: async () => {
      const { data } = await apiClient.get('/summary/weekly');
      return data as WeeklySummary;
    },
  });
}

export function useGamification() {
  return useQuery({
    queryKey: ['gamification'],
    queryFn: async () => {
      const { data } = await apiClient.get('/gamification');
      return data as { streakDays: number; badges: Badge[] };
    },
  });
}
