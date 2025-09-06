import React from 'react';
import { View } from '../App';
import styles from '../App.module.css';

interface TabNavigationProps {
  activeTab: View;
  onTabChange: (tab: View) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: View; label: string; icon: string }[] = [
    { key: 'today', label: 'Today', icon: 'fas fa-home' },
    { key: 'journal', label: 'Journal', icon: 'fas fa-book' },
    { key: 'gratitude', label: 'Gratitude', icon: 'fas fa-heart' },
    { key: 'progress', label: 'Progress', icon: 'fas fa-chart-line' },
  ];

  return (
    <nav className={styles.tabNavigation}>
      <div className={styles.tabContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.key)}
            data-testid={`tab-${tab.key}`}
          >
            <i className={`${tab.icon} ${styles.tabIcon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;
