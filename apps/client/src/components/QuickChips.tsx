import { CheckCircle2, BookOpen, Heart, TrendingUp } from 'lucide-react';

interface QuickChipsProps {
  onSelect: (module: 'checkin' | 'journal' | 'gratitude' | 'progress') => void;
}

const chips = [
  { id: 'checkin' as const, label: 'Check-in', icon: CheckCircle2 },
  { id: 'journal' as const, label: 'Journal', icon: BookOpen },
  { id: 'gratitude' as const, label: 'Gratitude', icon: Heart },
  { id: 'progress' as const, label: 'Progress', icon: TrendingUp },
];

const QuickChips = ({ onSelect }: QuickChipsProps) => {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      {chips.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors text-sm"
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
};

export default QuickChips;
