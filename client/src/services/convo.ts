const greetings = [
  "Hi! I'm here to chat about how you're doing and what's on your mind. What would you like to explore today?",
  "Hello! Ready to check in with yourself? How are you feeling right now?",
  "Hey there! Want to reflect on your day or work through something? I'm here to listen.",
  "Good to see you! Whether you want to check in, journal, or celebrate progress, I'm ready when you are.",
  "Hi! What's occupying your thoughts today? I'm here to help you process and find your balance."
];

const closings: Record<string, string[]> = {
  checkin: [
    "Nice work checking in with yourself. Take a moment to notice how you're feeling.",
    "You've acknowledged where you are. Is there one small thing that might help right now?",
    "Thanks for taking stock. Remember: awareness is the first step to change."
  ],
  journal: [
    "You've got it out there. Sometimes writing helps clarify what's really going on.",
    "Good for you for making space to reflect. Anything else on your mind?",
    "Putting thoughts into words can be powerful. How are you feeling now?"
  ],
  gratitude: [
    "Beautiful. Focusing on what's good can shift your whole perspective.",
    "Thanks for sharing that. What's one more thing you appreciate today?",
    "Gratitude is like a muscle—the more you practice, the stronger it gets."
  ],
  progress: [
    "You're taking steps forward, and that matters. Keep going.",
    "Every step counts, even the small ones. What's next for you?",
    "You're making progress. Trust the process."
  ]
};

export const getGreeting = (index: number = 0): string => {
  return greetings[index % greetings.length];
};

export const getClosing = (intent: string, index: number = 0): string => {
  const intentClosings = closings[intent] || closings.checkin;
  return intentClosings[index % intentClosings.length];
};

export const getNextStep = (intent: string): string => {
  const nextSteps: Record<string, string> = {
    checkin: "Try the Today view to track your energy levels.",
    journal: "Browse your Journal to see past reflections.",
    gratitude: "Add another gratitude anytime in the Gratitude tab.",
    progress: "Check your Progress page to see your journey."
  };
  return nextSteps[intent] || "Explore the other tabs to continue your wellness journey.";
};
