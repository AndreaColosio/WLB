import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Heart, Zap, X, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PersonalitySelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const personalities = [
  {
    id: 'balanced',
    name: 'Balanced Mode',
    icon: Brain,
    color: 'from-purple-500 to-blue-500',
    description: 'Gentle, balanced guidance for everyday wellness',
    traits: ['Empathetic', 'Balanced', 'Thoughtful'],
  },
  {
    id: 'tony-robbins',
    name: 'Tony Robbins',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    description: 'High energy motivation to unleash your potential',
    traits: ['Energetic', 'Motivational', 'Action-oriented'],
  },
  {
    id: 'jordan-peterson',
    name: 'Jordan Peterson',
    icon: Brain,
    color: 'from-blue-600 to-purple-600',
    description: 'Thoughtful philosophical guidance for life',
    traits: ['Philosophical', 'Structured', 'Meaningful'],
  },
  {
    id: 'carl-jung',
    name: 'Carl Jung',
    icon: Sparkles,
    color: 'from-indigo-600 to-purple-700',
    description: 'Deep introspective exploration of self',
    traits: ['Introspective', 'Symbolic', 'Transformative'],
  },
  {
    id: 'brene-brown',
    name: 'Brené Brown',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    description: 'Empathetic support for vulnerability and courage',
    traits: ['Compassionate', 'Authentic', 'Vulnerable'],
  },
];

export default function PersonalitySelector({ isOpen, onClose }: PersonalitySelectorProps) {
  const { personality, setPersonality } = useTheme();

  const handleSelect = (id: string) => {
    setPersonality(id as any);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div
              className="bg-light-bg dark:bg-dark-bg rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-light-border dark:border-dark-border flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
                    Choose Your Companion
                  </h2>
                  <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
                    Select a personality mode for your Balance Agent
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-light-border/50 dark:hover:bg-dark-border/50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Personality Grid */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-hide">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalities.map((p) => {
                    const Icon = p.icon;
                    const isSelected = personality === p.id;

                    return (
                      <motion.button
                        key={p.id}
                        onClick={() => handleSelect(p.id)}
                        className={`personality-card relative ${isSelected ? 'personality-card-active' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Selection Indicator */}
                        {isSelected && (
                          <motion.div
                            className="absolute top-3 right-3 bg-accent-purple rounded-full p-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}

                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center mb-4 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* Content */}
                        <div className="text-left">
                          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                            {p.name}
                          </h3>
                          <p className="text-sm text-light-muted dark:text-dark-muted mb-3">
                            {p.description}
                          </p>

                          {/* Traits */}
                          <div className="flex flex-wrap gap-2">
                            {p.traits.map((trait) => (
                              <span
                                key={trait}
                                className="px-2 py-1 text-xs rounded-full bg-light-border dark:bg-dark-border text-light-text dark:text-dark-text"
                              >
                                {trait}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
