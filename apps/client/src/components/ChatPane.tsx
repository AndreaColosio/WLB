import { useEffect, useRef } from 'react';

export default function ChatPane({ children }: { children: React.ReactNode }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [children]);

  return (
    <div className="space-y-2">
      {children}
      <div ref={endRef} />
    </div>
  );
}
