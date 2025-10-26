import React, { useRef, useEffect, useState } from 'react';
import { useGamification } from '../hooks/useApi';
import { useConversationState, ConversationMessage, MessageAnalysis } from '../hooks/useConversationState';
import ResultCards from './ResultCards';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Mic, MicOff, Video, VideoOff, Send, Loader2 } from 'lucide-react';

const AvatarChat: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: gamificationData } = useGamification();
  
  const {
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
  } = useConversationState();

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
        addMessage({
          content: "Hi there! I'm your personal wellness companion. I'm here to chat about your day, help you reflect, and keep track of your well-being. How are you feeling right now?",
          sender: 'avatar',
          type: 'text'
        });
      }, 1000);
    }
  }, [messages.length, addMessage]);

  const analyzeMessage = async (messageText: string): Promise<MessageAnalysis> => {
    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));

      const response = await fetch('/api/chat/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: messageText,
          conversationHistory: conversationHistory.slice(-6), // Last 6 messages for context
          timeOfDay: getTimeOfDay()
        }),
      });

      if (!response.ok) {
        throw new Error('Message analysis API error');
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Message analysis error:', error);
      // Fallback analysis
      return {
        intents: ['journal'],
        journal: {
          title: 'Daily Reflection',
          body: messageText,
          tags: ['general']
        },
        reflection: "I'm here with you. Sometimes it helps just to share what's on your mind.",
      };
    }
  };

  const getTimeOfDay = (): 'morning' | 'midday' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'midday';
    return 'evening';
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    // Add user message
    const userMessage = addMessage({
      content: messageText,
      sender: 'user',
      type: 'text'
    });

    // Start analysis
    startAnalysis();

    try {
      // Analyze the message
      const analysis = await analyzeMessage(messageText);
      
      // Add avatar response
      addMessage({
        content: analysis.reflection,
        sender: 'avatar',
        type: 'text',
        analysis
      });

      // Show results for user to review
      showResults(analysis);
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage({
        content: "I'm here with you. Sometimes it helps just to share what's on your mind.",
        sender: 'avatar',
        type: 'text'
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording && recordingType === 'voice') {
      stopRecording();
    } else {
      startRecording('voice');
    }
  };

  const handleVideoToggle = () => {
    if (isRecording && recordingType === 'video') {
      stopRecording();
    } else {
      startRecording('video');
    }
  };

  const handleAcceptResults = async (acceptedData: Partial<MessageAnalysis>) => {
    try {
      // Save the accepted data to the backend
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(acceptedData),
      });

      if (response.ok) {
        saveResults();
      } else {
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
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
            <span className="statValue">{messages.filter(m => m.analysis?.journal).length}</span>
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
          
          {state === 'analyzing' && (
            <div className="messageWrapper avatar">
              <div className="messageContent">
                <div className="messageAvatar">🌟</div>
                <div className="messageBubble typing">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">Analyzing your message...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Result Cards */}
      {state === 'reviewing' && currentAnalysis && (
        <div className="resultCardsContainer">
          <ResultCards
            analysis={currentAnalysis}
            onAccept={handleAcceptResults}
            onSkip={skipResults}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="inputContainer">
        <div className="inputWrapper">
          <Button
            variant={isRecording && recordingType === 'voice' ? 'destructive' : 'outline'}
            size="sm"
            onClick={handleVoiceToggle}
            disabled={state === 'analyzing' || state === 'reviewing'}
          >
            {isRecording && recordingType === 'voice' ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            variant={isRecording && recordingType === 'video' ? 'destructive' : 'outline'}
            size="sm"
            onClick={handleVideoToggle}
            disabled={state === 'analyzing' || state === 'reviewing'}
          >
            {isRecording && recordingType === 'video' ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          </Button>
          
          <Textarea
            className="messageInput flex-1"
            placeholder="Share what's on your mind..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
            disabled={state === 'analyzing' || state === 'reviewing'}
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || state === 'analyzing' || state === 'reviewing'}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};

export default AvatarChat;