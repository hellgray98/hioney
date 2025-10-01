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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh mục</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Thêm danh mục
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className={`rounded-2xl p-6 transition-colors ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Tên danh mục</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nhập tên danh mục"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Loại</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="expense">Chi tiêu</option>
                  <option value="income">Thu nhập</option>
                  <option value="both">Cả hai</option>
                </select>
              </div>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Biểu tượng</label>
              <div className="grid grid-cols-10 gap-2">
                {icons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({...formData, icon})}
                    className={`w-10 h-10 rounded-lg border-2 transition-colors ${
                      formData.icon === icon
                        ? 'border-blue-500 bg-blue-100'
                        : theme === 'dark'
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Màu sắc</label>
              <div className="grid grid-cols-10 gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({...formData, color})}
                    className={`w-10 h-10 rounded-lg border-2 transition-colors ${
                      formData.color === color
                        ? 'border-gray-800'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium mb-2">Xem trước</label>
              <div className="flex items-center space-x-3 p-4 rounded-lg border">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: formData.color }}
                >
                  <span className="text-xl">{formData.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{formData.name || 'Tên danh mục'}</h4>
                  <p className="text-sm text-gray-500">
                    {formData.type === 'expense' ? 'Chi tiêu' : 
                     formData.type === 'income' ? 'Thu nhập' : 'Cả hai'}
                  </p>
                </div>
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

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Categories */}
        <div className={`rounded-2xl p-6 transition-colors ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">💸</span>
            Danh mục chi tiêu
          </h3>
          <div className="space-y-3">
            {expenseCategories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-lg">{category.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-gray-500">
                      {category.type === 'both' ? 'Chi tiêu & Thu nhập' : 'Chi tiêu'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div className={`rounded-2xl p-6 transition-colors ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <span className="mr-2">💰</span>
            Danh mục thu nhập
          </h3>
          <div className="space-y-3">
            {incomeCategories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-lg">{category.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-gray-500">
                      {category.type === 'both' ? 'Chi tiêu & Thu nhập' : 'Thu nhập'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
