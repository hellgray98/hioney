import React, { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCreditStore from '../../store/creditStore';
import TransactionList from './TransactionList';
import PaymentList from './PaymentList';
import EditTransactionModal from './EditTransactionModal';
import EditPaymentModal from './EditPaymentModal';
import { formatCurrency } from '../../utils/formatCurrency';

const CardDetailModal = ({ card, isOpen, onClose }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { deleteTransaction, deletePayment } = useCreditStore();
  
  const [activeTab, setActiveTab] = useState('transactions');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  const getCardSummary = useCreditStore(state => state.getCardSummary);
  const cardSummary = useMemo(() => {
    return card?.id ? getCardSummary(card.id) : null;
  }, [card?.id, getCardSummary]);

  if (!isOpen || !card) return null;

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId, currentUser.uid);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await deletePayment(paymentId, currentUser.uid);
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };

  const handleSaveTransaction = () => {
    setEditingTransaction(null);
  };

  const handleSavePayment = () => {
    setEditingPayment(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 modal-backdrop overflow-y-auto !mt-0" onClick={onClose}>
        <div 
          className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {card.issuer} •••• {card.last4}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                  {card.holderName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="btn-fintech-ghost w-8 h-8 sm:w-10 sm:h-10 p-0 flex-shrink-0"
              title="Đóng"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Card Summary */}
          {cardSummary && (
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-b border-primary-200 dark:border-primary-800">
              <div className="space-y-4">
                {/* Mobile: 2x2 grid, Desktop: 3+2 layout */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {/* First Row Items */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Số dư hiện tại</p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(cardSummary.currentBalance)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Hạn mức</p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(card.creditLimit)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Còn lại</p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(cardSummary.availableCredit)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tỷ lệ sử dụng</p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400">
                      {cardSummary.utilizationRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tiền tối thiểu</p>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-purple-600 dark:text-purple-400">
                      {formatCurrency(cardSummary.minimumPaymentDue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`flex-1 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'transactions'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Giao dịch
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`flex-1 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeTab === 'payments'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Thanh toán
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            {activeTab === 'transactions' && (
              <TransactionList
                cardId={card.id}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}
            
            {activeTab === 'payments' && (
              <PaymentList
                cardId={card.id}
                onEditPayment={handleEditPayment}
                onDeletePayment={handleDeletePayment}
              />
            )}
          </div>
        </div>
      </div>

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSave={handleSaveTransaction}
      />

      {/* Edit Payment Modal */}
      <EditPaymentModal
        payment={editingPayment}
        isOpen={!!editingPayment}
        onClose={() => setEditingPayment(null)}
        onSave={handleSavePayment}
      />
    </>
  );
};

export default CardDetailModal;
