import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AvatarChat from './components/AvatarChat';
import './App.module.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <AvatarChat />
      </div>
    </QueryClientProvider>
  );
}

export default App;
