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
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="retroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="30%" stopColor="#3B82F6" />
                      <stop offset="70%" stopColor="#1D4ED8" />
                      <stop offset="100%" stopColor="#1E40AF" />
                    </linearGradient>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FCD34D" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                    <pattern id="retroPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                      <rect width="8" height="8" fill="rgba(255,255,255,0.05)" />
                      <circle cx="4" cy="4" r="1" fill="rgba(255,255,255,0.1)" />
                    </pattern>
                  </defs>
                  
                  {/* Outer Hexagon - Retro Style */}
                  <path
                    d="M24 2 L42 12 L42 36 L24 46 L6 36 L6 12 Z"
                    fill="url(#retroGradient)"
                    stroke="url(#goldGradient)"
                    strokeWidth="2"
                  />
                  
                  {/* Inner Hexagon */}
                  <path
                    d="M24 6 L38 14 L38 34 L24 42 L10 34 L10 14 Z"
                    fill="url(#retroPattern)"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                  />
                  
                  {/* Letter H - Retro Stylized */}
                  <g stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {/* Left vertical */}
                    <path d="M18 14 L18 34" />
                    {/* Right vertical */}
                    <path d="M30 14 L30 34" />
                    {/* Horizontal bar */}
                    <path d="M18 24 L30 24" />
                  </g>
                  
                  {/* Decorative Elements - Retro Style */}
                  {/* Corner Stars */}
                  <g fill="url(#goldGradient)">
                    {/* Top */}
                    <path d="M24 8 L25 12 L29 12 L26 14 L27 18 L24 16 L21 18 L22 14 L19 12 L23 12 Z" />
                    {/* Bottom */}
                    <path d="M24 40 L25 36 L29 36 L26 34 L27 30 L24 32 L21 30 L22 34 L19 36 L23 36 Z" />
                    {/* Left */}
                    <path d="M12 24 L16 23 L16 19 L18 22 L22 21 L20 24 L22 27 L18 26 L16 29 L16 25 Z" />
                    {/* Right */}
                    <path d="M36 24 L32 23 L32 19 L30 22 L26 21 L28 24 L26 27 L30 26 L32 29 L32 25 Z" />
                  </g>
                  
                  {/* Center Diamond */}
                  <path
                    d="M24 20 L28 24 L24 28 L20 24 Z"
                    fill="url(#goldGradient)"
                    opacity="0.8"
                  />
                  
                  {/* Inner Diamond */}
                  <path
                    d="M24 22 L26 24 L24 26 L22 24 Z"
                    fill="white"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <div>
                <h1 className={`text-xl font-bold text-left ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  Hioney
                </h1>
                <p className={`text-xs -mt-1 text-left ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Personal Finance</p>
              </div>
            </button>


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
                className={`p-2 rounded-lg transition-colors ${
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
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setShowMobileMenu(false);
              onMobileMenuToggle?.(false);
            }}
          />
          
          {/* Menu Panel */}
          <div className={`fixed top-0 right-0 w-80 h-full transition-all duration-300 shadow-2xl backdrop-blur-md overflow-y-auto ${
            theme === 'dark' ? 'bg-gray-900/95 border-l border-gray-700' : 'bg-white/95 border-l border-gray-200'
          }`}>
            <div className="pt-4 px-6 pb-6">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-lg font-bold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>Menu</h2>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onMobileMenuToggle?.(false);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Current Tab Display */}
              <div className="mb-8">
                <h3 className={`text-sm font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Trang hiện tại</h3>
                <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className="text-xl">{currentTab?.icon}</span>
                  <span className={`font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>{currentTab?.name}</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div>
                <h3 className={`text-sm font-medium mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>Chuyển trang</h3>
                <nav className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowMobileMenu(false);
                        onMobileMenuToggle?.(false);
                      }}
                      className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? theme === 'dark'
                            ? 'bg-white text-gray-800 shadow-lg'
                            : 'bg-gray-900 text-white shadow-lg'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <div>
                        <div className={`font-semibold text-sm ${
                          activeTab === tab.id 
                            ? theme === 'dark' ? 'text-gray-800' : 'text-white'
                            : theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>{tab.name}</div>
                        <div className={`text-xs mt-0.5 ${
                          activeTab === tab.id 
                            ? theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
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