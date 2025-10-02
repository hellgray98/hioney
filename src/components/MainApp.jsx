import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/FirebaseDataContext';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Categories from './Categories';
import Budgets from './Budgets';
import Settings from './Settings';
import QuickAdd from './QuickAdd';
import Account from './Account';

const MainApp = () => {
  const { theme } = useTheme();
  const { data, loading } = useData();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Handle account tab navigation
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
  };
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Tổng quan', icon: '📊' },
    { id: 'transactions', name: 'Giao dịch', icon: '💰' },
    { id: 'categories', name: 'Danh mục', icon: '📂' },
    { id: 'budgets', name: 'Ngân sách', icon: '🎯' },
    { id: 'settings', name: 'Cài đặt', icon: '⚙️' }
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'categories':
        return <Categories />;
      case 'budgets':
        return <Budgets />;
      case 'account':
        return <Account />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Mobile Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleSetActiveTab} 
        onQuickAdd={() => setShowQuickAdd(true)}
        onMobileMenuToggle={setIsMobileMenuOpen}
      />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`fixed top-0 left-0 z-30 h-full transition-all duration-300 hidden lg:flex flex-col ${
          isSidebarCollapsed ? 'w-20' : 'w-72'
        } ${theme === 'dark' ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'}`}>
          {/* Sidebar Header */}
          <div className={`flex items-center border-b border-gray-200 dark:border-gray-700 ${
            isSidebarCollapsed ? 'justify-center p-4' : 'justify-between p-6'
          }`}>
            {!isSidebarCollapsed ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 flex items-center justify-center shadow-fintech">
                    <span className="text-white dark:text-gray-900 font-extrabold text-lg">H</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Hioney</h1>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Personal Finance</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 flex items-center justify-center shadow-fintech">
                  <span className="text-white dark:text-gray-900 font-extrabold text-sm">H</span>
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5 transition-transform duration-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleSetActiveTab(tab.id)}
                  className={`w-full flex items-center rounded-xl text-left transition-all duration-200 group ${
                    isSidebarCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
                  } ${
                    activeTab === tab.id
                      ? theme === 'dark'
                        ? 'bg-white text-gray-900 shadow-fintech-md'
                        : 'bg-gray-900 text-white shadow-fintech-md'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  title={isSidebarCollapsed ? tab.name : ''}
                >
                <span className={`text-2xl flex-shrink-0 ${isSidebarCollapsed ? '' : ''}`}>{tab.icon}</span>
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold">{tab.name}</div>
                  </div>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* User Profile Button */}
            <button
              onClick={() => handleSetActiveTab('account')}
              className={`w-full flex items-center rounded-xl text-left transition-all duration-200 group ${
                isSidebarCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
              } ${
                activeTab === 'account'
                  ? theme === 'dark'
                    ? 'bg-white text-gray-900 shadow-fintech-md'
                    : 'bg-gray-900 text-white shadow-fintech-md'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={isSidebarCollapsed ? currentUser?.displayName || 'Tài khoản' : ''}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{currentUser?.displayName || 'User'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {currentUser?.email}
                  </div>
                </div>
              )}
            </button>

            {/* Balance Card */}
            {!isSidebarCollapsed && (
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">₫</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số dư hiện tại</p>
                    <p className={`font-bold text-sm truncate ${data.balance >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.balance)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        } pt-16 lg:pt-6 pb-20 lg:pb-6`}>
        {renderContent()}
      </main>
      </div>

      {/* Mobile Quick Add Button */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className={`lg:hidden fixed bottom-6 right-4 w-14 h-14 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-full shadow-fintech-lg hover:shadow-fintech-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 btn-animate bounce-in ${
          isMobileMenuOpen ? 'z-10 opacity-30 scale-90' : 'z-40 opacity-100 scale-100'
        }`}
      >
        +
      </button>

      {/* Desktop Quick Add Button */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className={`hidden lg:flex fixed bottom-6 right-6 w-16 h-16 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-2xl shadow-fintech-lg hover:shadow-fintech-xl items-center justify-center text-2xl font-bold transition-all duration-300 btn-animate bounce-in`}
      >
        +
      </button>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAdd onClose={() => setShowQuickAdd(false)} />
      )}
    </div>
  );
};

export default MainApp;
