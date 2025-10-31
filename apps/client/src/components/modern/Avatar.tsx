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
  isActive?: boolean; // When talking or responding
  isSpeaking?: boolean; // When the assistant is speaking
}

export default function Avatar({ size = 'lg', showPersonality = true, onClick, isActive = false, isSpeaking = false }: AvatarProps) {
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
        {/* Animated Glow Waves - Blue, Purple, Orange */}
        {(isActive || isSpeaking) && (
          <>
            {/* Wave 1 - Light Blue */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0.2, 0.6],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Wave 2 - Purple */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(167, 139, 250, 0.4) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.1, 0.5],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />

            {/* Wave 3 - Orange */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.15, 0.4],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </>
        )}

        {/* Main Avatar Circle with Cloud-Moving Effect */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center shadow-2xl relative overflow-hidden`}
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
          {/* Cloud-Moving Effect - Animated Overlay */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 20% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse 80% 50% at 80% 60%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                radial-gradient(ellipse 60% 40% at 50% 40%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)
              `,
            }}
            animate={{
              x: ['-20%', '20%', '-20%'],
              y: ['-10%', '10%', '-10%'],
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Floating clouds effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
                radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 35%)
              `,
            }}
            animate={{
              x: ['0%', '15%', '0%'],
              y: ['0%', '-15%', '0%'],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Icon */}
          <Icon className={`${iconSizes[size]} text-white relative z-10`} />
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
