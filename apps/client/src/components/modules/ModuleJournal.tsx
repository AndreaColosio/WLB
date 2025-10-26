import { useState, useEffect } from 'react';
import { storage } from '../../services/storage';

interface ModuleJournalProps {
  onSave: () => void;
  onClose: () => void;
}

const prompts = [
  "What's on your mind?",
  "What went well today?",
  "What challenged you?",
];

const ModuleJournal = ({ onSave, onClose }: ModuleJournalProps) => {
  const [text, setText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const [autoSaved, setAutoSaved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (text.trim()) {
        storage.setJson('journal', 'draft', { text, prompt: selectedPrompt, ts: Date.now() });
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 1000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [text, selectedPrompt]);

  const handleSave = () => {
    if (text.trim()) {
      storage.setJson('journal', `entry_${Date.now()}`, { text, prompt: selectedPrompt, ts: Date.now() });
      storage.setJson('journal', 'latest', { text, prompt: selectedPrompt, ts: Date.now() });
      storage.remove('journal', 'draft');
      setText('');
      onSave();
    }
  };

  return (
    <div className="p-4 bg-purple-50 rounded-lg space-y-3">
      <h3 className="font-semibold">Quick Journal</h3>
      
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => setSelectedPrompt(prompt)}
            className={`px-3 py-1 text-xs rounded-full border ${
              selectedPrompt === prompt
                ? 'bg-purple-200 border-purple-400'
                : 'bg-white border-gray-300'
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, 500))}
        placeholder="Start writing..."
        className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
        maxLength={500}
      />
      <div className="text-xs text-gray-500 text-right">{text.length}/500</div>

      {autoSaved && (
        <div className="text-xs text-green-600">Auto-saved</div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!text.trim()}
          className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ModuleJournal;
