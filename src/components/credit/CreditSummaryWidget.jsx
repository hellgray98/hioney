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
    <div className="fintech-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Thẻ tín dụng
        </h3>
        <button
          onClick={onViewDetails}
          className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Xem chi tiết →
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Tổng dư nợ
          </p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrencyDisplay(totalBalance)}
          </p>
        </div>
        
        <div className="text-center p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Khả dụng
          </p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrencyDisplay(totalAvailable)}
          </p>
        </div>
        
        <div className="text-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Tỷ lệ sử dụng
          </p>
          <p className={`text-lg font-bold ${getUtilizationColor(overallUtilization)}`}>
            {overallUtilization.toFixed(1)}%
          </p>
        </div>
      </div>
      
      {/* Utilization Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {activeCards.length} thẻ đang hoạt động
          </span>
          <span className={`text-xs font-bold ${getUtilizationColor(overallUtilization)}`}>
            {overallUtilization.toFixed(1)}%
          </span>
        </div>
        <div className={`w-full rounded-full h-2 ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div
            className={`h-2 rounded-full transition-all duration-500 ease-out ${getUtilizationBgColor(overallUtilization)}`}
            style={{ width: `${Math.min(overallUtilization, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Note */}
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        ℹ️ Dư nợ không tính vào Tổng tài sản
      </p>
    </div>
  );
};

export default CreditSummaryWidget;
