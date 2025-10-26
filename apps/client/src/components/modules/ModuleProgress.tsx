import { useState, useEffect } from 'react';
import { storage } from '../../services/storage';

interface ModuleProgressProps {
  onSave: () => void;
  onClose: () => void;
}

const ModuleProgress = ({ onSave, onClose }: ModuleProgressProps) => {
  const [win, setWin] = useState('');

  const getStreak = () => {
    const latest = storage.getJson<{ win: string; streak: number; ts: number } | null>('progress', 'latest', null);
    if (!latest) return 0;
    
    const daysSince = Math.floor((Date.now() - latest.ts) / (1000 * 60 * 60 * 24));
    return daysSince === 0 ? latest.streak : 0;
  };

  const handleSave = () => {
    if (win.trim()) {
      const streak = getStreak() + 1;
      const data = { win, streak, ts: Date.now() };
      storage.setJson('progress', `entry_${Date.now()}`, data);
      storage.setJson('progress', 'latest', data);
      setWin('');
      onSave();
    }
  };

  const currentStreak = getStreak();

  return (
    <div className="p-4 bg-green-50 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Small Win</h3>
        {currentStreak > 0 && (
          <span className="text-sm text-green-600">🔥 {currentStreak} day streak</span>
        )}
      </div>
      
      <input
        type="text"
        value={win}
        onChange={(e) => setWin(e.target.value.slice(0, 150))}
        placeholder="What win are you celebrating?"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        maxLength={150}
      />
      <div className="text-xs text-gray-500 text-right">{win.length}/150</div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!win.trim()}
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

export default ModuleProgress;
