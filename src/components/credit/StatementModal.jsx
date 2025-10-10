import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useCreditStore from '../../store/creditStore';
import { formatCurrencyDisplay } from '../../utils/formatCurrency';

const StatementModal = ({ onClose }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const { cards, statements, generateStatement } = useCreditStore();
  const activeCards = cards.filter(card => !card.archived);

  const [selectedCard, setSelectedCard] = useState(activeCards[0]?.id || '');
  const [statementDate, setStatementDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!selectedCard) return;

    setLoading(true);
    try {
      await generateStatement(selectedCard, new Date(statementDate));
      setGenerated(true);
    } catch (error) {
      console.error('Error generating statement:', error);
    } finally {
      setLoading(false);
    }
  };

  const cardStatements = statements.filter(stmt => stmt.cardId === selectedCard);
  const latestStatement = cardStatements[0];

  const formatCurrency = formatCurrencyDisplay;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Sao kê thẻ tín dụng
          </h3>
          <button
            onClick={onClose}
            className="btn-fintech-ghost w-10 h-10 p-0"
            title="Đóng"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Generate Statement Form */}
          <div className={`rounded-2xl p-5 sm:p-6 ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
          }`}>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Tạo sao kê mới
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Chọn thẻ
                </label>
                <div className="relative">
                  <select
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    className={`select-fintech appearance-none pr-10 pl-4 py-2.5 w-full rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 ${
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Ngày chốt sao kê
                </label>
                <input
                  type="date"
                  value={statementDate}
                  onChange={(e) => setStatementDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
                  }`}
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleGenerate}
                disabled={loading || !selectedCard}
                className="btn-fintech-primary w-12 h-12 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Tạo sao kê"
              >
                {loading ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Latest Statement */}
          {latestStatement && (
            <div className={`rounded-2xl p-5 sm:p-6 ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
            }`}>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Sao kê gần nhất
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Kỳ thanh toán</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(latestStatement.statementDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Dư nợ</p>
                  <p className="font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(latestStatement.statementBalance)}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Thanh toán tối thiểu</p>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    {formatCurrency(latestStatement.minimumPaymentDue)}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Đến hạn</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(latestStatement.dueDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Statement Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Dư nợ kỳ trước</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(latestStatement.previousBalance)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">Giao dịch mới</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(latestStatement.newCharges)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">Thanh toán</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(latestStatement.payments)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 dark:text-gray-400">Lãi suất</p>
                  <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                    {formatCurrency(latestStatement.interest)}
                  </p>
                </div>
              </div>

              {generated && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      Sao kê đã được tạo thành công!
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent Statements */}
          {cardStatements.length > 1 && (
            <div className={`rounded-2xl p-5 sm:p-6 ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
            }`}>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Sao kê gần đây
              </h4>

              <div className="space-y-3">
                {cardStatements.slice(1, 6).map(statement => (
                  <div key={statement.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(statement.statementDate).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Dư nợ: {formatCurrency(statement.statementBalance)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Đến hạn: {new Date(statement.dueDate).toLocaleDateString('vi-VN')}
                      </p>
                      <p className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        TT tối thiểu: {formatCurrency(statement.minimumPaymentDue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatementModal;
