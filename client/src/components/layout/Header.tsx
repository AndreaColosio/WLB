import { MessageSquare } from 'lucide-react';

const Header = () => {
  return (
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
        </div>
      </div>
    </header>
  );
};

export default Header;
