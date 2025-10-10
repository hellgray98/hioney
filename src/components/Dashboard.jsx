import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/FirebaseDataContext';
import { formatCurrencyDisplay } from '../utils/formatCurrency';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import CreditSummaryWidget from './credit/CreditSummaryWidget';

const Dashboard = ({ onNavigate }) => {
  const { theme } = useTheme();
  const { data } = useData();
  const [timeRange, setTimeRange] = useState('month');

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(0);
    }

    const filteredTransactions = data.transactions.filter(t => 
      new Date(t.createdAt) >= startDate
    );

    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Prepare pie chart data for expenses only
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const expenseCategoryStats = {};
    expenseTransactions.forEach(t => {
      const category = data.categories.find(c => c.id === t.categoryId);
      if (category) {
        if (!expenseCategoryStats[category.id]) {
          expenseCategoryStats[category.id] = {
            name: category.name,
            value: 0,
            color: category.color,
            icon: category.icon
          };
        }
        expenseCategoryStats[category.id].value += t.amount;
      }
    });

    const pieChartData = Object.values(expenseCategoryStats)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories for better readability

    return { income, expense, pieChartData };
  }, [data.transactions, data.categories, timeRange]);

  const formatCurrency = formatCurrencyDisplay;

  // Custom Tooltip for Pie Chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className={`fintech-card p-3 shadow-fintech-lg border-0 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            ></div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {data.payload.name}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-danger-500 font-bold">
              {formatCurrency(data.value)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({((data.value / stats.expense) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Legend
  const CustomLegend = ({ payload }) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
              {entry.payload.icon} {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header - Minimal */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Tổng quan</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {timeRange === 'week' ? 'Tuần này' : timeRange === 'month' ? 'Tháng này' : timeRange === 'year' ? 'Năm này' : 'Tất cả'}
            </p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`appearance-none pl-3 pr-9 py-2 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-gray-900 text-white border border-gray-800'
                : 'bg-white text-gray-900 border border-gray-200'
            }`}
          >
            <option value="week">Tuần</option>
            <option value="month">Tháng</option>
            <option value="year">Năm</option>
            <option value="all">Tất cả</option>
          </select>
        </div>

        {/* Balance Card - Hero Section */}
        <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 border border-gray-800' 
            : 'bg-gradient-to-br from-white via-white to-gray-50 border border-gray-100'
        }`}>
          <div className="relative z-10">
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tổng số dư</p>
            <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 break-words ${
              data.balance >= 0 ? 'text-gray-900 dark:text-white' : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(data.balance)}
            </div>
            
            {/* Income/Expense Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
                theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'
              }`}>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">Thu nhập</span>
                </div>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-green-600 dark:text-green-400 break-words">
                  {formatCurrency(stats.income)}
                </p>
              </div>
              
              <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
                theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'
              }`}>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">Chi tiêu</span>
                </div>
                <p className="text-base sm:text-lg lg:text-xl font-bold text-red-600 dark:text-red-400 break-words">
                  {formatCurrency(stats.expense)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 ${
            data.balance >= 0 ? 'bg-green-500' : 'bg-red-500'
          }`} style={{ transform: 'translate(50%, -50%)' }} />
        </div>

        {/* Content Grid - 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Expense Categories */}
          <div className={`rounded-2xl sm:rounded-3xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
          }`}>
            <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">Chi tiêu</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">Phân tích theo danh mục</p>
                </div>
              </div>
            </div>
          
            <div className="p-4 sm:p-5 lg:p-6">
              {stats.pieChartData.length > 0 ? (
                <>
                  {/* Pie Chart */}
                  <div className="h-56 sm:h-64 mb-5">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius="55%"
                          outerRadius="85%"
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {stats.pieChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color || `hsl(${index * 45}, 70%, 60%)`}
                              stroke={theme === 'dark' ? '#000000' : '#ffffff'}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Categories List */}
                  <div 
                    className={`space-y-2 ${
                      stats.pieChartData.length > 4
                        ? 'max-h-[320px] sm:max-h-[420px] overflow-y-auto bg-gray-50/50 dark:bg-black/50 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent'
                        : ''
                    }`}
                  >
                    {stats.pieChartData.map((item, index) => (
                      <div 
                        key={index} 
                        className={`group rounded-xl sm:rounded-2xl p-3 transition-all duration-200 active:scale-[0.98] ${
                          theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-800/80'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {/* Top row: Icon + Name + Amount */}
                        <div className="flex items-center gap-2.5 mb-2">
                          <div 
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          >
                            <span className="text-xl sm:text-2xl">{item.icon}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                              {item.name}
                            </p>
                          </div>
                          
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                              {formatCurrency(item.value)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Bottom row: Progress bar + Percentage */}
                        <div className="flex items-center gap-2 ml-[42px] sm:ml-[48px]">
                          <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${stats.expense > 0 ? (item.value / stats.expense) * 100 : 0}%`,
                                backgroundColor: item.color
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-11 text-right flex-shrink-0">
                            {stats.expense > 0 ? ((item.value / stats.expense) * 100).toFixed(0) : 0}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl sm:text-2xl">📊</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chưa có dữ liệu
                  </p>
                </div>
              )}
              
              {/* Total */}
              {stats.expense > 0 && (
                <div className={`mt-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                  theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Tổng chi tiêu
                    </span>
                    <span className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 break-words">
                      {formatCurrency(stats.expense)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className={`rounded-2xl sm:rounded-3xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
          }`}>
            <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">Hoạt động</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {data.transactions.length} giao dịch
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 lg:p-6">
            {(() => {
              // Sort transactions by date (newest first)
              const sortedTransactions = [...data.transactions].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
              );
              
              if (sortedTransactions.length === 0) {
                return (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">💳</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chưa có giao dịch
                    </p>
                  </div>
                );
              }
              
              return (
                <div 
                  className={`space-y-1.5 sm:space-y-2 ${
                    sortedTransactions.length > 5 
                      ? 'max-h-[400px] sm:max-h-[755px] overflow-y-auto bg-gray-50/50 dark:bg-black/50 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent' 
                      : ''
                  }`}
                >
                  {sortedTransactions.map((transaction) => {
                    const category = data.categories.find(c => c.id === transaction.categoryId);
                    const isIncome = transaction.type === 'income';
                    
                    return (
                      <div 
                        key={transaction.id} 
                        className={`group rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 active:scale-[0.98] ${
                          theme === 'dark'
                            ? 'bg-gray-800 hover:bg-gray-800/80'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <div 
                            className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0"
                            style={{ backgroundColor: category?.color || '#6b7280' }}
                          >
                            <span className="text-xl sm:text-2xl">{category?.icon || '📝'}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                              {category?.name || 'Không xác định'}
                            </p>
                            {transaction.note && (
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{transaction.note}</p>
                            )}
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                              {new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0 min-w-[70px] sm:min-w-[85px]">
                            <p className={`text-base sm:text-lg font-bold break-words ${
                              isIncome ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                            }`}>
                              {isIncome ? '+' : ''}{formatCurrency(transaction.amount)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
        </div>

        {/* Credit Card Summary Widget */}
        <CreditSummaryWidget onViewDetails={() => onNavigate?.('credit')} />
      </div>
    </div>
  );
};

export default Dashboard;