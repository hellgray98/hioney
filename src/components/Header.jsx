import React, { useState } from 'react';
import RetroLogo from './RetroLogo';

const Header = ({ setTab, state, user, userRole }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Count unread notifications
  const unreadCount = state?.notifications?.filter(n => !n.read).length || 0;
  const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RetroLogo size="default" variant="text" />
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications Button */}
            <button
              onClick={() => setTab('notifications')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 relative"
              title="Thông báo"
            >
              <span className="text-lg">🔔</span>
              {/* Notification Badge with Count */}
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                  {displayCount}
                </div>
              )}
            </button>

            {/* Admin Dashboard Button */}
            {userRole === 'admin' && (
              <button
                onClick={() => setTab('admin')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                title="Admin Dashboard"
              >
                <span className="text-lg">👑</span>
              </button>
            )}

            {/* Settings Button */}
            <button
              onClick={() => setTab('settings')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              title="Cài đặt"
            >
              <span className="text-lg">⚙️</span>
            </button>

            {/* User Info */}
            {user && (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.displayName || user.email}
                  </p>
                  {userRole && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userRole === 'admin' ? '👑 Admin' : '👤 User'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

