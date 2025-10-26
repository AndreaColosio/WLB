import { useState } from 'react';
import { storage } from '../../services/storage';

interface ModuleGratitudeProps {
  onSave: () => void;
  onClose: () => void;
}

const ModuleGratitude = ({ onSave, onClose }: ModuleGratitudeProps) => {
  const [items, setItems] = useState(['', '', '']);

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value.slice(0, 100);
    setItems(newItems);
  };

  const handleSave = () => {
    const validItems = items.filter(item => item.trim()).slice(0, 3);
    if (validItems.length > 0) {
      storage.setJson('gratitude', `entry_${Date.now()}`, { items: validItems, ts: Date.now() });
      storage.setJson('gratitude', 'latest', { items: validItems, ts: Date.now() });
      setItems(['', '', '']);
      onSave();
    }
  };

  return (
    <div className="p-4 bg-yellow-50 rounded-lg space-y-3">
      <h3 className="font-semibold">Gratitude Practice</h3>
      <p className="text-sm text-gray-600">What are you grateful for? (1-3 things)</p>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <input
            key={index}
            type="text"
            value={item}
            onChange={(e) => handleItemChange(index, e.target.value)}
            placeholder={`Gratitude ${index + 1}...`}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            maxLength={100}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!items.some(item => item.trim())}
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

export default ModuleGratitude;
