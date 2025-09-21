import React, { useState } from 'react';
import { fmt } from '../utils/helpers';

const Budgets = ({ 
  state, 
  addBudget, 
  updateBudget, 
  deleteBudget, 
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

  const catLabel = (id) => state.categories.find(c => c.id === id)?.label || id;

  // Calculate budget analysis
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthTx = state.transactions.filter(t => t.date?.slice(0, 7) === currentMonth);
  const monthExpenseByCat = {};
  
  monthTx.forEach(t => {
    if (t.type !== "expense") return;
    monthExpenseByCat[t.category] = (monthExpenseByCat[t.category] || 0) + t.amount;
  });

  const budgetAnalysis = state.budgets.map(budget => {
    const spent = monthExpenseByCat[budget.category] || 0;
    const remaining = budget.monthly - spent;
    const percentage = (spent / budget.monthly) * 100;
    return {
      ...budget,
      spent,
      remaining,
      percentage: Math.min(percentage, 100),
      categoryLabel: catLabel(budget.category)
    };
  });

  return (
    <div className="space-y-8">
      {/* Header - Minimalist */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Ngân sách
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Quản lý ngân sách hàng tháng
        </p>
      </div>

      {/* Search and Filters - Minimalist */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Tìm kiếm ngân sách..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Budget Overview - Minimalist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tổng ngân sách</div>
            <div className="text-3xl font-light text-gray-900 dark:text-gray-100">
              {fmt(state.budgets.reduce((sum, b) => sum + b.monthly, 0))}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Đã chi tiêu</div>
            <div className="text-3xl font-light text-red-600">
              {fmt(budgetAnalysis.reduce((sum, b) => sum + b.spent, 0))}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Còn lại</div>
            <div className="text-3xl font-light text-emerald-600">
              {fmt(budgetAnalysis.reduce((sum, b) => sum + b.remaining, 0))}
            </div>
          </div>
        </div>
      </div>

      {/* Budget List - Minimalist */}
      <div className="space-y-6">
        {budgetAnalysis.filter(b => {
          const q = query.toLowerCase();
          return !q || b.categoryLabel.toLowerCase().includes(q);
        }).length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Chưa có ngân sách</h3>
            <p className="text-gray-500 dark:text-gray-400">Thêm ngân sách đầu tiên để bắt đầu quản lý chi tiêu</p>
          </div>
        ) : (
          budgetAnalysis.filter(b => {
            const q = query.toLowerCase();
            return !q || b.categoryLabel.toLowerCase().includes(q);
          }).map(budget => (
            <div key={budget.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📊</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-base">{budget.categoryLabel}</h4>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {fmt(budget.spent)} / {fmt(budget.monthly)}
                      </div>
                    </div>

                    {/* Progress and Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className={`font-bold text-sm ${budget.remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {budget.remaining >= 0 ? 'Còn lại: ' : 'Vượt: '}{fmt(Math.abs(budget.remaining))}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {budget.percentage.toFixed(1)}% đã sử dụng
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(budget)}
                          className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
                          title="Sửa ngân sách"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(budget.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Xóa ngân sách"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          budget.percentage > 100 ? 'bg-red-500' :
                          budget.percentage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`}
                        style={{width: `${Math.min(budget.percentage, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Budgets;
