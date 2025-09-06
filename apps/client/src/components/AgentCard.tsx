import React from 'react';
import { AgentCard as AgentCardType } from '../hooks/useApi';
import styles from '../App.module.css';

interface AgentCardProps {
  card: AgentCardType;
  isLoading?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ card, isLoading }) => {
  if (isLoading) {
    return (
      <div className={styles.agentCard}>
        <div className={styles.agentCardContent}>
          <div className={styles.loading}>Loading guidance...</div>
        </div>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'journal': return 'Journal';
      case 'gratitude': return 'Gratitude';
      case 'reset': return 'Reset';
      case 'wind_down': return 'Wind Down';
      default: return 'Reflection';
    }
  };

  return (
    <div className={styles.agentCard} data-testid="agent-card">
      <div className={styles.agentCardContent}>
        <div className={styles.agentCardHeader}>
          <div className={styles.agentCardIcon}>
            <i className="fas fa-sparkles"></i>
          </div>
          <div className={styles.agentCardTitle}>
            <h3>Good Morning Reflection</h3>
            <p>Category: {getCategoryLabel(card.category)}</p>
          </div>
        </div>
        
        <div className={styles.agentCardSections}>
          <div className={styles.agentCardSection}>
            <h4>Today's Prompt</h4>
            <p data-testid="agent-prompt">{card.prompt}</p>
          </div>
          <div className={styles.agentCardSection}>
            <h4>Reflection</h4>
            <p data-testid="agent-reflection">{card.reflection}</p>
          </div>
          <div className={styles.agentCardSection}>
            <h4>Practice</h4>
            <p className={styles.agentPractice} data-testid="agent-practice">{card.practice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
