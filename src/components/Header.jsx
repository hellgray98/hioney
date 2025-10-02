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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 flex items-center justify-center shadow-fintech">
                <span className="text-white dark:text-gray-900 font-extrabold text-lg">H</span>
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

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowMobileMenu(false);
              onMobileMenuToggle?.(false);
            }}
          />
          
          {/* Menu Panel - Fintech Style */}
          <div className={`fixed top-0 right-0 w-80 h-full transition-all duration-300 shadow-fintech-xl backdrop-blur-md overflow-y-auto slide-in-right ${
            theme === 'dark' ? 'bg-gray-900/95 border-l border-gray-800' : 'bg-white/95 border-l border-gray-200'
          }`}>
            <div className="pt-6 px-6 pb-6">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Menu</h2>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onMobileMenuToggle?.(false);
                  }}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Profile Section */}
              <div className="mb-8">
                <button
                  onClick={() => {
                    setActiveTab('account');
                    setShowMobileMenu(false);
                    onMobileMenuToggle?.(false);
                  }}
                  className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-200 group ${
                    activeTab === 'account'
                      ? theme === 'dark'
                        ? 'bg-white text-gray-900 shadow-fintech-lg'
                        : 'bg-gray-900 text-white shadow-fintech-lg'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-base truncate ${
                      activeTab === 'account' 
                        ? theme === 'dark' ? 'text-gray-900' : 'text-white'
                        : theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {currentUser?.displayName || 'User'}
                    </div>
                    <div className={`text-sm truncate ${
                      activeTab === 'account' 
                        ? theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {currentUser?.email || 'user@example.com'}
                    </div>
                  </div>
                  {activeTab === 'account' && (
                    <div className={`w-2 h-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}></div>
                  )}
                </button>
              </div>

              {/* Navigation Menu */}
              <div>
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowMobileMenu(false);
                        onMobileMenuToggle?.(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                        activeTab === tab.id
                          ? theme === 'dark'
                            ? 'bg-white text-gray-900 shadow-fintech-md'
                            : 'bg-gray-900 text-white shadow-fintech-md'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        activeTab === tab.id
                          ? theme === 'dark'
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-white/20 text-white'
                          : theme === 'dark'
                            ? 'bg-gray-800 text-gray-300 group-hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                        <span className="text-lg">{tab.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${
                          activeTab === tab.id 
                            ? theme === 'dark' ? 'text-gray-900' : 'text-white'
                            : theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{tab.name}</div>
                      </div>

                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;