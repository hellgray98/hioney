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
    date: ''
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
      date: transactionDate.toISOString().slice(0, 16)
    });
  };

  const handleSaveEdit = () => {
    if (editForm.amount && editForm.categoryId) {
      updateTransaction(editingId, {
        ...editForm,
        amount: parseCurrencyInput(editForm.amount),
        createdAt: new Date(editForm.date).toISOString()
      });
      setEditingId(null);
      setEditForm({
        amount: '',
        categoryId: '',
        note: '',
        date: ''
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      amount: '',
      categoryId: '',
      note: '',
      date: ''
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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Giao dịch</h1>

      {/* Filters */}
      <div className={`rounded-2xl p-6 transition-colors ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Tìm kiếm</label>
          <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo ghi chú hoặc danh mục..."
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
          />
        </div>
        
          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Loại</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
            <option value="all">Tất cả</option>
            <option value="income">Thu nhập</option>
            <option value="expense">Chi tiêu</option>
          </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Danh mục</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
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
          <div>
            <label className="block text-sm font-medium mb-2">Sắp xếp</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="amount_high">Số tiền cao</option>
              <option value="amount_low">Số tiền thấp</option>
          </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className={`rounded-2xl p-6 transition-colors ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            Danh sách giao dịch ({filteredTransactions.length})
          </h3>
            </div>

        {filteredTransactions.length > 0 ? (
          <div className="space-y-3">
            {filteredTransactions.map(transaction => {
              const category = data.categories.find(c => c.id === transaction.categoryId);
              const isEditing = editingId === transaction.id;
            
            return (
                <div
                  key={transaction.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {isEditing ? (
                    // Edit Form
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Số tiền</label>
                          <input
                            type="text"
                            value={editForm.amount}
                            onChange={(e) => {
                              const formatted = formatCurrencyInput(e.target.value);
                              setEditForm({...editForm, amount: formatted});
                            }}
                            placeholder="VD: 1.000.000"
                            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                              theme === 'dark'
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Danh mục</label>
                          <select
                            value={editForm.categoryId}
                            onChange={(e) => setEditForm({...editForm, categoryId: e.target.value})}
                            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                              theme === 'dark'
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            {data.categories.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.icon} {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Ngày & Giờ</label>
                          <input
                            type="datetime-local"
                            value={editForm.date}
                            onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                              theme === 'dark'
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                    <div>
                          <label className="block text-sm font-medium mb-1">Ghi chú</label>
                          <input
                            type="text"
                            value={editForm.note}
                            onChange={(e) => setEditForm({...editForm, note: e.target.value})}
                            className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                              theme === 'dark'
                                ? 'bg-gray-600 border-gray-500 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          />
                        </div>
                    </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: category?.color || '#gray' }}
                        >
                          <span className="text-xl">{category?.icon || '📝'}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{category?.name || 'Không xác định'}</h4>
                          {transaction.note && (
                            <p className="text-sm text-gray-500">{transaction.note}</p>
                          )}
                          <p className="text-xs text-gray-400">{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
                      <div className="flex items-center space-x-2">
                        <div className={`text-right ${
                          transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          <div className="font-bold">
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-xs">
                            {transaction.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                                <button
                                  onClick={() => handleEdit(transaction)}
                            className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                                >
                            ✏️
                                </button>
                                <button
                                  onClick={() => handleDelete(transaction.id)}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                >
                            🗑️
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
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500">Không có giao dịch nào</p>
            <p className="text-sm text-gray-400">Thêm giao dịch đầu tiên của bạn!</p>
              </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;