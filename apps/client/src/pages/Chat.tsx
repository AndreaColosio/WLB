import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import AvatarCanvas from '../components/AvatarCanvas';
import ChatPane from '../components/ChatPane';
import InputDock from '../components/InputDock';
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

  // Listen for actions from the hamburger menu
  useEffect(() => {
    const handler = (e: any) => {
      const k = e?.detail as string;
      if (k) setActiveModule(k);
    };
    window.addEventListener('ba:action', handler);
    return () => window.removeEventListener('ba:action', handler);
  }, [setActiveModule]);

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
    <div className="relative mx-auto max-w-screen-sm">
      <TopBar />

      <main className="px-4 pt-3 pb-[7.5rem] md:pt-5">
        <section className="flex items-center justify-center">
          <AvatarCanvas />
        </section>

        <section className="mt-4 text-center">
          <p className="text-lg font-medium">How are you feeling right now?</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Open the menu to start a check-in, journal, gratitude, or progress.
          </p>
        </section>

        <section className="mt-4">
          <ChatPane>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-[var(--surface)] shadow'
                      : 'border border-[var(--border)] bg-[var(--bg)]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {renderModule()}
          </ChatPane>
        </section>
      </main>

      <InputDock onSend={handleSend} />
    </div>
  );
};

export default Chat;
