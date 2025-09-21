import React, { useState, useEffect } from 'react';
import { useFirebaseSync } from '../hooks/useFirebaseSync';

const CloudSync = ({ onDataSync, onDataLoad }) => {
  const { user, syncStatus, syncDataToFirebase, loadDataFromFirebase } = useFirebaseSync();
  const [lastSync, setLastSync] = useState(null);
  const [autoSync, setAutoSync] = useState(true);

  useEffect(() => {
    if (user && autoSync) {
      // Auto sync every 5 minutes
      const interval = setInterval(() => {
        if (onDataSync) {
          onDataSync(syncDataToFirebase);
        }
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user, autoSync, onDataSync, syncDataToFirebase]);

  const handleManualSync = async () => {
    if (onDataSync) {
      const success = await onDataSync(syncDataToFirebase);
      if (success) {
        setLastSync(new Date().toLocaleString());
      }
    }
  };

  const handleLoadFromCloud = async () => {
    if (onDataLoad) {
      const data = await loadDataFromFirebase();
      if (data) {
        onDataLoad(data);
        setLastSync(new Date().toLocaleString());
      }
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'connected': return 'text-green-500';
      case 'syncing': return 'text-blue-500';
      case 'synced': return 'text-green-500';
      case 'loading': return 'text-blue-500';
      case 'loaded': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'no_data': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (syncStatus) {
      case 'connected': return 'Đã kết nối';
      case 'syncing': return 'Đang đồng bộ...';
      case 'synced': return 'Đã đồng bộ';
      case 'loading': return 'Đang tải...';
      case 'loaded': return 'Đã tải';
      case 'error': return 'Lỗi kết nối';
      case 'no_data': return 'Chưa có dữ liệu';
      default: return 'Chưa kết nối';
    }
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Chưa đăng nhập
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Đăng nhập để đồng bộ dữ liệu lên cloud
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Đồng bộ Cloud
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('text-', 'bg-')}`}></div>
          <span className={`text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {lastSync && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Lần cuối: {lastSync}
        </p>
      )}

      <div className="space-y-3">
        <button
          onClick={handleManualSync}
          disabled={syncStatus === 'syncing'}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-xl transition-colors"
        >
          {syncStatus === 'syncing' ? 'Đang đồng bộ...' : 'Đồng bộ lên Cloud'}
        </button>

        <button
          onClick={handleLoadFromCloud}
          disabled={syncStatus === 'loading'}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-xl transition-colors"
        >
          {syncStatus === 'loading' ? 'Đang tải...' : 'Tải từ Cloud'}
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={autoSync}
            onChange={(e) => setAutoSync(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Tự động đồng bộ (5 phút/lần)
          </span>
        </label>
      </div>
    </div>
  );
};

export default CloudSync;
