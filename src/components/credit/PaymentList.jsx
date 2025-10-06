import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCreditStore from '../../store/creditStore';
import { formatCurrency } from '../../utils/formatCurrency';

const PaymentList = ({ cardId, onEditPayment, onDeletePayment }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { payments, cards } = useCreditStore();
  
  // Filter payments for the specific card
  const cardPayments = payments
    .filter(payment => payment.cardId === cardId)
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
  
  const card = cards.find(c => c.id === cardId);
  
  if (!card) return null;
  
  if (cardPayments.length === 0) {
    return (
      <div className="text-center py-12 fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Chưa có thanh toán
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Thêm thanh toán đầu tiên cho thẻ {card.issuer} •••• {card.last4}
        </p>
      </div>
    );
  }

  const getPaymentMethodIcon = (method) => {
    const icons = {
      bank_transfer: '🏦',
      debit_card: '💳',
      cash: '💵',
      other: '📝'
    };
    return icons[method] || '💰';
  };

  const getPaymentMethodName = (method) => {
    const names = {
      bank_transfer: 'Chuyển khoản',
      debit_card: 'Thẻ ghi nợ',
      cash: 'Tiền mặt',
      other: 'Khác'
    };
    return names[method] || 'Khác';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Thanh toán gần đây ({cardPayments.length})
        </h3>
      </div>
      
      <div className="space-y-2">
        {cardPayments.map((payment, index) => (
          <div
            key={payment.id}
            className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all duration-200 slide-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="p-3 sm:p-4">
              {/* Payment Info */}
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                {/* Payment Method Icon */}
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
                  <span className="text-lg sm:text-2xl">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                </div>
                
                {/* Payment Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                      Thanh toán thẻ tín dụng
                    </h4>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>{getPaymentMethodName(payment.paymentMethod)}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>
                      {new Date(payment.paymentDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  {payment.note && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                      {payment.note}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Amount at bottom */}
              <div className="flex justify-end">
                <div className="text-base sm:text-lg md:text-xl font-bold text-green-600 dark:text-green-400">
                  +{formatCurrency(payment.amount)}
                </div>
              </div>
            </div>
            
            {/* Action Buttons - Show on hover */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1 opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 opacity-100 sm:opacity-0 transition-opacity duration-200">
              <button
                onClick={() => onEditPayment(payment)}
                className="action-btn w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:hover:bg-primary-800/50 flex items-center justify-center transition-colors"
                title="Chỉnh sửa"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Xóa thanh toán với số tiền ${formatCurrency(payment.amount)}?`)) {
                    onDeletePayment(payment.id);
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

export default PaymentList;
