import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Categories = () => {
  const { theme } = useTheme();
  const { data, addCategory, updateCategory, deleteCategory } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📝',
    color: '#3B82F6',
    type: 'expense'
  });

  const icons = [
    '🍽️', '🚗', '📄', '🎮', '🛍️', '🏥', '💰', '🎁', '📈', '📝',
    '🏠', '⚡', '📱', '👕', '🎬', '🍕', '☕', '🎵', '📚', '🏃',
    '✈️', '🎯', '💊', '🔧', '🎨', '🌱', '🎪', '🏖️', '🎭', '🎲'
  ];

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên danh mục!');
      return;
    }

    if (editingId) {
      updateCategory(editingId, formData);
    } else {
      addCategory(formData);
    }

    setFormData({
      name: '',
      icon: '📝',
      color: '#3B82F6',
      type: 'expense'
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
      type: category.type
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      deleteCategory(id);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      icon: '📝',
      color: '#3B82F6',
      type: 'expense'
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const expenseCategories = data.categories.filter(c => c.type === 'expense' || c.type === 'both');
  const incomeCategories = data.categories.filter(c => c.type === 'income' || c.type === 'both');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 slide-in-down">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Danh mục</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">Quản lý danh mục thu chi</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-fintech-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className={`fintech-card-elevated p-6 transition-colors slide-in-up ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {editingId ? 'Cập nhật thông tin danh mục' : 'Tạo danh mục để phân loại giao dịch'}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className={`p-2.5 rounded-xl transition-all duration-200 ${
                theme === 'dark' 
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-white' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Tên danh mục</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nhập tên danh mục"
                  className="input-fintech"
                  required
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Loại giao dịch</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="select-fintech"
                >
                  <option value="expense">Chi tiêu</option>
                  <option value="income">Thu nhập</option>
                  <option value="both">Cả hai</option>
                </select>
              </div>
            </div>

            {/* Icon Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Chọn biểu tượng</label>
              <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-2">
                {icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({...formData, icon})}
                    className={`aspect-square rounded-xl border-2 transition-all duration-200 flex items-center justify-center hover:scale-105 ${
                      formData.icon === icon
                        ? 'border-success-500 bg-success-100 dark:bg-success-900/20 shadow-fintech'
                        : theme === 'dark'
                          ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Chọn màu sắc</label>
              <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, color})}
                    className={`aspect-square rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      formData.color === color
                        ? 'border-gray-900 dark:border-white shadow-fintech-md'
                        : 'border-transparent hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Xem trước</label>
              <div className={`flex items-center space-x-4 p-4 rounded-xl border ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
              }`}>
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-fintech"
                  style={{ backgroundColor: formData.color }}
                >
                  <span className="text-2xl">{formData.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                    {formData.name || 'Tên danh mục'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formData.type === 'expense' ? 'Dành cho chi tiêu' : 
                     formData.type === 'income' ? 'Dành cho thu nhập' : 'Dành cho cả thu chi'}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="btn-fintech-primary flex-1"
              >
                {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-fintech-secondary flex-1"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Expense Categories */}
        <div className={`fintech-card p-6 transition-colors hover-lift stagger-item ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3 text-2xl">💸</span>
                Danh mục chi tiêu
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {expenseCategories.length} danh mục
              </p>
            </div>
            <div className="w-8 h-8 bg-danger-100 dark:bg-danger-900/20 rounded-lg flex items-center justify-center">
              <span className="text-sm text-danger-600 dark:text-danger-400 font-bold">{expenseCategories.length}</span>
            </div>
          </div>
          <div className="space-y-3">
            {expenseCategories.length > 0 ? expenseCategories.map(category => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-fintech ${
                  theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-fintech flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-xl">{category.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{category.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {category.type === 'both' ? 'Thu chi' : 'Chi tiêu'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(category)}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      theme === 'dark'
                        ? 'text-warning-400 hover:bg-warning-900/20 hover:text-warning-300'
                        : 'text-warning-600 hover:bg-warning-100 hover:text-warning-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      theme === 'dark'
                        ? 'text-danger-400 hover:bg-danger-900/20 hover:text-danger-300'
                        : 'text-danger-600 hover:bg-danger-100 hover:text-danger-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">💸</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Chưa có danh mục chi tiêu</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Thêm danh mục đầu tiên</p>
              </div>
            )}
          </div>
        </div>

        {/* Income Categories */}
        <div className={`fintech-card p-6 transition-colors hover-lift stagger-item ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3 text-2xl">💰</span>
                Danh mục thu nhập
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {incomeCategories.length} danh mục
              </p>
            </div>
            <div className="w-8 h-8 bg-success-100 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
              <span className="text-sm text-success-600 dark:text-success-400 font-bold">{incomeCategories.length}</span>
            </div>
          </div>
          <div className="space-y-3">
            {incomeCategories.length > 0 ? incomeCategories.map(category => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-fintech ${
                  theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-fintech flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-xl">{category.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{category.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {category.type === 'both' ? 'Thu chi' : 'Thu nhập'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(category)}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      theme === 'dark'
                        ? 'text-warning-400 hover:bg-warning-900/20 hover:text-warning-300'
                        : 'text-warning-600 hover:bg-warning-100 hover:text-warning-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      theme === 'dark'
                        ? 'text-danger-400 hover:bg-danger-900/20 hover:text-danger-300'
                        : 'text-danger-600 hover:bg-danger-100 hover:text-danger-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">💰</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Chưa có danh mục thu nhập</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Thêm danh mục đầu tiên</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
