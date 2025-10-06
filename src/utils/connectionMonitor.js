// Smart connection monitoring utility
import { checkFirebaseConnection } from './firebaseConnection';

class ConnectionMonitor {
  constructor() {
    this.isOnline = navigator.onLine;
    this.lastCheck = 0;
    this.checkInterval = 120000; // 2 minutes
    this.listeners = [];
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.checkConnection();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners({ connected: false, error: 'You are currently offline.' });
    });
    
    // Initial check
    this.checkConnection();
  }
  
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }
  
  notifyListeners(status) {
    this.listeners.forEach(listener => listener(status));
  }
  
  async checkConnection() {
    // Only check if we're online and enough time has passed
    if (!this.isOnline) {
      this.notifyListeners({ connected: false, error: 'You are currently offline.' });
      return;
    }
    
    const now = Date.now();
    if (now - this.lastCheck < this.checkInterval) {
      return; // Too soon to check again
    }
    
    this.lastCheck = now;
    
    try {
      const status = await checkFirebaseConnection();
      this.notifyListeners(status);
    } catch (error) {
      this.notifyListeners({ 
        connected: false, 
        error: 'Connection check failed. Please check your internet connection.' 
      });
    }
  }
  
  // Force a connection check (useful for retry buttons)
  async forceCheck() {
    this.lastCheck = 0; // Reset timer
    await this.checkConnection();
  }
}

// Create a singleton instance
const connectionMonitor = new ConnectionMonitor();

export default connectionMonitor;
