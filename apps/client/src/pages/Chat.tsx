import { useState, useEffect } from 'react';
import AvatarCanvas from '../components/AvatarCanvas';
import ChatPane from '../components/ChatPane';
import InputDock from '../components/InputDock';
import QuickChips from '../components/QuickChips';
import ModuleCheckIn from '../components/modules/ModuleCheckIn';
import ModuleJournal from '../components/modules/ModuleJournal';
import ModuleGratitude from '../components/modules/ModuleGratitude';
import ModuleProgress from '../components/modules/ModuleProgress';
import { useConversationState } from '../hooks/useConversationState';
import { detectIntent } from '../services/intent';
import { getGreeting, getClosing, getNextStep } from '../services/convo';

const Chat = () => {
  const {
    state,
    messages,
    activeModule,
    hasShownGreeting,
    addMessage,
    setActiveModule,
  } = useConversationState();

  const [closingIndex, setClosingIndex] = useState(0);

  useEffect(() => {
    if (!hasShownGreeting && messages.length === 0) {
      setTimeout(() => {
        addMessage({
          content: getGreeting(0),
          sender: 'avatar',
          type: 'text'
        });
      }, 500);
    }
  }, [hasShownGreeting, messages.length, addMessage]);

  const handleSend = (text: string) => {
    addMessage({
      content: text,
      sender: 'user',
      type: 'text'
    });

    const intent = detectIntent(text);

    if (intent !== 'unknown' && intent !== 'smalltalk') {
      setTimeout(() => {
        setActiveModule(intent);
      }, 300);
    }
  };

  const handleModuleSelect = (module: string) => {
    setActiveModule(module);
  };

  const handleModuleSave = (module: string) => {
    const { storage } = require('../services/storage');
    
    let reflection = '';
    
    // Generate reflections based on saved data
    if (module === 'checkin') {
      const latest = storage.getJson<any>('checkin', 'latest', null);
      if (latest) {
        const avg = (latest.mood + latest.energy + latest.stress) / 3;
        if (avg > 5) {
          reflection = "You're doing well across the board. ";
        } else if (avg < 3) {
          reflection = "It sounds like you're having a tough time. ";
        } else {
          reflection = "You're somewhere in the middle. ";
        }
      }
    } else if (module === 'progress') {
      const latest = storage.getJson<any>('progress', 'latest', null);
      if (latest && latest.streak > 0) {
        reflection = `You're on a ${latest.streak}-day streak! `;
      }
    }
    
    const closing = getClosing(module, closingIndex);
    const nextStep = getNextStep(module);

    addMessage({
      content: `${reflection}${closing} ${nextStep}`,
      sender: 'avatar',
      type: 'text'
    });

    setClosingIndex(prev => prev + 1);
    setActiveModule(null);
  };

  const handleModuleClose = () => {
    setActiveModule(null);
  };

  const renderModule = () => {
    const moduleProps = {
      onSave: () => handleModuleSave(activeModule!),
      onClose: handleModuleClose,
    };

    switch (activeModule) {
      case 'checkin':
        return <ModuleCheckIn {...moduleProps} />;
      case 'journal':
        return <ModuleJournal {...moduleProps} />;
      case 'gratitude':
        return <ModuleGratitude {...moduleProps} />;
      case 'progress':
        return <ModuleProgress {...moduleProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <AvatarCanvas />
      <ChatPane>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {renderModule()}
      </ChatPane>
      {state === 'idle' && <QuickChips onSelect={handleModuleSelect} />}
      <InputDock onSend={handleSend} />
    </div>
  );
};

export default Chat;
