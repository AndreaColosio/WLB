import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../components/modern/Avatar';
import ChatMessage from '../components/modern/ChatMessage';
import InputArea from '../components/modern/InputArea';
import PersonalitySelector from '../components/modern/PersonalitySelector';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function NewChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasShownInitialGreeting = useRef(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show initial greeting
  useEffect(() => {
    if (!hasShownInitialGreeting.current && messages.length === 0) {
      hasShownInitialGreeting.current = true;
      setTimeout(() => {
        const greeting: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Hello! I'm your Balance Agent. I'm here to support you on your wellness journey. How are you feeling today?",
          timestamp: new Date(),
        };
        setMessages([greeting]);
        setTimeout(() => setShowGreeting(false), 3000);
      }, 1000);
    }
  }, [messages.length]);

  const handleSendMessage = async (content: string) => {
    // Hide greeting after first message
    setShowGreeting(false);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // TODO: Connect to your actual chat API
      // For now, simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Thank you for sharing that with me. I'm here to listen and support you. What else would you like to talk about?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col relative">
      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-36">
        <div className="max-w-chat mx-auto px-4 py-8">
          {/* Avatar Section */}
          <AnimatePresence>
            {showGreeting && (
              <motion.div
                className="flex justify-center mb-8 mt-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Avatar
                  size="xl"
                  showPersonality={true}
                  onClick={() => setShowPersonalitySelector(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact Avatar (after first interaction) */}
          {!showGreeting && messages.length > 0 && (
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar
                size="md"
                showPersonality={false}
                onClick={() => setShowPersonalitySelector(true)}
              />
            </motion.div>
          )}

          {/* Welcome Message (before any messages) */}
          {messages.length === 0 && (
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text mb-3">
                Welcome to Your Balance Space
              </h1>
              <p className="text-light-muted dark:text-dark-muted max-w-md mx-auto">
                Share your thoughts, feelings, or anything on your mind. I'm here to listen and guide you.
              </p>
            </motion.div>
          )}

          {/* Messages */}
          <div className="space-y-1">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    ✨
                  </motion.div>
                </div>
                <div className="message-assistant flex items-center gap-1">
                  <motion.div
                    className="w-2 h-2 bg-accent-purple rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-accent-purple rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-accent-purple rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <InputArea
        onSend={handleSendMessage}
        isLoading={isLoading}
        placeholder="Share how you're feeling..."
      />

      {/* Personality Selector Modal */}
      <PersonalitySelector
        isOpen={showPersonalitySelector}
        onClose={() => setShowPersonalitySelector(false)}
      />
    </div>
  );
}
