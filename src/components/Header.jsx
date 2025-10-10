import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ activeTab, setActiveTab, onQuickAdd, onMobileMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Tổng quan', icon: '📊', shortName: 'Tổng quan' },
    { id: 'transactions', name: 'Giao dịch', icon: '💰', shortName: 'Giao dịch' },
    { id: 'categories', name: 'Danh mục', icon: '📂', shortName: 'Danh mục' },
    { id: 'budgets', name: 'Ngân sách', icon: '🎯', shortName: 'Ngân sách' },
    { id: 'credit', name: 'Tín dụng', icon: '💳', shortName: 'Tín dụng' },
    { id: 'settings', name: 'Cài đặt', icon: '⚙️', shortName: 'Cài đặt' }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <>
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 slide-in-down backdrop-blur-md ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border-b border-gray-800' 
          : 'bg-white/95 border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/android-chrome-192x192.png" 
                  alt="Hioney Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className={`text-left text-xl font-extrabold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Hioney
                </h1>
                <p className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Personal Finance</p>
              </div>
            </button>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-200 btn-animate ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => {
                  setShowMobileMenu(!showMobileMenu);
                  onMobileMenuToggle?.(!showMobileMenu);
                }}
                className={`p-2.5 rounded-xl transition-all duration-200 btn-animate ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Bottom Sheet Fintech Style */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => {
              setShowMobileMenu(false);
              onMobileMenuToggle?.(false);
            }}
          />
          
          {/* Bottom Sheet Panel */}
          <div className={`fixed bottom-0 left-0 right-0 transition-all duration-300 animate-slide-up shadow-2xl ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`} style={{ maxHeight: '85vh', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className={`w-12 h-1.5 rounded-full ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
              }`} />
            </div>

            {/* Header */}
            <div className="px-6 pt-2 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Chọn trang điều hướng</p>
                </div>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onMobileMenuToggle?.(false);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-gray-400 active:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* User Profile - Minimal Card */}
            <div className="px-6 pb-4">
              <button
                onClick={() => {
                  setActiveTab('account');
                  setShowMobileMenu(false);
                  onMobileMenuToggle?.(false);
                }}
                className={`w-full rounded-2xl p-4 transition-all active:scale-[0.98] ${
                  activeTab === 'account'
                    ? theme === 'dark'
                      ? 'bg-blue-600 shadow-lg shadow-blue-600/30'
                      : 'bg-gray-900 shadow-lg'
                    : theme === 'dark'
                      ? 'bg-gray-800 active:bg-gray-700'
                      : 'bg-gray-50 active:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                    activeTab === 'account'
                      ? 'bg-white/20 text-white'
                      : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                  }`}>
                    {currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className={`font-semibold text-sm truncate ${
                      activeTab === 'account' ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {currentUser?.displayName || 'User'}
                    </div>
                    <div className={`text-xs truncate ${
                      activeTab === 'account' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Tài khoản của tôi
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Navigation Grid - 3 columns */}
            <div className="px-6 pb-8 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 220px)' }}>
              <div className="grid grid-cols-3 gap-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileMenu(false);
                      onMobileMenuToggle?.(false);
                    }}
                    className={`group relative rounded-2xl p-4 transition-all duration-200 active:scale-95 ${
                      activeTab === tab.id
                        ? theme === 'dark'
                          ? 'bg-blue-600 shadow-lg shadow-blue-600/30'
                          : 'bg-gray-900 shadow-lg'
                        : theme === 'dark'
                          ? 'bg-gray-800 active:bg-gray-700'
                          : 'bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-200 group-active:scale-90 ${
                        activeTab === tab.id
                          ? 'bg-white/10'
                          : ''
                      }`}>
                        <span className="text-3xl">{tab.icon}</span>
                      </div>
                      
                      {/* Label */}
                      <span className={`text-xs font-semibold text-center truncate w-full ${
                        activeTab === tab.id 
                          ? 'text-white'
                          : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {tab.shortName}
                      </span>
                    </div>
                    
                    {/* Active Indicator */}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-white/80 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;