import React, { useState } from 'react';
import { fmt, formatDate } from '../utils/helpers';

const Transactions = ({ 
  state, 
  addTransaction, 
  updateTransaction, 
  deleteTransaction, 
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
  const [filterType, setFilterType] = useState("all"); // all, income, expense
  const [sortBy, setSortBy] = useState("date"); // date, amount, category

  const catLabel = (id) => state.categories.find(c => c.id === id)?.label || id;

  // Filter and sort transactions
  const filteredTransactions = state.transactions
    .filter(t => {
      const matchesQuery = !query || 
        t.note.toLowerCase().includes(query.toLowerCase()) || 
        catLabel(t.category).toLowerCase().includes(query.toLowerCase());
      
      const matchesType = filterType === "all" || t.type === filterType;
      
      return matchesQuery && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return b.amount - a.amount;
        case "category":
          return catLabel(a.category).localeCompare(catLabel(b.category));
        case "date":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});

  // Calculate daily totals
  const getDailyTotal = (transactions) => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Giao dịch</h1>
          <p className="text-gray-600 mt-1">Quản lý thu chi hàng ngày</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Tìm kiếm giao dịch..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          {/* Filters - Stack on mobile */}
          <div className="flex flex-col xs:flex-row gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">Tất cả</option>
              <option value="income">Thu nhập</option>
              <option value="expense">Chi tiêu</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="date">Ngày</option>
              <option value="amount">Số tiền</option>
              <option value="category">Danh mục</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-6">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có giao dịch</h3>
            <p className="text-gray-500">Thêm giao dịch đầu tiên để bắt đầu quản lý tài chính</p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, transactions]) => {
            const dailyTotal = getDailyTotal(transactions);
            
            return (
              <div key={date} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Date Header */}
                <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize text-sm sm:text-base">{date}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{transactions.length} giao dịch</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-xs sm:text-sm text-gray-500">Tổng cộng</div>
                      <div className={`font-bold text-sm sm:text-base ${dailyTotal.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {fmt(Math.abs(dailyTotal.balance))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transactions */}
                <div className="divide-y divide-gray-100">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                          transaction.type === 'income' 
                            ? 'bg-emerald-100 text-emerald-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          <span className="text-base sm:text-lg">
                            {transaction.type === 'income' ? '💰' : '💸'}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{transaction.note}</h4>
                              <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mt-1">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 w-fit">
                                  {catLabel(transaction.category)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(transaction.date).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Amount and Actions */}
                            <div className="flex items-center justify-between sm:justify-end gap-2">
                              <div className={`text-right ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                <div className="font-bold text-sm sm:text-lg">
                                  {transaction.type === 'income' ? '+' : '-'}{fmt(transaction.amount)}
                                </div>
                              </div>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEdit(transaction)}
                                  className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                  title="Sửa giao dịch"
                                >
                                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(transaction.id)}
                                  className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Xóa giao dịch"
                                >
                                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Transactions;