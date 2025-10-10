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

    if (searchTerm) {
      filtered = filtered.filter(t => {
        const category = data.categories.find(c => c.id === t.categoryId);
        return (
          t.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.categoryId === filterCategory);
    }

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
      setEditForm({ amount: '', categoryId: '', note: '', date: '', time: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ amount: '', categoryId: '', note: '', date: '', time: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa giao dịch này?')) {
      deleteTransaction(id);
    }
  };

  const formatCurrency = formatCurrencyDisplay;

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Giao dịch</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filteredTransactions.length} giao dịch
          </p>
        </div>

        {/* Filters */}
        <div className={`rounded-2xl sm:rounded-3xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
        }`}>
          <div className="p-3 sm:p-5 lg:p-6">
            <div className="space-y-2 sm:space-y-0 sm:grid sm:grid-cols-4 sm:gap-3">
              {/* Search */}
              <div className="sm:col-span-2 relative">
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm giao dịch..."
                  className={`pl-9 pr-3 py-2.5 sm:pr-4 w-full rounded-xl border font-medium text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 hover:border-gray-600 focus:border-gray-600'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300 focus:border-gray-400'
                  }`}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                        : 'text-gray-400 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Type Filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`w-full px-3 py-2.5 pr-10 rounded-xl border font-medium text-sm transition-all appearance-none cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
                      : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <option value="all">💰 Tất cả</option>
                  <option value="income">📈 Thu nhập</option>
                  <option value="expense">📉 Chi tiêu</option>
                </select>
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`w-full px-3 py-2.5 pr-10 rounded-xl border font-medium text-sm transition-all appearance-none cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white hover:border-gray-600'
                      : 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <option value="all">📁 Tất cả danh mục</option>
                  {data.categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className={`rounded-2xl sm:rounded-3xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
        }`}>
          <div className="p-3 sm:p-5 lg:p-6">
            {filteredTransactions.length > 0 ? (
              <div 
                className={`space-y-2 ${
                  filteredTransactions.length > 6
                    ? 'max-h-[500px] sm:max-h-[755px] overflow-y-auto bg-gray-50/50 dark:bg-black/50 p-2 rounded-xl sm:rounded-2xl scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent'
                    : ''
                }`}
              >
                {filteredTransactions.map(transaction => {
                  const category = data.categories.find(c => c.id === transaction.categoryId);
                  const isIncome = transaction.type === 'income';
                  const isEditing = editingId === transaction.id;
                  
                  if (isEditing) {
                    return (
                      <div key={transaction.id} className={`rounded-2xl p-3 sm:p-4 ${
                        theme === 'dark' ? 'bg-blue-600/20 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-200'
                      }`}>
                        <div className="space-y-2.5 sm:space-y-3">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-1">Chỉnh sửa giao dịch</p>
                          
                          <input
                            type="text"
                            value={editForm.amount}
                            onChange={(e) => handleCurrencyInputChange(e, (value) => setEditForm({...editForm, amount: value}))}
                            onKeyDown={handleCurrencyKeyDown}
                            placeholder="Số tiền"
                            className={`px-3 py-2.5 w-full rounded-xl border font-medium text-sm ${
                              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'
                            }`}
                          />
                          
                          <select
                            value={editForm.categoryId}
                            onChange={(e) => setEditForm({...editForm, categoryId: e.target.value})}
                            className={`px-3 py-2.5 w-full rounded-xl border font-medium text-sm ${
                              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'
                            }`}
                          >
                            {data.categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                            ))}
                          </select>
                          
                          <input
                            type="text"
                            value={editForm.note}
                            onChange={(e) => setEditForm({...editForm, note: e.target.value})}
                            placeholder="Ghi chú (tuỳ chọn)"
                            className={`px-3 py-2.5 w-full rounded-xl border font-medium text-sm ${
                              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 placeholder-gray-400'
                            }`}
                          />
                          
                          <div className="flex gap-2 pt-1">
                            <button 
                              onClick={handleSaveEdit} 
                              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                                theme === 'dark' ? 'bg-blue-600 text-white active:bg-blue-700' : 'bg-gray-900 text-white active:bg-gray-800'
                              }`}
                            >
                              Lưu
                            </button>
                            <button 
                              onClick={handleCancelEdit} 
                              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                                theme === 'dark' ? 'bg-gray-700 text-white active:bg-gray-600' : 'bg-gray-200 text-gray-900 active:bg-gray-300'
                              }`}
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <div 
                      key={transaction.id}
                      className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      {/* Mobile Layout */}
                      <div className="block sm:hidden">
                        <div className="flex gap-3">
                          <div 
                            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: category?.color || '#6b7280' }}
                          >
                            <span className="text-2xl">{category?.icon || '📝'}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex items-start justify-between gap-2 mb-0.5">
                              <div className="flex-1 min-w-0">
                                <p className="text-base font-bold text-gray-900 dark:text-white truncate leading-tight">
                                  {category?.name || 'Không xác định'}
                                </p>
                                {transaction.note && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{transaction.note}</p>
                                )}
                              </div>
                              <p className={`text-lg font-bold flex-shrink-0 ml-2 ${
                                isIncome ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                              }`}>
                                {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                                isIncome
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {isIncome ? '↑ Thu' : '↓ Chi'}
                              </span>
                              
                              <p className="text-xs text-gray-400 dark:text-gray-500 flex-1 text-center">
                                {new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEdit(transaction)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                                    theme === 'dark'
                                      ? 'bg-gray-700/80 text-gray-300 active:bg-gray-600'
                                      : 'bg-gray-200 text-gray-600 active:bg-gray-300'
                                  }`}
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDelete(transaction.id)}
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-90 ${
                                    theme === 'dark'
                                      ? 'bg-red-900/30 text-red-400 active:bg-red-900/50'
                                      : 'bg-red-100 text-red-600 active:bg-red-200'
                                  }`}
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center gap-4">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0"
                          style={{ backgroundColor: category?.color || '#6b7280' }}
                        >
                          <span className="text-2xl">{category?.icon || '📝'}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-base font-bold text-gray-900 dark:text-white truncate">
                              {category?.name || 'Không xác định'}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                              isIncome
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {isIncome ? 'Thu nhập' : 'Chi tiêu'}
                            </span>
                          </div>
                          {transaction.note && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">{transaction.note}</p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <p className={`text-xl font-bold min-w-[140px] text-right ${
                            isIncome ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                          </p>
                          
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                theme === 'dark'
                                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                                  : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                theme === 'dark'
                                  ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300'
                                  : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <span className="text-4xl">📋</span>
                </div>
                <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Chưa có giao dịch
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Giao dịch của bạn sẽ hiển thị ở đây
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
