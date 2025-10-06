import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCreditStore from '../../store/creditStore';
import { formatCurrency } from '../../utils/formatCurrency';

const TransactionList = ({ cardId, onEditTransaction, onDeleteTransaction }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { transactions, cards } = useCreditStore();
  
  // Filter transactions for the specific card
  const cardTransactions = transactions
    .filter(tx => tx.cardId === cardId)
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
  
  const card = cards.find(c => c.id === cardId);
  
  if (!card) return null;
  
  if (cardTransactions.length === 0) {
    return (
      <div className="text-center py-12 fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Chưa có giao dịch
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Thêm giao dịch đầu tiên cho thẻ {card.issuer} •••• {card.last4}
        </p>
      </div>
    );
  }

  const getCategoryIcon = (category) => {
    const icons = {
      food: '🍜',
      transport: '🚗',
      shopping: '🛒',
      entertainment: '🎬',
      bills: '💡',
      health: '🏥',
      education: '📚',
      other: '📝'
    };
    return icons[category] || '💳';
  };

  const getCategoryName = (category) => {
    const names = {
      food: 'Ăn uống',
      transport: 'Di chuyển',
      shopping: 'Mua sắm',
      entertainment: 'Giải trí',
      bills: 'Hóa đơn',
      health: 'Sức khỏe',
      education: 'Giáo dục',
      other: 'Khác'
    };
    return names[category] || 'Khác';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Giao dịch gần đây ({cardTransactions.length})
        </h3>
      </div>
      
      <div className="space-y-2">
        {cardTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all duration-200 slide-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="p-3 sm:p-4">
              {/* Transaction Info */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                {/* Category Icon */}
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center">
                  <span className="text-lg sm:text-2xl">{getCategoryIcon(transaction.category)}</span>
                </div>
                
                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                      {transaction.description}
                    </h4>
                    {transaction.isPending && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 w-fit">
                        Chờ xử lý
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{getCategoryName(transaction.category)}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>
                      {new Date(transaction.transactionDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Amount at bottom */}
              <div className="flex justify-end">
                <div className="text-base sm:text-lg md:text-xl font-bold text-red-600 dark:text-red-400">
                  -{formatCurrency(transaction.amount)}
                </div>
              </div>
            </div>
            
            {/* Action Buttons - Show on hover */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 opacity-100 sm:opacity-0 transition-opacity duration-200">
              <button
                onClick={() => onEditTransaction(transaction)}
                className="action-btn w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-800/50 flex items-center justify-center transition-colors"
                title="Chỉnh sửa"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Xóa giao dịch "${transaction.description}" với số tiền ${formatCurrency(transaction.amount)}?`)) {
                    onDeleteTransaction(transaction.id);
                  }
                }}
                className="action-btn w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50 flex items-center justify-center transition-colors"
                title="Xóa"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
