import React, { useState, useRef, useEffect } from 'react';
import { useGamification } from '../hooks/useApi';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'avatar';
  timestamp: Date;
  type: 'text' | 'voice' | 'video';
}

interface WellnessInsight {
  type: 'journal' | 'gratitude' | 'checkin' | 'streak';
  content: string;
  generated: boolean;
}

const AvatarChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [wellnessInsights, setWellnessInsights] = useState<WellnessInsight[]>([]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: gamificationData } = useGamification();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: 'welcome-1',
          content: "Hi there! I'm your personal wellness companion. I'm here to chat about your day, help you reflect, and keep track of your well-being. How are you feeling right now?",
          sender: 'avatar',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages([welcomeMessage]);
      }, 1000);
    }
  }, [messages.length]);

  const generateAvatarResponse = async (userMessage: string): Promise<{ response: string; insights: WellnessInsight[] }> => {
    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory.slice(-6) // Last 6 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Chat API error');
      }

      const data = await response.json();
      return {
        response: data.response,
        insights: data.insights || []
      };
    } catch (error) {
      console.error('Chat error:', error);
      return {
        response: "I'm here with you. Sometimes it helps just to share what's on your mind.",
        insights: []
      };
    }
  };

  const processWellnessContent = (insights: WellnessInsight[]) => {
    // Add insights from AI analysis to local state
    if (insights.length > 0) {
      setWellnessInsights(prev => [...prev, ...insights]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Generate avatar response
    const { response: responseContent, insights } = await generateAvatarResponse(userMessage.content);
    
    const avatarMessage: Message = {
      id: `avatar-${Date.now()}`,
      content: responseContent,
      sender: 'avatar',
      timestamp: new Date(),
      type: 'text'
    };

    setIsTyping(false);
    setMessages(prev => [...prev, avatarMessage]);
    
    // Process wellness content from AI analysis
    processWellnessContent(insights);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Voice functionality would be implemented here
  };

  return (
    <div className="avatarChat">
      {/* Chat Header with Avatar */}
      <div className="chatHeader">
        <div className="avatarContainer">
          <div className="avatar">
            <div className="avatarImage">🌟</div>
            <div className="avatarStatus">
              <div className="statusDot"></div>
            </div>
          </div>
          <div className="avatarInfo">
            <h2 className="avatarName">Sage</h2>
            <p className="avatarTitle">Your Wellness Companion</p>
          </div>
        </div>
        
        <div className="wellnessStats">
          <div className="statItem">
            <span className="statIcon">🔥</span>
            <span className="statValue">{gamificationData?.streakDays || 0}</span>
            <span className="statLabel">days</span>
          </div>
          <div className="statItem">
            <span className="statIcon">📝</span>
            <span className="statValue">{wellnessInsights.filter(i => i.type === 'journal').length}</span>
            <span className="statLabel">entries</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messagesContainer">
        <div className="messagesList">
          {messages.map((message) => (
            <div key={message.id} className={`messageWrapper ${message.sender}`}>
              <div className="messageContent">
                {message.sender === 'avatar' && (
                  <div className="messageAvatar">🌟</div>
                )}
                <div className="messageBubble">
                  <p className="messageText">{message.content}</p>
                  <span className="messageTime">
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="messageWrapper avatar">
              <div className="messageContent">
                <div className="messageAvatar">🌟</div>
                <div className="messageBubble typing">
                  <div className="typingIndicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="inputContainer">
        <div className="inputWrapper">
          <button 
            className={`voiceButton ${isListening ? 'listening' : ''}`}
            onClick={handleVoiceToggle}
            data-testid="voice-button"
          >
            <i className={`fas fa-${isListening ? 'stop' : 'microphone'}`}></i>
          </button>
          
          <textarea
            className="messageInput"
            placeholder="Share what's on your mind..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            data-testid="message-input"
          />
          
          <button 
            className="sendButton"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            data-testid="send-button"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      {/* Background Wellness Insights */}
      <div className="wellnessInsights">
        <div className="insightsToggle">
          <button className="insightsButton">
            <i className="fas fa-chart-line"></i>
            <span className="insightsBadge">{wellnessInsights.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarChat;