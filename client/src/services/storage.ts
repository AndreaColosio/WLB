const STORAGE_PREFIX = 'balance_agent';

const getStorageKey = (module: string, key: string) => 
  `${STORAGE_PREFIX}_${module}_${key}`;

export const storage = {
  getJson: <T>(module: string, key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(getStorageKey(module, key));
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  setJson: <T>(module: string, key: string, value: T): void => {
    try {
      localStorage.setItem(getStorageKey(module, key), JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  keys: (module: string): string[] => {
    const prefix = getStorageKey(module, '');
    return Object.keys(localStorage)
      .filter(key => key.startsWith(prefix))
      .map(key => key.replace(prefix, ''));
  },

  remove: (module: string, key: string): void => {
    localStorage.removeItem(getStorageKey(module, key));
  },

  clear: (module: string): void => {
    const keys = storage.keys(module);
    keys.forEach(key => storage.remove(module, key));
  }
};
