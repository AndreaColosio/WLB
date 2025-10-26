export type Intent = 'checkin' | 'journal' | 'gratitude' | 'progress' | 'smalltalk' | 'unknown';

const keywords: Record<Intent, string[]> = {
  checkin: [
    'how are you', 'how do you feel', 'tired', 'anxious', 'stressed', 'overwhelmed',
    'overwhelmed', 'energy', 'sleep', 'rest', 'focus', 'connection',
    'i feel', 'i\'m feeling', 'feeling', 'mood', 'balance'
  ],
  journal: [
    'write', 'journal', 'reflect', 'thought', 'think', 'remember',
    'i want to write', 'i need to', 'deep breath', 'brain dump',
    'vent', 'share', 'document', 'capture', 'note'
  ],
  gratitude: [
    'grateful', 'thankful', 'gratitude', 'appreciate', 'blessed',
    'i\'m grateful for', 'thankful for', 'lucky', 'fortunate',
    'appreciation', 'blessings', 'positive', 'good things'
  ],
  progress: [
    'progress', 'goal', 'achievement', 'accomplish', 'milestone',
    'small win', 'victory', 'success', 'improving', 'getting better',
    'growth', 'development', 'advance', 'level up'
  ],
  smalltalk: [
    'hello', 'hi', 'hey', 'what\'s up', 'how are you doing',
    'good morning', 'good evening', 'good afternoon', 'thanks', 'thank you'
  ],
  unknown: []
};

export const detectIntent = (text: string): Intent => {
  const normalized = text.toLowerCase().trim();

  for (const [intent, words] of Object.entries(keywords)) {
    if (words.some(word => normalized.includes(word))) {
      return intent as Intent;
    }
  }

  return 'unknown';
};
