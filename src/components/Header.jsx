import React, { useState } from 'react';
import RetroLogo from './RetroLogo';
import { useTheme } from '../hooks/useTheme';

const Header = ({ setTab, state }) => {
  const { theme, setTheme, isDark } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Count unread notifications
  const unreadCount = state?.notifications?.filter(n => !n.read).length || 0;
  const displayCount = unreadCount > 99 ? '99+' : unreadCount.toString();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('auto');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '🌓';
  };

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

            {/* Settings Button */}
            <button
              onClick={() => setTab('settings')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              title="Cài đặt"
            >
              <span className="text-lg">⚙️</span>
            </button>

            {/* Theme Toggle - Minimalist */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              title={`Chuyển sang ${theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'} mode`}
            >
              <span className="text-lg">{getThemeIcon()}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

