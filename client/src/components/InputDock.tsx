import { useState, KeyboardEvent } from 'react';
import { Mic } from 'lucide-react';

interface InputDockProps {
  onSend: (message: string) => void;
}

const InputDock = ({ onSend }: InputDockProps) => {
  const [message, setMessage] = useState('');

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="border-t p-4 bg-white">
      <div className="flex gap-2 items-end">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share what's on your mind..."
          className="flex-1 min-h-[60px] max-h-[120px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={2}
        />
        <button
          onClick={() => console.log('Mic pressed')}
          className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InputDock;
