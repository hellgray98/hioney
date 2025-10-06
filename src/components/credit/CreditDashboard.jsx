import React, { useState, useEffect } from 'react';
import CreditOverviewCard from './CreditOverviewCard';
import CardForm from './CardForm';
import TransactionForm from './TransactionForm';
import PaymentForm from './PaymentForm';
import StatementModal from './StatementModal';
import CardDetailModal from './CardDetailModal';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCreditStore from '../../store/creditStore';
import { formatCurrency } from '../../utils/formatCurrency';

const CreditDashboard = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { cards, fetchData, loading, deleteCard, getCardSummary } = useCreditStore();
  const activeCards = cards.filter(card => !card.archived);

  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.uid);
    }
  }, [currentUser]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                💳 Quản lý Tín dụng
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={() => {
                  setEditingCard(null);
                  setShowAddCard(true);
                }}
                className="btn-fintech-primary w-12 h-12 p-0 flex items-center justify-center"
                title="Thêm thẻ mới"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Add/Edit Card Modal */}
        {showAddCard && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 fade-in overflow-y-auto !mt-0" onClick={() => {
            setShowAddCard(false);
            setEditingCard(null);
          }}>
            <div 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto slide-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingCard ? 'Chỉnh sửa thẻ' : 'Thêm thẻ tín dụng'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddCard(false);
                    setEditingCard(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <CardForm 
                  card={editingCard} 
                  onClose={() => {
                    setShowAddCard(false);
                    setEditingCard(null);
                  }} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Add Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 fade-in overflow-y-auto !mt-0" onClick={() => setShowAddTransaction(false)}>
            <div 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto slide-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Thêm giao dịch
                </h3>
                <button
                  onClick={() => setShowAddTransaction(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <TransactionForm onClose={() => setShowAddTransaction(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Add Payment Modal */}
        {showAddPayment && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 fade-in overflow-y-auto !mt-0" onClick={() => setShowAddPayment(false)}>
            <div 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto slide-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Thêm thanh toán
                </h3>
                <button
                  onClick={() => setShowAddPayment(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <PaymentForm onClose={() => setShowAddPayment(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Overview Section */}
        <CreditOverviewCard />

        {/* Cards List */}
        {activeCards.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Danh sách thẻ tín dụng
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {activeCards.length} thẻ đang hoạt động
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeCards.map((card, index) => {
                  const cardSummary = getCardSummary(card.id);
                  return (
                    <div 
                      key={card.id} 
                      className={`group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white border-gray-700 hover:border-gray-600' 
                          : 'bg-gradient-to-br from-white to-gray-50 text-gray-900 border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Card Header */}
                      <div className="p-6">
                        {/* Card Info */}
                        <div className="mb-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
                              }`}>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg truncate">{card.issuer}</h4>
                                <p className={`text-sm ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>{card.network}</p>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingCard(card);
                                  setShowAddCard(true);
                                }}
                                className={`w-8 h-8 rounded-lg transition-colors flex items-center justify-center ${
                                  theme === 'dark'
                                    ? 'bg-white/10 text-white hover:bg-white/20'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                                title="Chỉnh sửa thẻ"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Xóa thẻ ${card.issuer} •••• ${card.last4}?`)) {
                                    deleteCard(card.id, currentUser.uid);
                                  }
                                }}
                                className="w-8 h-8 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center"
                                title="Xóa thẻ"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-center mb-0">
                            <p className={`text-sm mb-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Số thẻ</p>
                            <p className="text-xl font-mono tracking-wider">•••• •••• •••• {card.last4}</p>
                            <p className={`text-sm mt-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>{card.holderName}</p>
                            
                            {/* Status Badge - moved below holder name */}
                            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              theme === 'dark' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              Hoạt động
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      
                      {/* View Details Button */}
                      <div className="flex items-center justify-center pt-0 pl-4 pr-4 pb-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCard(card);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors hover:scale-105 ${
                            theme === 'dark' 
                              ? 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {activeCards.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thao tác nhanh
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Quản lý sao kê và chốt kỳ
              </p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowStatements(true)}
                  className="group p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-warning-500 dark:hover:border-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/10 transition-all"
                >
                  <svg className="w-10 h-10 mx-auto mb-3 text-gray-400 group-hover:text-warning-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-warning-500 dark:group-hover:text-warning-400">
                    Sao kê
                  </p>
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('Chốt kỳ sao kê cho tất cả thẻ?')) {
                      activeCards.forEach(card => {
                        useCreditStore.getState().generateStatement(card.id);
                      });
                    }
                  }}
                  className="group p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-danger-500 dark:hover:border-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/10 transition-all"
                >
                  <svg className="w-10 h-10 mx-auto mb-3 text-gray-400 group-hover:text-danger-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-danger-500 dark:group-hover:text-danger-400">
                    Chốt kỳ
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statement Modal */}
        {showStatements && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 fade-in overflow-y-auto !mt-0" onClick={() => setShowStatements(false)}>
            <div 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto slide-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Sao kê thẻ tín dụng
                </h3>
                <button
                  onClick={() => setShowStatements(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <StatementModal onClose={() => setShowStatements(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Card Detail Modal */}
        <CardDetailModal
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />

      </div>
    </div>
  );
};

export default CreditDashboard;