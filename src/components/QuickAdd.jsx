import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { formatCurrencyInput, parseCurrencyInput } from '../utils/formatCurrency';

const QuickAdd = ({ onClose }) => {
  const { theme } = useTheme();
  const { data, addTransaction } = useData();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    categoryId: '',
    note: '',
    date: new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:MM
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    addTransaction({
      ...formData,
      amount: parseCurrencyInput(formData.amount),
      createdAt: new Date(formData.date).toISOString()
    });

    setFormData({
      type: 'expense',
      amount: '',
      categoryId: '',
      note: '',
      date: new Date().toISOString().slice(0, 16)
    });
    onClose();
  };

  const filteredCategories = data.categories.filter(cat => 
    cat.type === formData.type || cat.type === 'both'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-2xl p-6 transition-colors ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Thêm giao dịch</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'text-gray-400 hover:bg-gray-700' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'income'})}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                formData.type === 'income'
                  ? 'bg-green-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              💰 Thu nhập
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'expense'})}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                formData.type === 'expense'
                  ? 'bg-red-500 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              💸 Chi tiêu
            </button>
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
              {filteredCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium mb-2">Ngày & Giờ</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className={`w-full px-4 py-3 rounded-lg border transition-colors text-base ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              style={{
                fontSize: '16px', // Prevent zoom on iOS
                minHeight: '48px',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium mb-2">Ghi chú (tùy chọn)</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              placeholder="Ghi chú ngắn..."
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Thêm giao dịch
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuickAdd;
