import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';

interface InputAreaProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function InputArea({ onSend, isLoading = false, placeholder = "Share how you're feeling..." }: InputAreaProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
    if (!isRecording) {
      // Start recording
      console.log('Starting voice recording...');
    } else {
      // Stop recording
      console.log('Stopping voice recording...');
    }
  };

  return (
    <div className="input-container md:left-64">
      <div className="max-w-chat mx-auto">
        <div className="flex items-end gap-3">
          {/* Voice Record Button */}
          <motion.button
            onClick={toggleRecording}
            className={`btn-secondary flex-shrink-0 ${isRecording ? 'bg-red-500 text-white border-red-500' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div
                  key="recording"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <MicOff className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                >
                  <Mic className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Text Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? 'Recording...' : placeholder}
              disabled={isLoading || isRecording}
              className="input-field max-h-[150px]"
              rows={1}
            />
          </div>

          {/* Send Button */}
          <AnimatePresence>
            {(message.trim() || isLoading) && (
              <motion.button
                onClick={handleSend}
                disabled={isLoading || !message.trim()}
                className="btn-primary flex-shrink-0"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Recording Indicator */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 flex items-center justify-center gap-2 text-sm text-red-500"
            >
              <motion.div
                className="w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="font-medium">Recording in progress...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
