import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCreditStore from '../../store/creditStore';
import { formatCurrencyInput, parseCurrencyInput, handleCurrencyInputChange, handleCurrencyKeyDown } from '../../utils/formatCurrency';

const EditTransactionModal = ({ transaction, isOpen, onClose, onSave }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { updateTransaction } = useCreditStore();
  
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    transactionDate: '',
    postDate: '',
    isPending: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when transaction changes
  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount?.toLocaleString('vi-VN') || '',
        description: transaction.description || '',
        category: transaction.category || '',
        transactionDate: transaction.transactionDate ? 
          new Date(transaction.transactionDate).toISOString().split('T')[0] : '',
        postDate: transaction.postDate ? 
          new Date(transaction.postDate).toISOString().split('T')[0] : '',
        isPending: transaction.isPending || false
      });
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await updateTransaction(transaction.id, {
        ...formData,
        amount: parseCurrencyInput(formData.amount),
        transactionDate: new Date(formData.transactionDate),
        postDate: new Date(formData.postDate)
      }, currentUser.uid);
      
      onSave?.();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 modal-backdrop overflow-y-auto !mt-0">
      <div 
        className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                Chỉnh sửa giao dịch
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                Cập nhật thông tin giao dịch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-fintech-ghost w-8 h-8 sm:w-10 sm:h-10 p-0 flex-shrink-0"
            title="Đóng"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Form */}
        <div className="px-3 sm:px-6 py-4 sm:py-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="p-3 sm:p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-xs sm:text-sm flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {/* Amount */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  Số tiền
                </label>
                <input
                  type="text"
                  value={formData.amount}
                  onChange={(e) => handleCurrencyInputChange(e, (value) => setFormData({...formData, amount: value}))}
                  onKeyDown={handleCurrencyKeyDown}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 font-semibold text-xs sm:text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                  }`}
                  placeholder="1.000.000"
                />
              </div>

              {/* Transaction Date */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  Ngày giao dịch
                </label>
                <input
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) => setFormData({...formData, transactionDate: e.target.value})}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 font-semibold text-xs sm:text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                  }`}
                />
              </div>
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                Mô tả
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 font-semibold text-xs sm:text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                }`}
                placeholder="VD: Mua sắm tại ABC Store"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {/* Category Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  Danh mục chi tiêu
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={`appearance-none pr-8 sm:pr-10 pl-3 sm:pl-4 py-2 sm:py-2.5 w-full rounded-lg sm:rounded-xl border-2 font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                    }`}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="food">🍜 Ăn uống</option>
                    <option value="transport">🚗 Di chuyển</option>
                    <option value="shopping">🛒 Mua sắm</option>
                    <option value="entertainment">🎬 Giải trí</option>
                    <option value="bills">💡 Hóa đơn</option>
                    <option value="health">🏥 Sức khỏe</option>
                    <option value="education">📚 Giáo dục</option>
                    <option value="other">📝 Khác</option>
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Post Date */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  Ngày ghi nhận
                </label>
                <input
                  type="date"
                  value={formData.postDate}
                  onChange={(e) => setFormData({...formData, postDate: e.target.value})}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 font-semibold text-xs sm:text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                  }`}
                />
              </div>
            </div>
            
            {/* Pending Status */}
            <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl">
              <input
                type="checkbox"
                id="isPending"
                checked={formData.isPending}
                onChange={(e) => setFormData({...formData, isPending: e.target.checked})}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isPending" className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                Giao dịch đang chờ xử lý
              </label>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="btn-fintech-secondary text-xs sm:text-base py-2 sm:py-3 px-4 sm:px-6"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-fintech-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-base py-2 sm:py-3 px-4 sm:px-6"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
