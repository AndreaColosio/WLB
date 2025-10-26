import { NavLink } from 'react-router-dom';
import { MessageSquare, BarChart3, BookOpen, Heart, TrendingUp } from 'lucide-react';

const NavBar = () => {
  const navItems = [
    { id: '/', label: 'Chat', icon: MessageSquare },
    { id: '/today', label: 'Today', icon: BarChart3 },
    { id: '/journal', label: 'Journal', icon: BookOpen },
    { id: '/gratitude', label: 'Gratitude', icon: Heart },
    { id: '/progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <div className="glass-effect border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.id}
                className={({ isActive }) =>
                  `flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 min-h-[44px] ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
