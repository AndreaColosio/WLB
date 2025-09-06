import { useState } from 'react';
import { useEntries, useCreateEntry, useAgentCard } from '../hooks/useApi';
import styles from '../App.module.css';

const Journal: React.FC = () => {
  const [newEntry, setNewEntry] = useState('');
  const { data: entries, isLoading } = useEntries('JOURNAL');
  const { data: agentCard } = useAgentCard('morning');
  const createEntry = useCreateEntry();

  const handleSave = async () => {
    if (!newEntry.trim()) return;

    try {
      await createEntry.mutateAsync({
        type: 'JOURNAL',
        content: newEntry.trim(),
      });
      setNewEntry('');
    } catch (error) {
      console.error('Error saving journal entry:', error);
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

  return (
    <div className={styles.journalTab}>
      <div className={styles.tabContent}>
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <i className="fas fa-plus"></i>
            New Journal Entry
          </h3>
          
          <div className={styles.newEntryContent}>
            {agentCard && (
              <div className={styles.promptSuggestion}>
                <p className={styles.promptLabel}>Suggested prompt:</p>
                <p className={styles.promptText} data-testid="journal-prompt">{agentCard.prompt}</p>
              </div>
            )}
            
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Start writing..."
              rows={4}
              className={styles.textarea}
              data-testid="journal-textarea"
            />
            
            <button
              onClick={handleSave}
              disabled={!newEntry.trim() || createEntry.isPending}
              className={styles.saveButton}
              data-testid="save-journal-button"
            >
              {createEntry.isPending ? 'Saving...' : 'Save Journal Entry'}
            </button>
          </div>
        </div>

        <div className={styles.entriesSection}>
          <h3 className={styles.sectionTitle}>Recent Entries</h3>
          
          {isLoading ? (
            <div className={styles.loading}>Loading entries...</div>
          ) : entries?.length ? (
            <div className={styles.entriesList}>
              {entries.map((entry) => (
                <div key={entry.id} className={styles.entryCard} data-testid={`journal-entry-${entry.id}`}>
                  <div className={styles.entryHeader}>
                    <span className={styles.entryDate}>
                      {formatDate(entry.createdAt)}
                    </span>
                    <i className="fas fa-ellipsis-h"></i>
                  </div>
                  <p className={styles.entryContent} data-testid={`journal-content-${entry.id}`}>
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No journal entries yet. Start writing to capture your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
