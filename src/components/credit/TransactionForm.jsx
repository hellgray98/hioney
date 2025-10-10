import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCreditStore from '../../store/creditStore';
import { formatCurrencyInput, parseCurrencyInput, handleCurrencyInputChange, handleCurrencyKeyDown } from '../../utils/formatCurrency';

const TransactionForm = ({ onClose, onSubmit }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { cards, addTransaction } = useCreditStore();
  const activeCards = cards.filter(card => !card.archived);

  const [formData, setFormData] = useState({
    cardId: activeCards[0]?.id || '',
    amount: '',
    description: '',
    category: '',
    transactionDate: new Date().toISOString().split('T')[0],
    postDate: new Date().toISOString().split('T')[0],
    isPending: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.cardId || !formData.amount || !formData.description) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await addTransaction({
        ...formData,
        amount: parseCurrencyInput(formData.amount),
        transactionDate: new Date(formData.transactionDate),
        postDate: new Date(formData.postDate)
      }, currentUser.uid);
      
      onSubmit?.();
      onClose?.(); // Close modal after successful submission
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Chọn thẻ
          </label>
          <div className="relative">
            <select
              name="cardId"
              value={formData.cardId}
              onChange={(e) => setFormData({...formData, cardId: e.target.value})}
              required
              className={`appearance-none w-full px-4 py-2.5 pr-10 rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
            >
              {activeCards.map(card => (
                <option key={card.id} value={card.id}>
                  {card.issuer} •••• {card.last4}
                </option>
              ))}
            </select>
            <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Số tiền
          </label>
          <input
            type="text"
            value={formData.amount}
                  onChange={(e) => handleCurrencyInputChange(e, (value) => setFormData({...formData, amount: value}))}
                  onKeyDown={handleCurrencyKeyDown}
            required
            className={`w-full px-4 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
            }`}
            placeholder="1.000.000"
          />
        </div>
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Mô tả
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
          className={`w-full px-4 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
          }`}
          placeholder="VD: Mua sắm tại ABC Store"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Danh mục chi tiêu
          </label>
          <div className="relative">
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className={`select-fintech appearance-none pr-10 pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 ${
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
            <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <svg className="w-5 h-5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Transaction Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Ngày giao dịch
          </label>
          <input
            type="date"
            value={formData.transactionDate}
            onChange={(e) => setFormData({...formData, transactionDate: e.target.value})}
            required
            className={`w-full px-4 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
            }`}
          />
        </div>
      </div>
      
      {/* Pending Status */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPending"
          checked={formData.isPending}
          onChange={(e) => setFormData({...formData, isPending: e.target.checked})}
          className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="isPending" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Giao dịch đang chờ xử lý
        </label>
      </div>
      
      {/* Buttons */}
      <div className="flex justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={loading}
          className="btn-fintech-primary w-12 h-12 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
          title={loading ? 'Đang lưu...' : 'Thêm giao dịch'}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="btn-fintech-secondary w-12 h-12 p-0"
          title="Hủy"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
