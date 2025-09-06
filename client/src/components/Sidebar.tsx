import React from 'react';
import { View } from '../App';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
  streakDays: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  streakDays, 
  collapsed,
  onToggleCollapse 
}) => {
  const navigation = [
    { key: 'today' as View, label: 'Today', icon: '✨', gradient: 'from-purple-500 to-pink-500' },
    { key: 'journal' as View, label: 'Journal', icon: '📝', gradient: 'from-blue-500 to-cyan-500' },
    { key: 'gratitude' as View, label: 'Gratitude', icon: '🌸', gradient: 'from-rose-500 to-orange-400' },
    { key: 'progress' as View, label: 'Progress', icon: '📊', gradient: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className={`sidebar ${collapsed ? 'sidebarCollapsed' : ''}`}>
      <div className="sidebarHeader">
        <div className="appBrand">
          <div className="brandIcon">🌱</div>
          {!collapsed && (
            <div className="brandText">
              <h1 className="brandTitle">Balance</h1>
              <p className="brandSubtitle">Mindful Living</p>
            </div>
          )}
        </div>
        
        <button className="collapseButton" onClick={onToggleCollapse}>
          <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`}></i>
        </button>
      </div>

      <nav className="sidebarNav">
        {navigation.map((item) => (
          <button
            key={item.key}
            className={`navItem ${activeView === item.key ? 'navItemActive' : ''}`}
            onClick={() => onViewChange(item.key)}
            data-testid={`nav-${item.key}`}
          >
            <div className={`navItemIcon bg-gradient-to-r ${item.gradient}`}>
              <span>{item.icon}</span>
            </div>
            {!collapsed && <span className="navItemLabel">{item.label}</span>}
          </button>
        ))}
      </nav>

      {!collapsed && (
        <div className="sidebarFooter">
          <div className="streakCard">
            <div className="streakIcon">🔥</div>
            <div className="streakInfo">
              <div className="streakNumber">{streakDays}</div>
              <div className="streakLabel">Day Streak</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;