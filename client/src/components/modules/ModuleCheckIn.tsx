import { useState, useEffect } from 'react';
import { storage } from '../../services/storage';

interface ModuleCheckInProps {
  onSave: () => void;
  onClose: () => void;
}

const ModuleCheckIn = ({ onSave, onClose }: ModuleCheckInProps) => {
  const [mood, setMood] = useState(4);
  const [energy, setEnergy] = useState(4);
  const [stress, setStress] = useState(4);

  const handleSave = () => {
    const data = {
      mood,
      energy,
      stress,
      tags: [] as string[],
      ts: Date.now(),
    };
    storage.setJson('checkin', `entry_${Date.now()}`, data);
    storage.setJson('checkin', 'latest', data);
    onSave();
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg space-y-4">
      <h3 className="font-semibold">Quick Check-in</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Mood (1-7)</label>
          <input
            type="range"
            min="1"
            max="7"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>{mood}</span>
            <span>High</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Energy (1-7)</label>
          <input
            type="range"
            min="1"
            max="7"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>{energy}</span>
            <span>High</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stress (1-7)</label>
          <input
            type="range"
            min="1"
            max="7"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Low</span>
            <span>{stress}</span>
            <span>High</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
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

export default ModuleCheckIn;
