import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import CalendarSidebar from './components/CalendarSidebar';
import Today from './pages/Today';
import Journal from './pages/Journal';
import Gratitude from './pages/Gratitude';
import Progress from './pages/Progress';
import './App.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export type View = 'today' | 'journal' | 'gratitude' | 'progress';

function App() {
  const [activeView, setActiveView] = useState<View>('today');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [streakDays, setStreakDays] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'today':
        return <Today selectedDate={selectedDate} onStreakUpdate={setStreakDays} />;
      case 'journal':
        return <Journal selectedDate={selectedDate} />;
      case 'gratitude':
        return <Gratitude selectedDate={selectedDate} />;
      case 'progress':
        return <Progress />;
      default:
        return <Today selectedDate={selectedDate} onStreakUpdate={setStreakDays} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          streakDays={streakDays}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="appContent">
          <CalendarSidebar 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            collapsed={sidebarCollapsed}
          />
          
          <main className="mainContent">
            <div className="contentContainer">
              {renderActiveView()}
            </div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
