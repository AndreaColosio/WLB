import { useState, KeyboardEvent } from 'react';

export default function InputDock({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const text = message.trim();
    if (text.length === 0) return;
    onSend(text);
    setMessage('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-screen-sm items-end gap-2 px-4 py-3 md:py-4">
        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          className="flex-1 resize-none rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-3 py-3 shadow-[var(--shadow)] focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <button
          aria-label="Voice input"
          className="h-11 w-11 shrink-0 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] shadow-sm"
        >
          🎤
        </button>
        <button
          aria-label="Send message"
          onClick={handleSend}
          disabled={!message.trim()}
          className="h-11 w-11 shrink-0 rounded-[var(--radius)] bg-[var(--text)] text-[var(--bg)] disabled:opacity-50"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
