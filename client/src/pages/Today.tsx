import { useState, useEffect } from 'react';
import AgentCard from '../components/AgentCard';
import BalanceSliders from '../components/BalanceSliders';
import QuickCapture from '../components/QuickCapture';
import { useAgentCard, useCreateCheckin, useGamification } from '../hooks/useApi';
import styles from '../App.module.css';

interface TodayProps {
  onStreakUpdate: (streak: number) => void;
}

const Today: React.FC<TodayProps> = ({ onStreakUpdate }) => {
  const [balanceData, setBalanceData] = useState({
    energy: 7,
    rest: 6,
    focus: 8,
    connection: 5,
  });

  const getTimeOfDay = (): 'morning' | 'midday' | 'evening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'midday';
    return 'evening';
  };

  const { data: agentCard, isLoading: agentLoading } = useAgentCard(getTimeOfDay());
  const { data: gamificationData } = useGamification();
  const createCheckin = useCreateCheckin();

  useEffect(() => {
    if (gamificationData?.streakDays !== undefined) {
      onStreakUpdate(gamificationData.streakDays);
    }
  }, [gamificationData, onStreakUpdate]);

  const handleBalanceChange = async (data: typeof balanceData) => {
    setBalanceData(data);
    
    // Auto-save checkin when sliders change
    try {
      await createCheckin.mutateAsync({
        energy: data.energy,
        rest: data.rest,
        focus: data.focus,
        connection: data.connection,
      });
    } catch (error) {
      console.error('Error saving checkin:', error);
    }
  };

  const handleQuickCaptureSuccess = () => {
    // Refresh gamification data when entries are saved
  };

  return (
    <div className={styles.todayTab}>
      <div className={styles.tabContent}>
        {agentCard && (
          <AgentCard card={agentCard} isLoading={agentLoading} />
        )}
        
        <div className={styles.card}>
          <BalanceSliders
            initialValues={balanceData}
            onChange={handleBalanceChange}
          />
        </div>

        <div className={styles.card}>
          <QuickCapture onSuccess={handleQuickCaptureSuccess} />
        </div>
      </div>
    </div>
  );
};

export default Today;
