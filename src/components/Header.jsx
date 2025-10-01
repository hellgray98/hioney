import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ activeTab, setActiveTab, onQuickAdd, onMobileMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Tổng quan', icon: '📊', shortName: 'Tổng quan' },
    { id: 'transactions', name: 'Giao dịch', icon: '💰', shortName: 'Giao dịch' },
    { id: 'categories', name: 'Danh mục', icon: '📂', shortName: 'Danh mục' },
    { id: 'budgets', name: 'Ngân sách', icon: '🎯', shortName: 'Ngân sách' },
    { id: 'settings', name: 'Cài đặt', icon: '⚙️', shortName: 'Cài đặt' }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h1 className="text-xl font-bold">Hioney</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
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
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
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
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => {
              setShowMobileMenu(false);
              onMobileMenuToggle?.(false);
            }}
          />
          
          {/* Menu Panel */}
          <div className={`fixed top-16 right-0 w-72 h-full transition-colors shadow-2xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              {/* Current Tab Display */}
              <div className="mb-6">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Trang hiện tại</h3>
                <div className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <span className="text-lg">{currentTab?.icon}</span>
                  <span className="font-medium text-sm">{currentTab?.name}</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Chuyển trang</h3>
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowMobileMenu(false);
                        onMobileMenuToggle?.(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{tab.name}</div>
                        <div className={`text-xs ${
                          activeTab === tab.id 
                            ? theme === 'dark' ? 'text-blue-200' : 'text-blue-600'
                            : 'text-gray-500'
                        }`}>
                          {tab.id === 'dashboard' && 'Xem tổng quan tài chính'}
                          {tab.id === 'transactions' && 'Quản lý giao dịch'}
                          {tab.id === 'categories' && 'Quản lý danh mục'}
                          {tab.id === 'budgets' && 'Quản lý ngân sách'}
                          {tab.id === 'settings' && 'Cài đặt ứng dụng'}
                        </div>
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