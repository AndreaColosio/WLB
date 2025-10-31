import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        {/* Top Bar (Mobile) */}
        <motion.header
          className="md:hidden sticky top-0 z-20 bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-xl border-b border-light-border dark:border-dark-border"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-light-border/50 dark:hover:bg-dark-border/50 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold">Balance Agent</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </motion.header>

        {/* Page Content */}
        <main className="flex-1 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
