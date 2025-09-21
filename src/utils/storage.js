// Local Storage utilities with encryption

import { LS_KEY } from '../constants';
import { encryptData, decryptData, hashData, validateDataIntegrity } from './encryption';

export const loadState = () => {
  try {
    const encryptedData = localStorage.getItem(LS_KEY);
    const dataHash = localStorage.getItem(`${LS_KEY}_hash`);
    
    if (!encryptedData) return null;
    
    // Try to decrypt the data
    const decryptedData = decryptData(encryptedData);
    if (!decryptedData) {
      // Fallback to plain JSON if decryption fails (for backward compatibility)
      return JSON.parse(encryptedData);
    }
    
    // Validate data integrity if hash exists
    if (dataHash && !validateDataIntegrity(decryptedData, dataHash)) {
      console.warn('Data integrity check failed');
    }
    
    return decryptedData;
  } catch (error) {
    console.error('Failed to load state:', error);
    return null;
  }
};

export const saveState = (state) => {
  try {
    // Encrypt sensitive data
    const encryptedData = encryptData(state);
    const dataHash = hashData(JSON.stringify(state));
    
    localStorage.setItem(LS_KEY, encryptedData);
    localStorage.setItem(`${LS_KEY}_hash`, dataHash);
  } catch (error) {
    console.error('Failed to save state:', error);
    // Fallback to plain JSON if encryption fails
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (fallbackError) {
      console.error('Fallback save also failed:', fallbackError);
    }
  }
};

export const clearState = () => {
  try {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(`${LS_KEY}_hash`);
  } catch (error) {
    console.error('Failed to clear state:', error);
  }
};

export const exportData = (state) => {
  try {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hioney-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export data:', error);
  }
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('File không hợp lệ'));
      }
    };
    reader.onerror = () => reject(new Error('Không thể đọc file'));
    reader.readAsText(file);
  });
};


