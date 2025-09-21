import React from 'react';
import { usePWA } from '../hooks/usePWA';

const PWAStatus = () => {
  const { isOnline, isInstalled, canInstall, needRefresh, installApp, updateApp, dismissUpdate } = usePWA();

  return (
    <>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>📡</span>
            <span className="text-sm font-medium">Bạn đang offline. Dữ liệu sẽ được đồng bộ khi có kết nối.</span>
          </div>
        </div>
      )}

      {/* Install prompt */}
      {canInstall && !isInstalled && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span>📱</span>
              <span className="text-sm font-medium">Cài đặt Hioney để sử dụng nhanh hơn!</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={installApp}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Cài đặt
              </button>
              <button
                onClick={() => setDeferredPrompt(null)}
                className="px-3 py-1 text-blue-600 text-sm hover:text-blue-800 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update available */}
      {needRefresh && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span>🔄</span>
              <span className="text-sm font-medium">Có phiên bản mới! Cập nhật để có trải nghiệm tốt nhất.</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={updateApp}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Cập nhật
              </button>
              <button
                onClick={dismissUpdate}
                className="px-3 py-1 text-green-600 text-sm hover:text-green-800 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Installed indicator */}
      {isInstalled && (
        <div className="fixed bottom-20 right-4 z-40 bg-emerald-100 border border-emerald-400 text-emerald-800 px-3 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span className="text-xs font-medium">Đã cài đặt</span>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAStatus;


