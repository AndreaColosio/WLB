import { motion } from 'framer-motion';
import { Brain, Sparkles, Heart, Zap, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const personalityConfig = {
  'balanced': {
    name: 'Balanced Mode',
    icon: Brain,
    color: 'from-purple-500 to-blue-500',
    description: 'Gentle, balanced guidance',
  },
  'tony-robbins': {
    name: 'Tony Robbins Mode',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    description: 'High energy, motivational',
  },
  'jordan-peterson': {
    name: 'Jordan Peterson Mode',
    icon: Brain,
    color: 'from-blue-600 to-purple-600',
    description: 'Thoughtful, philosophical',
  },
  'carl-jung': {
    name: 'Carl Jung Mode',
    icon: Sparkles,
    color: 'from-indigo-600 to-purple-700',
    description: 'Deep, introspective',
  },
  'brene-brown': {
    name: 'Brené Brown Mode',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    description: 'Empathetic, vulnerable',
  },
};

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPersonality?: boolean;
  onClick?: () => void;
}

export default function Avatar({ size = 'lg', showPersonality = true, onClick }: AvatarProps) {
  const { personality } = useTheme();
  const config = personalityConfig[personality];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className={`relative ${sizeClasses[size]} cursor-pointer`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        {/* Avatar Circle with Gradient */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-2xl avatar-glow`}
          animate={{
            boxShadow: [
              '0 0 30px rgba(124, 58, 237, 0.3), 0 0 60px rgba(124, 58, 237, 0.15)',
              '0 0 40px rgba(124, 58, 237, 0.5), 0 0 80px rgba(124, 58, 237, 0.25)',
              '0 0 30px rgba(124, 58, 237, 0.3), 0 0 60px rgba(124, 58, 237, 0.15)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon className={`${iconSizes[size]} text-white`} />
        </motion.div>

        {/* Online Status Indicator */}
        <motion.div
          className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-light-bg dark:border-dark-bg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="w-full h-full bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Personality Label */}
      {showPersonality && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">
            Balance Agent
          </h3>
          <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
            {config.name}
          </p>
        </motion.div>
      )}
    </div>
  );
}
