import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TabNavigation from './components/TabNavigation';
import Today from './pages/Today.js';
import Journal from './pages/Journal.js';
import Gratitude from './pages/Gratitude.js';
import Progress from './pages/Progress.js';
import styles from './App.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export type Tab = 'today' | 'journal' | 'gratitude' | 'progress';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [streakDays, setStreakDays] = useState(0);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'today':
        return <Today onStreakUpdate={setStreakDays} />;
      case 'journal':
        return <Journal />;
      case 'gratitude':
        return <Gratitude />;
      case 'progress':
        return <Progress />;
      default:
        return <Today onStreakUpdate={setStreakDays} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>Balance Agent</h1>
              <p className={styles.subtitle}>Your mindful companion</p>
            </div>
            <div className={styles.streak}>
              <div className={styles.streakContent}>
                <i className="fas fa-fire" style={{ color: '#f59e0b' }}></i>
                <span className={styles.streakNumber} data-testid="streak-days">{streakDays}</span>
                <span className={styles.streakText}>day streak</span>
              </div>
            </div>
          </div>
        </header>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <main className={styles.main}>
          {renderActiveTab()}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
