import React, { useState } from 'react';
import { useEntries, useCreateEntry, useGamification } from '../hooks/useApi';
import styles from '../App.module.css';

const Gratitude: React.FC = () => {
  const [newGratitude, setNewGratitude] = useState('');
  const { data: entries, isLoading } = useEntries('GRATITUDE');
  const { data: gamificationData } = useGamification();
  const createEntry = useCreateEntry();

  const handleSave = async () => {
    if (!newGratitude.trim()) return;

    try {
      await createEntry.mutateAsync({
        type: 'GRATITUDE',
        content: newGratitude.trim(),
      });
      setNewGratitude('');
    } catch (error) {
      console.error('Error saving gratitude entry:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const getThisWeekCount = () => {
    if (!entries) return 0;
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return entries.filter(entry => new Date(entry.createdAt) > oneWeekAgo).length;
  };

  return (
    <div className={styles.gratitudeTab}>
      <div className={styles.tabContent}>
        <div className={styles.gratitudeStats}>
          <div className={styles.gratitudeStatsContent}>
            <div className={styles.gratitudeStatsHeader}>
              <div>
                <h3>Gratitude Practice</h3>
                <p>Keep building your positive mindset</p>
              </div>
              <div className={styles.gratitudeStreak}>
                <div className={styles.gratitudeStreakNumber} data-testid="gratitude-streak">
                  {gamificationData?.streakDays || 0}
                </div>
                <div className={styles.gratitudeStreakLabel}>day streak</div>
              </div>
            </div>
            
            <div className={styles.gratitudeCounts}>
              <div className={styles.gratitudeCount}>
                <div className={styles.gratitudeCountNumber} data-testid="total-gratitude-count">
                  {entries?.length || 0}
                </div>
                <div className={styles.gratitudeCountLabel}>Total</div>
              </div>
              <div className={styles.gratitudeCount}>
                <div className={styles.gratitudeCountNumber} data-testid="weekly-gratitude-count">
                  {getThisWeekCount()}
                </div>
                <div className={styles.gratitudeCountLabel}>This week</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <i className="fas fa-heart" style={{ color: '#f59e0b' }}></i>
            Add Gratitude
          </h3>
          
          <div className={styles.newEntryContent}>
            <input
              type="text"
              value={newGratitude}
              onChange={(e) => setNewGratitude(e.target.value)}
              placeholder="I'm grateful for..."
              className={styles.input}
              onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              data-testid="new-gratitude-input"
            />
            
            <button
              onClick={handleSave}
              disabled={!newGratitude.trim() || createEntry.isPending}
              className={styles.secondaryButton}
              data-testid="save-gratitude-button"
            >
              {createEntry.isPending ? 'Saving...' : 'Add to Gratitude List'}
            </button>
          </div>
        </div>

        <div className={styles.entriesSection}>
          <h3 className={styles.sectionTitle}>Recent Gratitudes</h3>
          
          {isLoading ? (
            <div className={styles.loading}>Loading gratitudes...</div>
          ) : entries?.length ? (
            <div className={styles.gratitudeList}>
              {entries.map((entry) => (
                <div key={entry.id} className={styles.gratitudeItem} data-testid={`gratitude-entry-${entry.id}`}>
                  <div className={styles.gratitudeItemContent}>
                    <i className="fas fa-heart" style={{ color: '#f59e0b' }}></i>
                    <div className={styles.gratitudeItemText}>
                      <p data-testid={`gratitude-content-${entry.id}`}>{entry.content}</p>
                      <span className={styles.gratitudeItemDate}>
                        {formatDate(entry.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No gratitudes yet. Start building your appreciation practice!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gratitude;
