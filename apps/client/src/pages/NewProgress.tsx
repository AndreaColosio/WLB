import { motion } from 'framer-motion';
import { TrendingUp, Activity } from 'lucide-react';

export default function NewProgress() {
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
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">Progress</h1>
              <p className="text-sm text-light-muted dark:text-dark-muted">Track your wellness journey</p>
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
            <Activity className="w-12 h-12 text-light-muted dark:text-dark-muted" />
          </div>
          <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-3">
            Your Progress Dashboard
          </h2>
          <p className="text-light-muted dark:text-dark-muted max-w-md mx-auto mb-6">
            Your wellness metrics and progress will be visualized here. Keep chatting with your Balance Agent to build your history!
          </p>
          <motion.a
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-full font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp className="w-5 h-5" />
            Continue in Chat
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}
