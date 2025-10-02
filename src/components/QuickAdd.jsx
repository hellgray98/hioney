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
    date: new Date().toISOString().slice(0, 10), // Format: YYYY-MM-DD
    time: new Date().toTimeString().slice(0, 5) // Format: HH:MM
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
      createdAt: new Date(`${formData.date}T${formData.time}`).toISOString()
    });

    setFormData({
      type: 'expense',
      amount: '',
      categoryId: '',
      note: '',
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5)
    });
    onClose();
  };

  const filteredCategories = data.categories.filter(cat => 
    cat.type === formData.type || cat.type === 'both'
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 fade-in overflow-y-auto">
      <div className={`w-full max-w-lg my-4 sm:my-0 rounded-2xl shadow-fintech-xl transition-colors scale-in-center max-h-[calc(100vh-2rem)] flex flex-col ${
        theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
      }`}>
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Thêm giao dịch</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Ghi lại thu chi nhanh chóng</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 ${
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

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Type Selection - Enhanced */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Loại giao dịch</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income', categoryId: ''})}
                  className={`flex items-center justify-center space-x-2 py-3 sm:py-4 px-3 sm:px-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                    formData.type === 'income'
                      ? 'bg-success-500 text-white shadow-fintech-md'
                      : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className="text-lg sm:text-xl">💰</span>
                  <span>Thu nhập</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense', categoryId: ''})}
                  className={`flex items-center justify-center space-x-2 py-3 sm:py-4 px-3 sm:px-4 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                    formData.type === 'expense'
                      ? 'bg-danger-500 text-white shadow-fintech-md'
                      : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className="text-lg sm:text-xl">💸</span>
                  <span>Chi tiêu</span>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Số tiền</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => {
                    const formatted = formatCurrencyInput(e.target.value);
                    setFormData({...formData, amount: formatted});
                  }}
                  placeholder="Nhập số tiền (VD: 1.000.000)"
                  className="input-fintech text-base sm:text-lg pr-12"
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm">
                  VND
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Danh mục</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                className="select-fintech"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white">Ngày</label>
                <div className="relative overflow-hidden">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="input-fintech ios-date-input"
                    style={{
                      fontSize: '16px',
                      minHeight: '48px',
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
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="input-fintech ios-time-input"
                    style={{
                      fontSize: '16px',
                      minHeight: '48px',
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white">Ghi chú <span className="font-normal text-gray-500">(tùy chọn)</span></label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
                placeholder="Thêm ghi chú..."
                className="input-fintech"
              />
            </div>
          </form>
        </div>

        {/* Submit Buttons - Fixed */}
        <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="btn-fintech-secondary flex-1 order-2 sm:order-1"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="btn-fintech-primary flex-1 order-1 sm:order-2"
            >
              Thêm giao dịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickAdd;
