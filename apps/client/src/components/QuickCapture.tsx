import React, { useState } from 'react';
import { useCreateEntry } from '../hooks/useApi';
import styles from '../App.module.css';

interface QuickCaptureProps {
  onSuccess?: () => void;
}

const QuickCapture: React.FC<QuickCaptureProps> = ({ onSuccess }) => {
  const [journalContent, setJournalContent] = useState('');
  const [gratitudeContent, setGratitudeContent] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const createEntry = useCreateEntry();

  const gratitudeSuggestions = [
    'My health',
    'A good friend',
    'This moment'
  ];

  const handleSave = async () => {
    const entries = [];
    
    if (journalContent.trim()) {
      entries.push({ type: 'JOURNAL', content: journalContent.trim() });
    }
    
    if (gratitudeContent.trim()) {
      entries.push({ type: 'GRATITUDE', content: gratitudeContent.trim() });
    }

    if (entries.length === 0) {
      return;
    }

    try {
      for (const entry of entries) {
        await createEntry.mutateAsync(entry);
      }
      
      setJournalContent('');
      setGratitudeContent('');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setGratitudeContent(suggestion);
  };

  return (
    <div className={styles.quickCapture}>
      <h3 className={styles.quickCaptureTitle}>
        <i className="fas fa-pencil"></i>
        Quick Capture
      </h3>

      <div className={styles.quickCaptureContent}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Journal Entry</label>
          <textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="What's on your mind today?"
            rows={3}
            className={styles.textarea}
            data-testid="journal-input"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Gratitude</label>
          <input
            type="text"
            value={gratitudeContent}
            onChange={(e) => setGratitudeContent(e.target.value)}
            placeholder="What are you grateful for?"
            className={styles.input}
            data-testid="gratitude-input"
          />
          
          <div className={styles.suggestions}>
            {gratitudeSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={styles.suggestionButton}
                data-testid={`suggestion-${suggestion.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={createEntry.isPending || (!journalContent.trim() && !gratitudeContent.trim())}
          className={styles.saveButton}
          data-testid="save-entry-button"
        >
          {createEntry.isPending ? 'Saving...' : 'Save Entry'}
        </button>
      </div>

      {showToast && (
        <div className={styles.toast} data-testid="success-toast">
          <div className={styles.toastContent}>
            <i className="fas fa-check-circle"></i>
            <span>Entry saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickCapture;
