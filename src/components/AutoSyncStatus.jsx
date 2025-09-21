import React from 'react';
import { useFirebaseSync } from '../hooks/useFirebaseSync';

const AutoSyncStatus = () => {
  const { user, syncStatus } = useFirebaseSync();

  if (!user) return null;

  const getStatusInfo = () => {
    switch (syncStatus) {
      case 'syncing':
        return { text: 'Đang đồng bộ...', color: 'text-blue-600', icon: '🔄' };
      case 'synced':
        return { text: 'Đã đồng bộ', color: 'text-green-600', icon: '✅' };
      case 'error':
        return { text: 'Lỗi đồng bộ', color: 'text-red-600', icon: '❌' };
      case 'loading':
        return { text: 'Đang tải...', color: 'text-blue-600', icon: '📥' };
      case 'loaded':
        return { text: 'Đã tải xong', color: 'text-green-600', icon: '✅' };
      case 'connected':
        return { text: 'Đã kết nối', color: 'text-green-600', icon: '🌐' };
      default:
        return { text: 'Chưa kết nối', color: 'text-gray-600', icon: '🔌' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-2xl px-4 py-2 shadow-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm">{statusInfo.icon}</span>
          <span className={`text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AutoSyncStatus;
