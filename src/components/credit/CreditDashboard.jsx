import React, { useState, useEffect } from 'react';
import CreditOverviewCard from './CreditOverviewCard';
import CardForm from './CardForm';
import TransactionForm from './TransactionForm';
import PaymentForm from './PaymentForm';
import StatementModal from './StatementModal';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCreditStore from '../../store/creditStore';

const CreditDashboard = () => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { cards, fetchData, loading, deleteCard } = useCreditStore();
  const activeCards = cards.filter(card => !card.archived);
  
  const [showAddCard, setShowAddCard] = useState(false);
  const [showCardsList, setShowCardsList] = useState(true);
  const [editingCard, setEditingCard] = useState(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showStatements, setShowStatements] = useState(false);
  
  useEffect(() => {
    if (currentUser) {
      fetchData(currentUser.uid);
    }
  }, [currentUser]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 slide-in-down">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Thẻ tín dụng
          </h1>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowCardsList(!showCardsList)}
            className="btn-fintech-secondary"
          >
            {showCardsList ? 'Ẩn danh sách' : 'Danh sách thẻ'}
          </button>
          <button
            onClick={() => setShowAddCard(true)}
            className="btn-fintech-primary w-12 h-12 p-0"
            title="Thêm thẻ mới"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      
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
                className="btn-fintech-ghost w-10 h-10 p-0"
                title="Đóng"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-6">
          <CardForm
            card={editingCard}
            defaultCategoryType="expense"
            onSubmit={() => {
              setShowAddCard(false);
              setEditingCard(null);
            }}
            onCancel={() => {
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
                className="btn-fintech-ghost w-10 h-10 p-0"
                title="Đóng"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-6">
              <TransactionForm 
                onSubmit={() => setShowAddTransaction(false)}
                onCancel={() => setShowAddTransaction(false)}
              />
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
                Thanh toán thẻ tín dụng
              </h3>
              <button
                onClick={() => setShowAddPayment(false)}
                className="btn-fintech-ghost w-10 h-10 p-0"
                title="Đóng"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-6">
              <PaymentForm 
                onSubmit={() => setShowAddPayment(false)}
                onCancel={() => setShowAddPayment(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Overview */}
      <CreditOverviewCard />

      {/* Cards List */}
      {activeCards.length > 0 && showCardsList && (
        <div className="fintech-card slide-in-up p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Danh sách thẻ ({activeCards.length})
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCards.map((card, index) => (
              <div 
                key={card.id} 
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-lg hover:shadow-xl transition-all slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Network Logo */}
                <div className="absolute top-4 right-4 opacity-20">
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                
                {/* Card Info */}
                <div className="relative z-10">
                  <p className="text-xs font-medium text-gray-400 mb-1">
                    {card.network}
                  </p>
                  <h4 className="text-2xl font-bold mb-6 tracking-wider">
                    •••• •••• •••• {card.last4}
                  </h4>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Chủ thẻ</p>
                      <p className="font-semibold">{card.holderName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-1">Ngân hàng</p>
                      <p className="font-semibold">{card.issuer}</p>
                    </div>
                  </div>
                </div>
                
                {/* Card Actions - Always visible */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCard(card);
                      setShowAddCard(true);
                    }}
                    className="bg-white/90 text-black px-3 py-1.5 rounded-lg font-semibold hover:bg-white transition-colors text-sm shadow-lg"
                    title="Chỉnh sửa thẻ"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Xóa thẻ ${card.issuer} •••• ${card.last4}?`)) {
                        deleteCard(card.id, currentUser.uid);
                      }
                    }}
                    className="bg-red-500/90 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm shadow-lg"
                    title="Xóa thẻ"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Quick Actions */}
      {activeCards.length > 0 && (
        <div className="fintech-card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Thao tác nhanh
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setShowAddTransaction(true)}
              className="group p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all"
            >
              <svg className="w-10 h-10 mx-auto mb-3 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400">
                Giao dịch
              </p>
            </button>
            
            <button
              onClick={() => setShowAddPayment(true)}
              className="group p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-success-500 dark:hover:border-success-400 hover:bg-success-50 dark:hover:bg-success-900/10 transition-all"
            >
              <svg className="w-10 h-10 mx-auto mb-3 text-gray-400 group-hover:text-success-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 group-hover:text-success-500 dark:group-hover:text-success-400">
                Thanh toán
              </p>
            </button>
            
            <button
              onClick={() => setShowStatements(true)}
              className="group p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-warning-500 dark:hover:border-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/10 transition-all"
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
              className="group p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-danger-500 dark:hover:border-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/10 transition-all"
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
                className="btn-fintech-ghost w-10 h-10 p-0"
                title="Đóng"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-6">
              <StatementModal 
                onClose={() => setShowStatements(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditDashboard;