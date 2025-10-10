import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/FirebaseDataContext';
import { formatCurrencyInput, parseCurrencyInput, formatCurrencyDisplay, handleCurrencyInputChange, handleCurrencyKeyDown } from '../utils/formatCurrency';

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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Ngân sách</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.budgets.length} ngân sách</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            disabled={availableCategories.length === 0}
            className="btn-fintech-primary w-12 h-12 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Thêm ngân sách"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

      {availableCategories.length === 0 && !showAddForm && (
        <div className="fintech-card text-center slide-in-up">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center bounce-in">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tất cả danh mục đã có ngân sách</h3>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {editingId ? 'Sửa ngân sách' : 'Thêm ngân sách mới'}
            </h3>
            <button
              onClick={handleCancel}
              className="btn-fintech-ghost w-10 h-10 p-0"
              title="Đóng"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Danh mục</label>
                 <div className="relative">
                   <select
                     value={formData.categoryId}
                     onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                     className={`select-fintech appearance-none pr-10 pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 ${
                       theme === 'dark'
                         ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                         : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
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
                   <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
                     theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                   }`}>
                     <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                     </svg>
                   </div>
                 </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Số tiền</label>
                <input
                  type="text"
                  value={formData.amount}
                    onChange={(e) => handleCurrencyInputChange(e, (value) => setFormData({...formData, amount: value}))}
                    onKeyDown={handleCurrencyKeyDown}
                  placeholder="Nhập số tiền (VD: 1.000.000)"
                  className={`pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                  }`}
                  required
                />
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm font-medium mb-2">Chu kỳ</label>
                 <div className="relative">
                   <select
                     value={formData.period}
                     onChange={(e) => setFormData({...formData, period: e.target.value})}
                     className={`select-fintech appearance-none pr-10 pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 ${
                       theme === 'dark'
                         ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                         : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                     }`}
                   >
                     <option value="month">Hàng tháng</option>
                     <option value="year">Hàng năm</option>
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

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="btn-fintech-primary flex-1"
              >
                {editingId ? 'Cập nhật' : 'Thêm'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-fintech-secondary flex-1"
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
    </div>
  );
};

export default Budgets;