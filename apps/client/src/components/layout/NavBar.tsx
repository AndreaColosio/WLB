import { MessageSquare, BarChart3, BookOpen, Heart, TrendingUp } from 'lucide-react';
import NavItem from './NavItem';

const NavBar = () => {
  const navItems = [
    { id: '/chat', label: 'Chat', icon: MessageSquare },
    { id: '/today', label: 'Today', icon: BarChart3 },
    { id: '/journal', label: 'Journal', icon: BookOpen },
    { id: '/gratitude', label: 'Gratitude', icon: Heart },
    { id: '/progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <div className="glass-effect border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <NavItem key={item.id} to={item.id} icon={item.icon} label={item.label} />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
