// No hooks needed, no React import required
import { useWeeklySummary, useGamification } from '../hooks/useApi';
import styles from '../App.module.css';

const Progress: React.FC = () => {
  const { data: summary, isLoading: summaryLoading } = useWeeklySummary();
  const { data: gamificationData } = useGamification();

  const getBadgeInfo = (code: string) => {
    const badges: Record<string, { icon: string; name: string; description: string }> = {
      FIRST_ENTRY: { 
        icon: 'fas fa-star', 
        name: 'First Entry', 
        description: 'Created your first entry' 
      },
      WEEK_STREAK_7: { 
        icon: 'fas fa-fire', 
        name: '7-Day Streak', 
        description: 'Practiced for 7 consecutive days' 
      },
      GRATITUDE_30: { 
        icon: 'fas fa-heart', 
        name: '30 Gratitudes', 
        description: 'Expressed gratitude 30 times' 
      },
    };
    return badges[code] || { icon: 'fas fa-trophy', name: code, description: 'Achievement unlocked' };
  };

  const earnedBadgeCodes = gamificationData?.badges.map(b => b.code) || [];
  const allBadges = ['FIRST_ENTRY', 'WEEK_STREAK_7', 'GRATITUDE_30'];

  const getGratitudeProgress = () => {
    if (!summary) return { current: 0, target: 30 };
    const gratitudeCount = summary.gratitude || 0;
    return { current: Math.min(gratitudeCount, 30), target: 30 };
  };

  return (
    <div className={styles.progressTab}>
      <div className={styles.tabContent}>
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <i className="fas fa-calendar-week"></i>
            This Week
          </h3>
          
          {summaryLoading ? (
            <div className={styles.loading}>Loading summary...</div>
          ) : summary ? (
            <div className={styles.weeklyStats}>
              <div className={styles.statCard}>
                <div className={styles.statNumber} data-testid="weekly-journal-count">
                  {summary.journal}
                </div>
                <div className={styles.statLabel}>Journal Entries</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber} data-testid="weekly-gratitude-count">
                  {summary.gratitude}
                </div>
                <div className={styles.statLabel}>Gratitudes</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber} data-testid="weekly-avg-balance">
                  {summary.avgScore?.toFixed(1) || 'N/A'}
                </div>
                <div className={styles.statLabel}>Avg Balance</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber} data-testid="weekly-streak-days">
                  {summary.streakDays}
                </div>
                <div className={styles.statLabel}>Streak Days</div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>Unable to load weekly summary</div>
          )}
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>Balance Score Trend</h3>
          <div className={styles.chartContainer}>
            <svg width="280" height="60" viewBox="0 0 280 60" className={styles.sparkline}>
              <path 
                d="M 10 45 L 50 35 L 90 40 L 130 25 L 170 30 L 210 20 L 250 25" 
                className={styles.sparklinePath}
              />
              <circle cx="250" cy="25" r="3" fill="hsl(142.1, 76.2%, 36.3%)" />
            </svg>
          </div>
          <div className={styles.chartLabels}>
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <i className="fas fa-trophy" style={{ color: '#f59e0b' }}></i>
            Achievements
          </h3>
          
          <div className={styles.badgesGrid}>
            {allBadges.map((badgeCode) => {
              const badgeInfo = getBadgeInfo(badgeCode);
              const isEarned = earnedBadgeCodes.includes(badgeCode);
              const gratitudeProgress = getGratitudeProgress();
              
              return (
                <div 
                  key={badgeCode} 
                  className={`${styles.badge} ${isEarned ? styles.badgeEarned : styles.badgeUnearned}`}
                  data-testid={`badge-${badgeCode.toLowerCase()}`}
                >
                  <i className={`${badgeInfo.icon} ${styles.badgeIcon}`}></i>
                  <div className={styles.badgeName}>{badgeInfo.name}</div>
                  <div className={styles.badgeStatus}>
                    {isEarned ? 'Earned' : 
                      badgeCode === 'GRATITUDE_30' ? 
                        `${gratitudeProgress.current}/${gratitudeProgress.target}` : 
                        'Locked'
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.insightsCard}>
          <div className={styles.insightsContent}>
            <div className={styles.insightsHeader}>
              <i className="fas fa-lightbulb"></i>
              <h3>Insights</h3>
            </div>
            <p data-testid="progress-insights">
              You're building a beautiful practice! Your consistency this week shows real commitment to your wellbeing. Keep reflecting and growing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
