// Simple encryption utilities for sensitive data
// Note: This is a basic implementation. For production, use proper encryption libraries

const ENCRYPTION_KEY = 'hioney-secure-key-2024';

// Simple XOR encryption (for demo purposes)
const xorEncrypt = (text: string, key: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
};

const xorDecrypt = (encryptedText: string, key: string): string => {
  try {
    const text = atob(encryptedText);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

export const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    return xorEncrypt(jsonString, ENCRYPTION_KEY);
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

export const decryptData = (encryptedData: string): any => {
  try {
    const decryptedString = xorDecrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Hash function for sensitive data
export const hashData = (data: string): string => {
  let hash = 0;
  if (data.length === 0) return hash.toString();
  
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
};

// Mask sensitive data for display
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (data.length <= visibleChars) return '*'.repeat(data.length);
  
  const start = data.substring(0, visibleChars);
  const end = data.substring(data.length - visibleChars);
  const middle = '*'.repeat(data.length - (visibleChars * 2));
  
  return start + middle + end;
};

// Validate data integrity
export const validateDataIntegrity = (data: any, hash: string): boolean => {
  const dataString = JSON.stringify(data);
  const calculatedHash = hashData(dataString);
  return calculatedHash === hash;
};

