import React, { useState, useEffect } from 'react';
import { retryConnection } from '../utils/firebaseConnection';
import connectionMonitor from '../utils/connectionMonitor';

const ConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState({ connected: true, error: null });
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Subscribe to connection status updates
    const unsubscribe = connectionMonitor.addListener((status) => {
      setConnectionStatus(status);
    });
    
    return unsubscribe;
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await connectionMonitor.forceCheck();
    } finally {
      setIsRetrying(false);
    }
  };

  if (connectionStatus.connected) {
    return null; // Don't show anything if connected
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
              Kết nối bị gián đoạn
            </h4>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              {connectionStatus.error}
            </p>
            
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isRetrying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-red-700" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang thử lại...
                  </>
                ) : (
                  'Thử lại'
                )}
              </button>
              
              <button
                onClick={() => setConnectionStatus({ connected: true, error: null })}
                className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Ẩn
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionStatus;
