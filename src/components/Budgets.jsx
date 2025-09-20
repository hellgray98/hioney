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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Ngân sách</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý ngân sách</p>
        </div>
        <div className="flex gap-3">
          <input
            className="flex-1 sm:w-64 input-field"
            placeholder="Tìm kiếm ngân sách..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tổng ngân sách</div>
              <div className="text-lg font-bold text-gray-900">
                {fmt(state.budgets.reduce((sum, b) => sum + b.monthly, 0))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">💸</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Đã chi tiêu</div>
              <div className="text-lg font-bold text-red-600">
                {fmt(budgetAnalysis.reduce((sum, b) => sum + b.spent, 0))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Còn lại</div>
              <div className="text-lg font-bold text-emerald-600">
                {fmt(budgetAnalysis.reduce((sum, b) => sum + b.remaining, 0))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget List */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách ngân sách</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {budgetAnalysis.filter(b => {
            const q = query.toLowerCase();
            return !q || b.categoryLabel.toLowerCase().includes(q);
          }).map(budget => (
            <div key={budget.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📊</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{budget.categoryLabel}</h4>
                      <div className="text-sm text-gray-500">
                        {fmt(budget.spent)} / {fmt(budget.monthly)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        budget.percentage > 100 ? 'bg-red-500' :
                        budget.percentage > 80 ? 'bg-yellow-500' : 'bg-emerald-500'
                      }`}
                      style={{width: `${Math.min(budget.percentage, 100)}%`}}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{budget.percentage.toFixed(1)}% đã sử dụng</span>
                    <span className={budget.remaining >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                      {budget.remaining >= 0 ? 'Còn lại: ' : 'Vượt: '}{fmt(Math.abs(budget.remaining))}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Sửa ngân sách"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Xóa ngân sách"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Budgets;
