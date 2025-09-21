import React, { useState } from 'react';
import { fmt, formatDate, isUpcoming } from '../utils/helpers';

const Debts = ({ 
  state, 
  addDebt, 
  updateDebt, 
  deleteDebt, 
  showAddForm, 
  setShowAddForm,
  editingItem,
  setEditingItem,
  formData,
  setFormData,
  handleFormSubmit,
  handleEdit,
  handleDelete
}) => {
  const [query, setQuery] = useState("");

  // Calculate debt analysis
  const totalDebt = state.debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPayment = state.debts.reduce((sum, d) => sum + d.minPay, 0);
  const avgAPR = state.debts.length > 0 ? 
    state.debts.reduce((sum, d) => sum + d.apr, 0) / state.debts.length : 0;

  // Calculate monthly interest
  const monthlyInterest = state.debts.reduce((sum, d) => {
    return sum + (d.balance * d.apr / 100 / 12);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header - Minimalist */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Nợ & Thẻ tín dụng
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Quản lý nợ và thẻ tín dụng
        </p>
      </div>

      {/* Search Bar - Minimalist */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Tìm kiếm nợ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Debt Overview - Minimalist */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tổng nợ</div>
            <div className="text-3xl font-light text-red-600">
              {fmt(totalDebt)}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Thanh toán tối thiểu</div>
            <div className="text-3xl font-light text-blue-600">
              {fmt(totalMinPayment)}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Lãi suất TB</div>
            <div className="text-3xl font-light text-yellow-600">
              {avgAPR.toFixed(1)}%
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Lãi hàng tháng</div>
            <div className="text-3xl font-light text-purple-600">
              {fmt(monthlyInterest)}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Alerts - Minimalist */}
      {state.debts.filter(d => d.dueDate && isUpcoming(d.dueDate)).length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-800 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔔</span>
            </div>
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200">Cảnh báo thanh toán</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Bạn có {state.debts.filter(d => d.dueDate && isUpcoming(d.dueDate)).length} khoản nợ sắp đến hạn thanh toán
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Debts List - Minimalist */}
      <div className="space-y-4">
        {state.debts.filter(d => {
          const q = query.toLowerCase();
          return !q || d.name.toLowerCase().includes(q);
        }).map(debt => (
          <div key={debt.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                    <span className="text-lg">💳</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{debt.name}</h4>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Lãi suất: {debt.apr}%/năm
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1 break-words">Số dư nợ</div>
                    <div className="font-medium text-red-600 dark:text-red-400 truncate">{fmt(debt.balance)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1 break-words">Thanh toán tối thiểu</div>
                    <div className="font-medium text-blue-600 dark:text-blue-400 truncate">{fmt(debt.minPay)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 mb-1 break-words">Lãi hàng tháng</div>
                    <div className="font-medium text-yellow-600 dark:text-yellow-400 truncate">
                      {fmt(debt.balance * debt.apr / 100 / 12)}
                    </div>
                  </div>
                  {debt.dueDate && (
                    <div>
                      <div className="text-gray-500 dark:text-gray-400 mb-1 break-words">Ngày đến hạn</div>
                      <div className={`font-medium truncate ${
                        isUpcoming(debt.dueDate) ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {formatDate(debt.dueDate)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(debt)}
                  className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all duration-200"
                  title="Sửa nợ"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(debt.id)}
                  className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-200"
                  title="Xóa nợ"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Debts;
