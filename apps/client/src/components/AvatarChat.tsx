import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, Heart, Brain, Zap } from 'lucide-react';
import { ChatService, ChatMessage } from '../services/chatService';

// Use the imported ChatMessage type

interface AvatarChatProps {
  onMessageSent?: (message: string) => void;
  className?: string;
}

const AvatarChat: React.FC<AvatarChatProps> = ({ onMessageSent, className = '' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Balance Agent. I'm here to help you find harmony in your daily life. How are you feeling today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Call the parent callback
    onMessageSent?.(currentInput);

    try {
      // Send message to backend
      const response = await ChatService.sendMessage(currentInput, messages);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reflection || response.message || "Thank you for sharing that with me. I understand you're feeling that way. Let's work together to find some balance and peace in your day.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Avatar Header */}
      <div className="flex-shrink-0 p-6 text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center shadow-lg floating-animation">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Balance Agent</h2>
        <p className="text-gray-600 text-sm">Your mindful companion for life balance</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-primary-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-bubble chat-bubble-ai">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 glass-effect border-t border-white/20">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share how you're feeling or what's on your mind..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none bg-white/80 backdrop-blur-sm"
            />
          </div>
          
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-all duration-200 ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="p-3 rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex justify-center space-x-4 mt-3">
          <button className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/60 text-gray-600 hover:bg-white/80 transition-all duration-200 text-sm">
            <Heart className="w-4 h-4" />
            <span>Gratitude</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/60 text-gray-600 hover:bg-white/80 transition-all duration-200 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Reflection</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/60 text-gray-600 hover:bg-white/80 transition-all duration-200 text-sm">
            <Zap className="w-4 h-4" />
            <span>Energy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarChat;
