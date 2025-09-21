import React, { useState } from 'react';
import { fmt } from '../utils/helpers';

const Goals = ({ 
  state, 
  addGoal, 
  updateGoal, 
  deleteGoal, 
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

  // Calculate goal analysis
  const totalTarget = state.goals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = state.goals.reduce((sum, g) => sum + g.saved, 0);
  const totalRemaining = totalTarget - totalSaved;
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  // Calculate completed goals
  const completedGoals = state.goals.filter(g => g.saved >= g.target).length;
  const inProgressGoals = state.goals.filter(g => g.saved < g.target && g.saved > 0).length;
  const notStartedGoals = state.goals.filter(g => g.saved === 0).length;

  return (
    <div className="space-y-8">
      {/* Header - Minimalist */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Mục tiêu tài chính
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Theo dõi và đạt được mục tiêu
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
            placeholder="Tìm kiếm mục tiêu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Goals Overview - Minimalist */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tổng mục tiêu</div>
            <div className="text-3xl font-light text-gray-900 dark:text-gray-100">
              {fmt(totalTarget)}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Đã tiết kiệm</div>
            <div className="text-3xl font-light text-emerald-600">
              {fmt(totalSaved)}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Tiến độ tổng</div>
            <div className="text-3xl font-light text-blue-600">
              {overallProgress.toFixed(1)}%
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Đã hoàn thành</div>
            <div className="text-3xl font-light text-yellow-600">
              {completedGoals}
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress - Minimalist */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-6">
          <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">Tiến độ tổng thể</h3>
          <div className="text-2xl font-light text-gray-900 dark:text-gray-100">
            {overallProgress.toFixed(1)}% hoàn thành
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{width: `${Math.min(overallProgress, 100)}%`}}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-3">
          <span>Còn lại: {fmt(totalRemaining)}</span>
          <span>{fmt(totalSaved)} / {fmt(totalTarget)}</span>
        </div>
      </div>

      {/* Goals List */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách mục tiêu</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {state.goals.filter(g => {
            const q = query.toLowerCase();
            return !q || g.name.toLowerCase().includes(q);
          }).map(goal => {
            const progress = (goal.saved / goal.target) * 100;
            const isCompleted = goal.saved >= goal.target;
            const remaining = goal.target - goal.saved;
            
            return (
              <div key={goal.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isCompleted ? 'bg-emerald-100' : 
                        progress > 0 ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <span className="text-sm">
                          {isCompleted ? '✅' : progress > 0 ? '🎯' : '📝'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{goal.name}</h4>
                        <div className="text-sm text-gray-500">
                          {isCompleted ? 'Đã hoàn thành!' : 
                           progress > 0 ? 'Đang thực hiện' : 'Chưa bắt đầu'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                        }`}
                        style={{width: `${Math.min(progress, 100)}%`}}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {fmt(goal.saved)} / {fmt(goal.target)}
                      </span>
                      <span className={`font-semibold ${
                        isCompleted ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    
                    {!isCompleted && (
                      <div className="text-xs text-gray-500 mt-1">
                        Còn lại: {fmt(remaining)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Sửa mục tiêu"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Xóa mục tiêu"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Goals;
