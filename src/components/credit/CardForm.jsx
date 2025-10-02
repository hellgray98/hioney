import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCreditStore from '../../store/creditStore';
import { validateCardSettings } from '../../lib/creditMath';

const CARD_NETWORKS = [
  { value: 'Visa', label: 'Visa', icon: '💳' },
  { value: 'Mastercard', label: 'Mastercard', icon: '💳' },
  { value: 'Amex', label: 'American Express', icon: '💳' },
  { value: 'Discover', label: 'Discover', icon: '💳' },
  { value: 'JCB', label: 'JCB', icon: '💳' },
  { value: 'UnionPay', label: 'UnionPay', icon: '💳' }
];

const POPULAR_ISSUERS = [
  'Chase', 'Bank of America', 'Citi', 'Capital One', 'Wells Fargo',
  'American Express', 'Discover', 'US Bank', 'Barclays', 'Synchrony'
];

const CardForm = ({ card, onSubmit, onCancel }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { addCard, updateCard } = useCreditStore();
  
  const [formData, setFormData] = useState({
    holderName: card?.holderName || '',
    issuer: card?.issuer || '',
    network: card?.network || 'Visa',
    last4: card?.last4 || '',
    openedAt: card?.openedAt ? new Date(card.openedAt).toISOString().split('T')[0] : '',
    creditLimit: card?.creditLimit || 0,
    statementDay: card?.statementDay || 1,
    dueDay: card?.dueDay || 25,
    minPaymentPercent: card?.minPaymentPercent ? card.minPaymentPercent * 100 : 2,
    minPaymentFloor: card?.minPaymentFloor || 25,
    gracePeriodDays: card?.gracePeriodDays || 21,
    purchaseAPR: card?.purchaseAPR ? card.purchaseAPR * 100 : 19.99,
    iconUrl: card?.iconUrl || ''
  });
  
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const validationErrors = validateCardSettings({
      ...formData,
      minPaymentPercent: formData.minPaymentPercent / 100,
      purchaseAPR: formData.purchaseAPR / 100
    });
    setErrors(validationErrors);
  }, [formData]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (errors.filter(e => !e.includes('Cảnh báo')).length > 0) {
      return;
    }
    
    setLoading(true);
    
    try {
      const cardData = {
        ...formData,
        openedAt: new Date(formData.openedAt),
        minPaymentPercent: formData.minPaymentPercent / 100,
        purchaseAPR: formData.purchaseAPR / 100
      };
      
      if (card) {
        await updateCard(card.id, cardData, currentUser.uid);
      } else {
        await addCard(cardData, currentUser.uid);
      }
      
      onSubmit?.();
    } catch (error) {
      console.error('Error saving card:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg text-sm ${
                error.includes('Cảnh báo')
                  ? theme === 'dark'
                    ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                    : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                  : theme === 'dark'
                    ? 'bg-red-900/30 text-red-400 border border-red-800'
                    : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              {error}
            </div>
          ))}
        </div>
      )}
      
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Thông tin cơ bản
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên chủ thẻ
            </label>
            <input
              type="text"
              name="holderName"
              value={formData.holderName}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
              placeholder="Nguyễn Văn A"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngân hàng phát hành
            </label>
            <input
              type="text"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              required
              list="issuers"
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
              placeholder="VD: Chase, Citi, Amex..."
            />
            <datalist id="issuers">
              {POPULAR_ISSUERS.map(issuer => (
                <option key={issuer} value={issuer} />
              ))}
            </datalist>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mạng thẻ
            </label>
            <div className="relative">
              <select
                name="network"
                value={formData.network}
                onChange={handleChange}
                required
                className={`appearance-none w-full px-4 py-2.5 pr-10 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                }`}
              >
                {CARD_NETWORKS.map(network => (
                  <option key={network.value} value={network.value}>
                    {network.icon} {network.label}
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              4 số cuối
            </label>
            <input
              type="text"
              name="last4"
              value={formData.last4}
              onChange={handleChange}
              required
              maxLength={4}
              pattern="\d{4}"
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
              placeholder="1234"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày mở thẻ
            </label>
            <input
              type="date"
              name="openedAt"
              value={formData.openedAt}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hạn mức tín dụng
            </label>
            <input
              type="number"
              name="creditLimit"
              value={formData.creditLimit}
              onChange={handleChange}
              required
              min={0}
              step={1000000}
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
              placeholder="10000000"
            />
          </div>
        </div>
      </div>
      
      {/* Billing Cycle */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chu kỳ thanh toán
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày chốt sao kê (1-28)
            </label>
            <input
              type="number"
              name="statementDay"
              value={formData.statementDay}
              onChange={handleChange}
              required
              min={1}
              max={28}
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ngày đến hạn (1-28)
            </label>
            <input
              type="number"
              name="dueDay"
              value={formData.dueDay}
              onChange={handleChange}
              required
              min={1}
              max={28}
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thời gian ân hạn (ngày)
            </label>
            <input
              type="number"
              name="gracePeriodDays"
              value={formData.gracePeriodDays}
              onChange={handleChange}
              required
              min={0}
              max={60}
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              APR (%)
            </label>
            <input
              type="number"
              name="purchaseAPR"
              value={formData.purchaseAPR}
              onChange={handleChange}
              required
              min={0}
              max={100}
              step={0.01}
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
            />
          </div>
        </div>
      </div>
      
      {/* Minimum Payment */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Thanh toán tối thiểu
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tỷ lệ tối thiểu (%)
            </label>
            <input
              type="number"
              name="minPaymentPercent"
              value={formData.minPaymentPercent}
              onChange={handleChange}
              required
              min={0}
              max={100}
              step={0.1}
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Số tiền tối thiểu
            </label>
            <input
              type="number"
              name="minPaymentFloor"
              value={formData.minPaymentFloor}
              onChange={handleChange}
              required
              min={0}
              step={100000}
              className={`w-full px-4 py-2.5 rounded-xl border-2 font-medium text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
              }`}
            />
          </div>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="flex justify-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="btn-fintech-secondary w-12 h-12 p-0"
          title="Hủy"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          type="submit"
          disabled={loading || errors.filter(e => !e.includes('Cảnh báo')).length > 0}
          className="btn-fintech-primary w-12 h-12 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
          title={loading ? 'Đang lưu...' : card ? 'Cập nhật thẻ' : 'Thêm thẻ'}
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
      </div>
    </form>
  );
};

export default CardForm;
