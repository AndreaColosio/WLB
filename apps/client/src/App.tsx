import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AvatarChat from './components/AvatarChat';
import TabNavigation from './components/TabNavigation';
import Today from './pages/Today.js';
import Journal from './pages/Journal.js';
import Gratitude from './pages/Gratitude.js';
import Progress from './pages/Progress.js';
import { MessageSquare, BarChart3, BookOpen, Heart } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export type Tab = 'chat' | 'today' | 'journal' | 'gratitude' | 'progress';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [streakDays, setStreakDays] = useState(0);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <AvatarChat onMessageSent={(message) => console.log('Message sent:', message)} />;
      case 'today':
        return <Today onStreakUpdate={setStreakDays} />;
      case 'journal':
        return <Journal />;
      case 'gratitude':
        return <Gratitude />;
      case 'progress':
        return <Progress />;
      default:
        return <AvatarChat onMessageSent={(message) => console.log('Message sent:', message)} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Modern Header */}
        <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">Balance Agent</h1>
                  <p className="text-sm text-gray-600">Your mindful companion</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{streakDays} day streak</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Modern Tab Navigation */}
        <div className="glass-effect border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'chat', label: 'Chat', icon: MessageSquare },
                { id: 'today', label: 'Today', icon: BarChart3 },
                { id: 'journal', label: 'Journal', icon: BookOpen },
                { id: 'gratitude', label: 'Gratitude', icon: Heart },
                { id: 'progress', label: 'Progress', icon: BarChart3 },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-[calc(100vh-200px)]">
            {renderActiveTab()}
          </div>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
