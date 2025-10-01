import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import Header from './Header';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Categories from './Categories';
import Budgets from './Budgets';
import Settings from './Settings';
import QuickAdd from './QuickAdd';

const MainApp = () => {
  const { theme } = useTheme();
  const { data } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'categories':
        return <Categories />;
      case 'budgets':
        return <Budgets />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onQuickAdd={() => setShowQuickAdd(true)}
        onMobileMenuToggle={setIsMobileMenuOpen}
      />
      
      <main className="pt-16 pb-20">
        {renderContent()}
      </main>

      {/* Quick Add Button */}
      <button
        onClick={() => setShowQuickAdd(true)}
        className={`fixed bottom-20 right-4 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all duration-300 btn-animate bounce-in ${
          isMobileMenuOpen ? 'z-10 opacity-30 scale-90' : 'z-40 opacity-100 scale-100'
        }`}
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
