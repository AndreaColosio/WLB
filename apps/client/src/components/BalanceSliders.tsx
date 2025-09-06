import React, { useState } from 'react';
import styles from '../App.module.css';

interface BalanceData {
  energy: number;
  rest: number;
  focus: number;
  connection: number;
}

interface BalanceSlidersProps {
  initialValues?: BalanceData;
  onChange: (data: BalanceData) => void;
}

const BalanceSliders: React.FC<BalanceSlidersProps> = ({ 
  initialValues = { energy: 7, rest: 6, focus: 8, connection: 5 },
  onChange 
}) => {
  const [values, setValues] = useState<BalanceData>(initialValues);

  const handleSliderChange = (field: keyof BalanceData, value: number) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    onChange(newValues);
  };

  const calculateBalanceScore = () => {
    const { energy, rest, focus, connection } = values;
    return ((energy + rest + focus + connection) / 4).toFixed(1);
  };

  const sliders: { key: keyof BalanceData; label: string }[] = [
    { key: 'energy', label: 'Energy' },
    { key: 'rest', label: 'Rest' },
    { key: 'focus', label: 'Focus' },
    { key: 'connection', label: 'Connection' },
  ];

  return (
    <div className={styles.balanceCheckin}>
      <h3 className={styles.balanceTitle}>
        <i className="fas fa-balance-scale"></i>
        Daily Balance Check-in
      </h3>
      
      <div className={styles.slidersContainer}>
        {sliders.map(({ key, label }) => (
          <div key={key} className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
              <label className={styles.sliderLabel}>{label}</label>
              <span className={styles.sliderValue} data-testid={`slider-value-${key}`}>
                {values[key]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={values[key]}
              onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
              className={styles.slider}
              data-testid={`slider-${key}`}
            />
          </div>
        ))}
        
        <div className={styles.balanceScore}>
          <div className={styles.balanceScoreContent}>
            <span className={styles.balanceScoreLabel}>Balance Score</span>
            <div className={styles.balanceScoreValue}>
              <span className={styles.balanceScoreNumber} data-testid="balance-score">
                {calculateBalanceScore()}
              </span>
              <span className={styles.balanceScoreMax}>/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSliders;
