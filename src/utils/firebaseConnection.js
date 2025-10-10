// Firebase connection utility
import { auth, db } from '../config/firebase';

// Check Firebase connection
export const checkFirebaseConnection = async () => {
  try {
    // Check if Firebase services are initialized
    if (!db || !auth) {
      return { 
        connected: false, 
        error: 'Firebase services are not initialized properly.' 
      };
    }
    
    // Check if we can access Firebase app
    const app = db.app;
    if (!app) {
      return { 
        connected: false, 
        error: 'Firebase app is not available.' 
      };
    }
    
    // Try to get current user (this is a lightweight operation)
    // If user is not authenticated, this will return null but won't throw an error
    const currentUser = auth.currentUser;
    
    // If we reach here, Firebase is properly initialized and accessible
    return { connected: true, error: null };
  } catch (error) {
    console.error('Firebase connection error:', error);
    
    // Check for specific error types
    if (error.code === 'unavailable') {
      return { 
        connected: false, 
        error: 'Firebase service is currently unavailable. Please try again later.' 
      };
    }
    
    if (error.message.includes('ERR_BLOCKED_BY_CLIENT')) {
      return { 
        connected: false, 
        error: 'Firebase connection blocked by browser security or ad blocker. Please disable ad blocker for this site or check your network settings.' 
      };
    }
    
    if (error.code === 'permission-denied') {
      return { 
        connected: false, 
        error: 'Permission denied. Please check your Firebase configuration.' 
      };
    }
    
    if (error.code === 'network-request-failed') {
      return { 
        connected: false, 
        error: 'Network error. Please check your internet connection.' 
      };
    }
    
    return { 
      connected: false, 
      error: 'Unable to connect to Firebase. Please check your internet connection.' 
    };
  }
};

// Show connection status to user
export const showConnectionStatus = (status) => {
  if (!status.connected) {
    // You can customize this to show a toast notification or modal
    console.warn('Firebase Connection Issue:', status.error);
    
    // Example: Show browser notification (requires user permission)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Connection Issue', {
        body: status.error,
        icon: '/favicon-32x32.png'
      });
    }
  }
};

// Retry connection with exponential backoff
export const retryConnection = async (maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    const status = await checkFirebaseConnection();
    if (status.connected) {
      return status;
    }
    
    if (i < maxRetries - 1) {
      console.log(`Retrying connection in ${delay}ms... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  
  return await checkFirebaseConnection();
};
