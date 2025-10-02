import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import useCreditStore from '../../store/creditStore';
import { formatCurrencyDisplay } from '../../utils/formatCurrency';

const CreditOverviewCard = () => {
  const { theme } = useTheme();
  const { 
    cards, 
    getCardSummary, 
    getTotalBalance, 
    getTotalAvailableCredit, 
    getOverallUtilization 
  } = useCreditStore();
  
  const activeCards = cards.filter(card => !card.archived);
  const totalBalance = getTotalBalance();
  const totalAvailable = getTotalAvailableCredit();
  const overallUtilization = getOverallUtilization();
  
  const getUtilizationColor = (utilization) => {
    if (utilization >= 90) return 'text-red-500 dark:text-red-400';
    if (utilization >= 70) return 'text-orange-500 dark:text-orange-400';
    if (utilization >= 50) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };
  
  const getUtilizationBgColor = (utilization) => {
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 70) return 'bg-orange-500';
    if (utilization >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const formatCurrency = formatCurrencyDisplay;
  
  if (activeCards.length === 0) {
    return (
      <div className="fintech-card text-center slide-in-up">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center bounce-in">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Chưa có thẻ tín dụng
        </h3>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Overall Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="fintech-card-elevated group hover:scale-105 transition-transform p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full">
              Dư nợ
            </span>
          </div>
          <p className="text-3xl font-extrabold text-red-600 dark:text-red-400 mb-1">
            {formatCurrency(totalBalance)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Tổng số tiền cần thanh toán
          </p>
        </div>
        
        {/* Available Credit */}
        <div className="fintech-card-elevated group hover:scale-105 transition-transform p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
              Khả dụng
            </span>
          </div>
          <p className="text-3xl font-extrabold text-green-600 dark:text-green-400 mb-1">
            {formatCurrency(totalAvailable)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Hạn mức còn lại có thể sử dụng
          </p>
        </div>
        
        {/* Utilization */}
        <div className="fintech-card-elevated group hover:scale-105 transition-transform p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              overallUtilization >= 70 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
            }`}>
              Tỷ lệ
            </span>
          </div>
          <p className={`text-3xl font-extrabold mb-1 ${getUtilizationColor(overallUtilization)}`}>
            {overallUtilization.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Mức sử dụng hạn mức tín dụng
          </p>
        </div>
      </div>
      
      {/* Utilization Bar */}
      <div className="fintech-card p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Tỷ lệ sử dụng tổng thể
          </span>
          <span className={`text-sm font-bold ${getUtilizationColor(overallUtilization)}`}>
            {overallUtilization.toFixed(1)}%
          </span>
        </div>
        <div className={`w-full rounded-full h-4 shadow-inner ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div
            className={`h-4 rounded-full transition-all duration-700 ease-out shadow-sm ${getUtilizationBgColor(overallUtilization)}`}
            style={{ width: `${Math.min(overallUtilization, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
          💡 Khuyến nghị: Giữ tỷ lệ sử dụng dưới 30% để có credit score tốt
        </p>
      </div>
      
      {/* Individual Cards Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Chi tiết từng thẻ
        </h3>
        
        {activeCards.map((card, index) => {
          const summary = getCardSummary(card.id);
          if (!summary) return null;
          
          return (
            <div 
              key={card.id} 
              className="fintech-card p-6 hover:shadow-lg transition-shadow slide-in-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {card.issuer} •••• {card.last4}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {card.network} • {card.holderName}
                    </p>
                  </div>
                </div>
                
                {summary.nextDueDate && (
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Đến hạn
                    </p>
                    <p className="text-sm font-bold text-danger-600 dark:text-danger-400">
                      {new Date(summary.nextDueDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Card Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Dư nợ</p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(summary.currentBalance)}
                  </p>
                </div>
                
                <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Khả dụng</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(summary.availableCredit)}
                  </p>
                </div>
                
                <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Hạn mức</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(card.creditLimit)}
                  </p>
                </div>
                
                <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tối thiểu</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(summary.minimumPaymentDue)}
                  </p>
                </div>
              </div>
              
              {/* Utilization Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Tỷ lệ sử dụng
                  </span>
                  <span className={`text-sm font-bold ${getUtilizationColor(summary.utilizationRate)}`}>
                    {summary.utilizationRate.toFixed(1)}%
                  </span>
                </div>
                <div className={`w-full rounded-full h-3 shadow-inner ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ease-out shadow-sm ${getUtilizationBgColor(summary.utilizationRate)}`}
                    style={{ width: `${Math.min(summary.utilizationRate, 100)}%` }}
                  />
                </div>
              </div>
              
              {/* Last Payment Info */}
              {summary.lastPaymentDate && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Thanh toán gần nhất</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(summary.lastPaymentAmount)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(summary.lastPaymentDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Important Note */}
      <div className={`p-4 rounded-xl border-2 ${
        theme === 'dark'
          ? 'bg-yellow-900/20 border-yellow-800/50 text-yellow-400'
          : 'bg-yellow-50 border-yellow-200 text-yellow-700'
      }`}>
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold mb-1">Lưu ý quan trọng</p>
            <p className="text-sm">
              Dư nợ thẻ tín dụng <strong>không được tính vào Tổng tài sản</strong> của bạn. Đây là khoản nợ cần thanh toán.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditOverviewCard;