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
import CreditDashboard from './credit/CreditDashboard';
import TransactionForm from './credit/TransactionForm';
import PaymentForm from './credit/PaymentForm';
import LoadingScreen from './LoadingScreen';

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
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [quickAddType, setQuickAddType] = useState('expense');
  const [showCreditTransaction, setShowCreditTransaction] = useState(false);
  const [showCreditPayment, setShowCreditPayment] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Tổng quan', icon: '📊' },
    { id: 'transactions', name: 'Giao dịch', icon: '💰' },
    { id: 'categories', name: 'Danh mục', icon: '📂' },
    { id: 'budgets', name: 'Ngân sách', icon: '🎯' },
    { id: 'credit', name: 'Tín dụng', icon: '💳' },
    { id: 'settings', name: 'Cài đặt', icon: '⚙️' }
  ];

  const renderContent = () => {
  if (loading) {
    return <LoadingScreen 
      message="Đang tải dữ liệu" 
      variant="premium" 
      size="lg" 
      minDuration={2500}
    />;
  }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={handleSetActiveTab} />;
      case 'transactions':
        return <Transactions />;
      case 'categories':
        return <Categories />;
      case 'budgets':
        return <Budgets />;
      case 'credit':
        return <CreditDashboard />;
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

      {/* Floating Action Menu */}
      <div className="fixed bottom-6 right-4 lg:bottom-6 lg:right-6 z-40">
        {/* Menu Items */}
        <div className={`absolute bottom-0 right-16 lg:right-20 flex flex-col gap-3 transition-all duration-300 ${
          showFloatingMenu ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-95 translate-x-4 pointer-events-none'
        }`}>
          {/* Thanh toán thẻ tín dụng */}
          <button
            onClick={() => {
              setShowCreditPayment(true);
              setShowFloatingMenu(false);
            }}
            className="group flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 min-w-[180px]"
          >
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-medium">Thanh toán thẻ</span>
          </button>

          {/* Giao dịch thẻ tín dụng */}
          <button
            onClick={() => {
              setShowCreditTransaction(true);
              setShowFloatingMenu(false);
            }}
            className="group flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 min-w-[180px]"
          >
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium">Giao dịch thẻ</span>
          </button>

          {/* Thu nhập */}
          <button
            onClick={() => {
              setQuickAddType('income');
              setShowQuickAdd(true);
              setShowFloatingMenu(false);
            }}
            className="group flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 px-4 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 min-w-[180px]"
          >
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors">
              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="font-medium">Thu nhập</span>
          </button>

          {/* Chi tiêu */}
          <button
            onClick={() => {
              setQuickAddType('expense');
              setShowQuickAdd(true);
              setShowFloatingMenu(false);
            }}
            className="group flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 px-4 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 min-w-[180px]"
          >
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-colors">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0l-4-4m4 4l-4 4" />
              </svg>
            </div>
            <span className="font-medium">Chi tiêu</span>
          </button>
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={() => setShowFloatingMenu(!showFloatingMenu)}
          className={`w-14 h-14 lg:w-16 lg:h-16 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-full lg:rounded-2xl shadow-fintech-lg hover:shadow-fintech-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 btn-animate bounce-in ${
            isMobileMenuOpen ? 'z-10 opacity-30 scale-90' : 'z-40 opacity-100 scale-100'
          } ${showFloatingMenu ? 'rotate-45' : ''}`}
        >
          +
        </button>
      </div>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAdd onClose={() => setShowQuickAdd(false)} initialType={quickAddType} />
      )}

      {/* Credit Transaction Modal */}
      {showCreditTransaction && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 fade-in overflow-y-auto" onClick={() => setShowCreditTransaction(false)}>
          <div 
            className={`w-full max-w-lg my-4 sm:my-0 rounded-2xl shadow-fintech-xl transition-colors scale-in-center max-h-[calc(100vh-2rem)] flex flex-col ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Thêm giao dịch thẻ tín dụng</h2>
              </div>
              <button
                onClick={() => setShowCreditTransaction(false)}
                className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 ${
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
            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <TransactionForm onClose={() => setShowCreditTransaction(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Credit Payment Modal */}
      {showCreditPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 fade-in overflow-y-auto" onClick={() => setShowCreditPayment(false)}>
          <div 
            className={`w-full max-w-lg my-4 sm:my-0 rounded-2xl shadow-fintech-xl transition-colors scale-in-center max-h-[calc(100vh-2rem)] flex flex-col ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Thêm thanh toán thẻ tín dụng</h2>
              </div>
              <button
                onClick={() => setShowCreditPayment(false)}
                className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 ${
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
            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <PaymentForm onClose={() => setShowCreditPayment(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainApp;
