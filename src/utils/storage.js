// Local Storage utilities

import { LS_KEY } from '../constants';

export const loadState = () => {
  try {
    const s = localStorage.getItem(LS_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

export const saveState = (state) => {
  try { 
    localStorage.setItem(LS_KEY, JSON.stringify(state)); 
  } catch (error) {
    console.error('Failed to save state:', error);
  }
};

export const clearState = () => {
  try {
    localStorage.removeItem(LS_KEY);
  } catch (error) {
    console.error('Failed to clear state:', error);
  }
};

export const exportData = (state) => {
  const dataStr = JSON.stringify(state, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hioney-backup.json';
  link.click();
  URL.revokeObjectURL(url);
};

