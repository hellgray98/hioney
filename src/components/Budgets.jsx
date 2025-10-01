import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { formatCurrencyInput, parseCurrencyInput, formatCurrencyDisplay } from '../utils/formatCurrency';

const Budgets = () => {
  const { theme } = useTheme();
  const { data, addBudget, updateBudget, deleteBudget } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'month'
  });

  // Calculate budget usage
  const budgetStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return data.budgets.map(budget => {
      const category = data.categories.find(c => c.id === budget.categoryId);
      
      // Calculate spent amount for current period
      const spent = data.transactions
        .filter(t => {
          const transactionDate = new Date(t.createdAt);
          const isCurrentPeriod = budget.period === 'month' 
            ? transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
            : transactionDate.getFullYear() === currentYear;
          
          return t.categoryId === budget.categoryId && 
                 t.type === 'expense' && 
                 isCurrentPeriod;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = (spent / budget.amount) * 100;
      const remaining = budget.amount - spent;
      const isOverBudget = spent > budget.amount;

      return {
        ...budget,
        category,
        spent,
        remaining,
        percentage: Math.min(percentage, 100),
        isOverBudget
      };
    });
  }, [data.budgets, data.categories, data.transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const budgetData = {
      ...formData,
      amount: parseCurrencyInput(formData.amount)
    };

    if (editingId) {
      updateBudget(editingId, budgetData);
    } else {
      addBudget(budgetData);
    }

    setFormData({
      categoryId: '',
      amount: '',
      period: 'month'
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleEdit = (budget) => {
    setEditingId(budget.id);
    setFormData({
      categoryId: budget.categoryId,
      amount: formatCurrencyInput(budget.amount.toString()),
      period: budget.period
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa ngân sách này?')) {
      deleteBudget(id);
    }
  };

  const handleCancel = () => {
    setFormData({
      categoryId: '',
      amount: '',
      period: 'month'
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const formatCurrency = formatCurrencyDisplay;

  const getProgressColor = (percentage, isOverBudget) => {
    if (isOverBudget) return 'bg-red-500';
    if (percentage >= 90) return 'bg-yellow-500';
    if (percentage >= 75) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusText = (percentage, isOverBudget) => {
    if (isOverBudget) return 'Vượt ngân sách';
    if (percentage >= 90) return 'Gần hết ngân sách';
    if (percentage >= 75) return 'Cần chú ý';
    return 'Trong ngân sách';
  };

  const getStatusColor = (percentage, isOverBudget) => {
    if (isOverBudget) return 'text-red-500';
    if (percentage >= 90) return 'text-yellow-500';
    if (percentage >= 75) return 'text-orange-500';
    return 'text-green-500';
  };

  // Filter categories that don't have budgets yet
  const availableCategories = data.categories.filter(category => 
    !data.budgets.some(budget => budget.categoryId === category.id) ||
    (editingId && data.budgets.find(b => b.id === editingId)?.categoryId === category.id)
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ngân sách</h1>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={availableCategories.length === 0}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Thêm ngân sách
        </button>
      </div>

      {availableCategories.length === 0 && !showAddForm && (
        <div className={`rounded-2xl p-6 text-center transition-colors ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-gray-500">Tất cả danh mục đã có ngân sách</p>
          <p className="text-sm text-gray-400">Thêm danh mục mới để tạo ngân sách</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className={`rounded-2xl p-6 transition-colors ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Sửa ngân sách' : 'Thêm ngân sách mới'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Danh mục</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                >
                  <option value="">Chọn danh mục</option>
                  {availableCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Số tiền</label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => {
                    const formatted = formatCurrencyInput(e.target.value);
                    setFormData({...formData, amount: formatted});
                  }}
                  placeholder="Nhập số tiền (VD: 1.000.000)"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm font-medium mb-2">Chu kỳ</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({...formData, period: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="month">Hàng tháng</option>
                  <option value="year">Hàng năm</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets List */}
      {budgetStats.length > 0 ? (
        <div className="space-y-4">
          {budgetStats.map(budget => (
            <div
              key={budget.id}
              className={`rounded-2xl p-6 transition-colors ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: budget.category?.color || '#gray' }}
                  >
                    <span className="text-xl">{budget.category?.icon || '📝'}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{budget.category?.name || 'Không xác định'}</h3>
                    <p className="text-sm text-gray-500">
                      {budget.period === 'month' ? 'Hàng tháng' : 'Hàng năm'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                  </span>
                  <span className={`text-sm font-medium ${getStatusColor(budget.percentage, budget.isOverBudget)}`}>
                    {getStatusText(budget.percentage, budget.isOverBudget)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(budget.percentage, budget.isOverBudget)}`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                  <span>{budget.percentage.toFixed(1)}% đã sử dụng</span>
                  <span className={budget.remaining >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {budget.remaining >= 0 ? 'Còn lại: ' : 'Vượt: '}
                    {formatCurrency(Math.abs(budget.remaining))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`rounded-2xl p-6 text-center transition-colors ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-gray-500">Chưa có ngân sách nào</p>
          <p className="text-sm text-gray-400">Tạo ngân sách đầu tiên để quản lý chi tiêu!</p>
        </div>
      )}
    </div>
  );
};

export default Budgets;