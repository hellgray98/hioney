import React, { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCreditStore from '../../store/creditStore';
import { formatCurrencyDisplay } from '../../utils/formatCurrency';

const CreditSummaryWidget = ({ onViewDetails }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { 
    cards, 
    getTotalBalance, 
    getTotalAvailableCredit, 
    getOverallUtilization,
    fetchData 
  } = useCreditStore();
  
  const activeCards = cards.filter(card => !card.archived);
  const totalBalance = getTotalBalance();
  const totalAvailable = getTotalAvailableCredit();
  const overallUtilization = getOverallUtilization();
  
  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.uid);
    }
  }, [currentUser]);
  
  const getUtilizationColor = (utilization) => {
    if (utilization >= 90) return 'text-red-500';
    if (utilization >= 70) return 'text-orange-500';
    if (utilization >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const getUtilizationBgColor = (utilization) => {
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 70) return 'bg-orange-500';
    if (utilization >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  if (activeCards.length === 0) {
    return null; // Don't show if no cards
  }
  
  return (
    <div className={`rounded-2xl sm:rounded-3xl overflow-hidden ${
      theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
    }`}>
      {/* Header */}
      <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">Thẻ tín dụng</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {activeCards.length} thẻ đang hoạt động
            </p>
          </div>
          <button
            onClick={onViewDetails}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-500'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            Chi tiết
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
          {/* Total Balance */}
          <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
            theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'
          }`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">Dư nợ</span>
            </div>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-red-600 dark:text-red-400 break-words">
              {formatCurrencyDisplay(totalBalance)}
            </p>
          </div>
          
          {/* Available Credit */}
          <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
            theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'
          }`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">Khả dụng</span>
            </div>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-green-600 dark:text-green-400 break-words">
              {formatCurrencyDisplay(totalAvailable)}
            </p>
          </div>
          
          {/* Utilization */}
          <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
            overallUtilization >= 70
              ? theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'
              : theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
          }`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                overallUtilization >= 70 ? 'bg-orange-500' : 'bg-blue-500'
              }`}>
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">Tỷ lệ</span>
            </div>
            <p className={`text-base sm:text-lg lg:text-xl font-bold ${getUtilizationColor(overallUtilization)}`}>
              {overallUtilization.toFixed(1)}%
            </p>
          </div>
        </div>
        
        {/* Cards List */}
        <div className="space-y-2">
          {activeCards.slice(0, 3).map((card) => (
            <div 
              key={card.id}
              className={`group rounded-xl sm:rounded-2xl p-3 transition-all duration-200 hover:scale-[1.01] cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-800/80'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={onViewDetails}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                    {card.issuer}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    •••• {card.last4}
                  </p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
          
          {activeCards.length > 3 && (
            <button
              onClick={onViewDetails}
              className={`w-full rounded-xl p-3 text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              +{activeCards.length - 3} thẻ khác
            </button>
          )}
        </div>
        
        {/* Utilization Bar */}
        <div className={`mt-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
          overallUtilization >= 70
            ? theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'
            : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
              Mức sử dụng tổng
            </span>
            <span className={`text-sm sm:text-base font-bold ${getUtilizationColor(overallUtilization)}`}>
              {overallUtilization.toFixed(1)}%
            </span>
          </div>
          <div className={`w-full rounded-full h-2 ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <div
              className={`h-2 rounded-full transition-all duration-500 ${getUtilizationBgColor(overallUtilization)}`}
              style={{ width: `${Math.min(overallUtilization, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Note */}
        <div className={`mt-3 p-3 rounded-xl ${
          theme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50'
        }`}>
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Dư nợ không tính vào Tổng tài sản
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditSummaryWidget;
