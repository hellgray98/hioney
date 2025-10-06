import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/FirebaseDataContext';
import { formatCurrencyInput, parseCurrencyInput, formatCurrencyDisplay, handleCurrencyInputChange, handleCurrencyKeyDown } from '../utils/formatCurrency';

const Transactions = () => {
  const { theme } = useTheme();
  const { data, updateTransaction, deleteTransaction } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: '',
    categoryId: '',
    note: '',
    date: '',
    time: ''
  });

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = data.transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => {
        const category = data.categories.find(c => c.id === t.categoryId);
        return (
          t.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.categoryId === filterCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'amount_high':
          return b.amount - a.amount;
        case 'amount_low':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [data.transactions, data.categories, searchTerm, filterType, filterCategory, sortBy]);

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    const transactionDate = new Date(transaction.createdAt);
    setEditForm({
      amount: formatCurrencyInput(transaction.amount.toString()),
      categoryId: transaction.categoryId,
      note: transaction.note || '',
      date: transactionDate.toISOString().slice(0, 10),
      time: transactionDate.toTimeString().slice(0, 5)
    });
  };

  const handleSaveEdit = () => {
    if (editForm.amount && editForm.categoryId) {
      updateTransaction(editingId, {
        ...editForm,
        amount: parseCurrencyInput(editForm.amount),
        createdAt: new Date(`${editForm.date}T${editForm.time}`).toISOString()
      });
      setEditingId(null);
      setEditForm({
        amount: '',
        categoryId: '',
        note: '',
        date: '',
        time: ''
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      amount: '',
      categoryId: '',
      note: '',
      date: '',
      time: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa giao dịch này?')) {
      deleteTransaction(id);
    }
  };

  const formatCurrency = formatCurrencyDisplay;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 fade-in">
      {/* Header */}
      <div className="slide-in-down">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Giao dịch</h1>
      </div>

      {/* Filters - Enhanced */}
      <div className={`fintech-card p-6 transition-colors slide-in-up ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bộ lọc</h3>
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-sm">🔍</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Tìm kiếm</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo ghi chú hoặc danh mục..."
              className={`pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
            />
          </div>
          
          {/* Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Loại</label>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`select-fintech appearance-none pr-10 pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                }`}
              >
                <option value="all">Tất cả</option>
                <option value="income">Thu nhập</option>
                <option value="expense">Chi tiêu</option>
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Danh mục</label>
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`select-fintech appearance-none pr-10 pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                }`}
              >
                <option value="all">Tất cả</option>
                {data.categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Sắp xếp</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`select-fintech appearance-none pr-10 pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                }`}
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="amount_high">Số tiền cao</option>
                <option value="amount_low">Số tiền thấp</option>
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List - Enhanced */}
      <div className={`fintech-card p-6 transition-colors slide-in-up ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Danh sách giao dịch ({filteredTransactions.length})
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {filteredTransactions.length === 0 ? 'Không có kết quả' : 'Kết quả tìm kiếm'}
            </p>
          </div>
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-sm">📋</span>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map(transaction => {
              const category = data.categories.find(c => c.id === transaction.categoryId);
              const isEditing = editingId === transaction.id;
            
              return (
                <div
                  key={transaction.id}
                  className={`fintech-card p-4 transition-colors hover-lift stagger-item ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {isEditing ? (
                    // Edit Form - Enhanced
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white">Chỉnh sửa giao dịch</h4>
                        <div className="w-6 h-6 bg-warning-100 dark:bg-warning-900/20 rounded-lg flex items-center justify-center">
                          <span className="text-xs">✏️</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Số tiền</label>
                          <input
                            type="text"
                            value={editForm.amount}
                            onChange={(e) => handleCurrencyInputChange(e, (value) => setEditForm({...editForm, amount: value}))}
                            onKeyDown={handleCurrencyKeyDown}
                            placeholder="VD: 1.000.000"
                            className={`pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Danh mục</label>
                          <div className="relative">
                            <select
                              value={editForm.categoryId}
                              onChange={(e) => setEditForm({...editForm, categoryId: e.target.value})}
                              className={`select-fintech appearance-none pr-10 pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                              }`}
                            >
                              {data.categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.icon} {cat.name}
                                </option>
                              ))}
                            </select>
                            <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Ngày</label>
                          <div className="relative overflow-hidden">
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                              className={`pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ios-date-input ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                              }`}
                              style={{
                                fontSize: '16px',
                                minHeight: '40px',
                                WebkitAppearance: 'none',
                                appearance: 'none'
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Giờ</label>
                          <div className="relative overflow-hidden">
                            <input
                              type="time"
                              value={editForm.time}
                              onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                              className={`pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ios-time-input ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                              }`}
                              style={{
                                fontSize: '16px',
                                minHeight: '40px',
                                WebkitAppearance: 'none',
                                appearance: 'none'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white">Ghi chú</label>
                        <input
                          type="text"
                          value={editForm.note}
                          onChange={(e) => setEditForm({...editForm, note: e.target.value})}
                          className={`pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                          }`}
                          placeholder="Thêm ghi chú..."
                        />
                      </div>
                      <div className="flex space-x-3 pt-2">
                        <button
                          onClick={handleSaveEdit}
                          className="btn-fintech-primary flex-1"
                        >
                          Lưu thay đổi
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-fintech-secondary flex-1"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode - Mobile-friendly layout
                    <div className="relative">
                      {/* Main Content Layout */}
                      <div className="flex items-start gap-3 pr-16 sm:pr-20">
                        {/* Category Icon */}
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-fintech"
                          style={{ backgroundColor: category?.color || '#6b7280' }}
                        >
                          <span className="text-lg">{category?.icon || '📝'}</span>
                        </div>
                        
                        {/* Transaction Details - Takes up remaining space */}
                        <div className="flex-1 min-w-0">
                          {/* Title Row */}
                          <div className="mb-2">
                            <h4 className="font-bold text-gray-900 dark:text-white truncate leading-tight">
                              {category?.name || 'Không xác định'}
                            </h4>
                            {transaction.note && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">{transaction.note}</p>
                            )}
                          </div>
                          
                          {/* Amount Row */}
                          <div className="mb-2">
                            <div className={`font-extrabold text-lg leading-tight ${
                              transaction.type === 'income' ? 'text-success-500' : 'text-danger-500'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                            </div>
                          </div>
                          
                          {/* Date Row */}
                          <div className="mb-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatDate(transaction.createdAt)}
                            </span>
                          </div>
                          
                          {/* Type Status Row */}
                          <div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold ${
                              transaction.type === 'income' 
                                ? 'text-success-700 bg-success-100 dark:text-success-400 dark:bg-success-900/20'
                                : 'text-danger-700 bg-danger-100 dark:text-danger-400 dark:bg-danger-900/20'
                            }`}>
                              {transaction.type === 'income' ? (
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              )}
                              {transaction.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons - Responsive positioning */}
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg transition-all duration-200 flex items-center justify-center ${
                              theme === 'dark'
                                ? 'text-warning-400 hover:bg-warning-900/20 hover:text-warning-300'
                                : 'text-warning-600 hover:bg-warning-100 hover:text-warning-700'
                            }`}
                            title="Chỉnh sửa"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg transition-all duration-200 flex items-center justify-center ${
                              theme === 'dark'
                                ? 'text-danger-400 hover:bg-danger-900/20 hover:text-danger-300'
                                : 'text-danger-600 hover:bg-danger-100 hover:text-danger-700'
                            }`}
                            title="Xóa"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">📋</div>
            <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">Không có giao dịch nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;