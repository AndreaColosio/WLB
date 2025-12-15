import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export default function NewGratitude() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Gratitude</h1>
              <p className="text-sm text-light-muted dark:text-dark-muted">Count your blessings</p>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-light-surface dark:bg-dark-surface flex items-center justify-center border border-light-border dark:border-dark-border">
            <Sparkles className="w-12 h-12 text-light-muted dark:text-dark-muted" />
          </div>
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-3">
            Gratitude Journal
          </h2>
          <p className="text-light-muted dark:text-dark-muted max-w-md mx-auto mb-6">
            Your gratitude entries will appear here. Share what you're grateful for in the Chat, and it will be automatically recorded.
          </p>
          <motion.a
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-full font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className="w-5 h-5" />
            Express Gratitude in Chat
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
