import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { formatCurrencyInput, parseCurrencyInput, formatCurrencyDisplay } from '../utils/formatCurrency';

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
        <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">Quản lý và theo dõi mọi giao dịch</p>
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
              className="input-fintech"
            />
          </div>
          
          {/* Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Loại</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="select-fintech"
            >
              <option value="all">Tất cả</option>
              <option value="income">Thu nhập</option>
              <option value="expense">Chi tiêu</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Danh mục</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="select-fintech"
            >
              <option value="all">Tất cả</option>
              {data.categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">Sắp xếp</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-fintech"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="amount_high">Số tiền cao</option>
              <option value="amount_low">Số tiền thấp</option>
            </select>
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
                            onChange={(e) => {
                              const formatted = formatCurrencyInput(e.target.value);
                              setEditForm({...editForm, amount: formatted});
                            }}
                            placeholder="VD: 1.000.000"
                            className="input-fintech"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-900 dark:text-white">Danh mục</label>
                          <select
                            value={editForm.categoryId}
                            onChange={(e) => setEditForm({...editForm, categoryId: e.target.value})}
                            className="select-fintech"
                          >
                            {data.categories.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                              </option>
                            ))}
                          </select>
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
                              className="input-fintech ios-date-input"
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
                              className="input-fintech ios-time-input"
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
                          className="input-fintech"
                          placeholder="Thêm ghi chú..."
                        />
                      </div>
                      <div className="flex space-x-3 pt-2">
                        <button
                          onClick={handleSaveEdit}
                          className="btn-fintech-success flex-1"
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
                    // Display Mode - Redesigned for better responsive
                    <div className="space-y-3">
                      {/* Top Row: Category Info + Amount */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-fintech"
                            style={{ backgroundColor: category?.color || '#6b7280' }}
                          >
                            <span className="text-lg">{category?.icon || '📝'}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white truncate">{category?.name || 'Không xác định'}</h4>
                            {transaction.note && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-0.5">{transaction.note}</p>
                            )}
                          </div>
                        </div>
                        
                        {/* Amount - Always visible and properly sized */}
                        <div className={`text-right flex-shrink-0 ${
                          transaction.type === 'income' ? 'text-success-500' : 'text-danger-500'
                        }`}>
                          <div className="font-extrabold text-lg leading-tight">
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Date/Time Tags + Action Buttons */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex-shrink-0">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(transaction.createdAt)}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0 ${
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
                        
                        <div className="flex space-x-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              theme === 'dark'
                                ? 'text-warning-400 hover:bg-warning-900/20 hover:text-warning-300'
                                : 'text-warning-600 hover:bg-warning-100 hover:text-warning-700'
                            }`}
                            title="Chỉnh sửa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              theme === 'dark'
                                ? 'text-danger-400 hover:bg-danger-900/20 hover:text-danger-300'
                                : 'text-danger-600 hover:bg-danger-100 hover:text-danger-700'
                            }`}
                            title="Xóa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Thêm giao dịch đầu tiên của bạn để bắt đầu!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;