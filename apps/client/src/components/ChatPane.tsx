import { useEffect, useRef } from 'react';

interface ChatPaneProps {
  children: React.ReactNode;
}

const ChatPane = ({ children }: ChatPaneProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [children]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {children}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatPane;
