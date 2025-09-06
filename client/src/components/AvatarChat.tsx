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

  const generateAvatarResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing with wellness focus
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = [
      "That sounds really meaningful. Tell me more about what made that moment special for you.",
      "I can hear that you're processing a lot right now. What's one thing that felt good today?",
      "That's a beautiful way to look at it. How did that experience change how you're feeling?",
      "I'm noting that down for your journal. Is there anything you're particularly grateful for right now?",
      "Your energy seems different today. On a scale of 1-10, how would you rate your overall balance right now?",
      "That's wonderful progress! I can see how much you've grown. What's supporting you most in this journey?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const processWellnessContent = (userMessage: string, avatarResponse: string) => {
    // Simulate AI extracting wellness insights from conversation
    const insights: WellnessInsight[] = [];
    
    if (userMessage.toLowerCase().includes('grateful') || userMessage.toLowerCase().includes('thankful') || userMessage.toLowerCase().includes('appreciate')) {
      insights.push({
        type: 'gratitude',
        content: `Grateful for: ${userMessage}`,
        generated: true
      });
    }
    
    if (userMessage.toLowerCase().includes('feel') || userMessage.toLowerCase().includes('mood') || userMessage.toLowerCase().includes('energy')) {
      insights.push({
        type: 'checkin',
        content: `Mood check-in: ${userMessage}`,
        generated: true
      });
    }
    
    if (userMessage.length > 50) {
      insights.push({
        type: 'journal',
        content: `Journal entry: ${userMessage}`,
        generated: true
      });
    }
    
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
    const responseContent = await generateAvatarResponse(userMessage.content);
    
    const avatarMessage: Message = {
      id: `avatar-${Date.now()}`,
      content: responseContent,
      sender: 'avatar',
      timestamp: new Date(),
      type: 'text'
    };

    setIsTyping(false);
    setMessages(prev => [...prev, avatarMessage]);
    
    // Process wellness content in background
    processWellnessContent(userMessage.content, responseContent);
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