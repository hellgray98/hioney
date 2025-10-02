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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 slide-in-down">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Tổng quan</h1>
        </div>
        <div className="relative inline-block">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`select-fintech appearance-none pr-10 pl-4 py-2.5 min-w-[140px] rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer focus:ring-2 focus:ring-offset-2 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-750 focus:border-gray-600 focus:ring-gray-500'
                : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50 focus:border-gray-400 focus:ring-gray-300'
            }`}
          >
            <option value="week">📅 Tuần này</option>
            <option value="month">📊 Tháng này</option>
            <option value="year">📈 Năm này</option>
            <option value="all">🔄 Tất cả</option>
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

      {/* Balance Card - Enhanced Fintech Style */}
      <div className={`fintech-card-elevated p-8 transition-colors hover-lift scale-in ${
        theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-white to-gray-50'
      }`}>
        <div className="text-center">
          <p className="text-sm font-semibold mb-3 text-gray-600 dark:text-gray-400 uppercase tracking-wider">Số dư hiện tại</p>
          <div className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold break-all pulse-amount ${
            data.balance >= 0 ? 'text-success-500' : 'text-danger-500'
          }`}>
            {formatCurrency(data.balance)}
          </div>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${data.balance >= 0 ? 'bg-success-500' : 'bg-danger-500'} animate-pulse`}></div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {data.balance >= 0 ? 'Tích cực' : 'Cần cải thiện'}
            </span>
          </div>
        </div>
      </div>
        
      {/* Stats Cards - Simplified Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`fintech-card p-6 hover-lift stagger-item ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Thu nhập</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-success-500 break-all">
                {formatCurrency(stats.income)}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success-500 mr-2"></div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Khoản thu</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-success-100 dark:bg-success-900/20 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className={`fintech-card p-6 hover-lift stagger-item ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Chi tiêu</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-danger-500 break-all">
                {formatCurrency(stats.expense)}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-danger-500 mr-2"></div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Khoản chi</span>
              </div>
            </div>
            <div className="w-14 h-14 bg-danger-100 dark:bg-danger-900/20 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4">
              <span className="text-2xl">💸</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid - 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Categories Pie Chart */}
        <div className={`fintech-card p-6 transition-colors ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Phân tích chi tiêu</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Thống kê theo danh mục</p>
            </div>
            <div className="w-8 h-8 bg-danger-100 dark:bg-danger-900/20 rounded-lg flex items-center justify-center">
              <span className="text-sm">📈</span>
            </div>
          </div>
          
          {stats.pieChartData.length > 0 ? (
            <div className="space-y-4">
              {/* Chart Container */}
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {stats.pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color || `hsl(${index * 45}, 70%, 60%)`}
                          stroke={theme === 'dark' ? '#374151' : '#ffffff'}
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {stats.pieChartData.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-xs">{item.icon}</span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-danger-500">
                        {formatCurrency(item.value)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {stats.expense > 0 ? ((item.value / stats.expense) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total Summary */}
              <div className={`mt-4 p-3 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Tổng chi tiêu
                  </span>
                  <span className="text-sm font-bold text-danger-500">
                    {formatCurrency(stats.expense)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Chưa có dữ liệu chi tiêu
              </p>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className={`fintech-card p-6 transition-colors ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Giao dịch gần đây</h3>
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-sm">💳</span>
            </div>
          </div>
          {data.transactions.slice(0, 5).length > 0 ? (
            <div className="space-y-4">
              {data.transactions.slice(0, 5).map(transaction => {
                const category = data.categories.find(c => c.id === transaction.categoryId);
                return (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-fintech"
                        style={{ backgroundColor: category?.color || '#6b7280' }}
                      >
                        {category?.icon || '📝'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{category?.name || 'Không xác định'}</p>
                        {transaction.note && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{transaction.note}</p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(transaction.createdAt).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                    <div className={`text-right font-bold text-sm break-all ml-2 ${
                      transaction.type === 'income' ? 'text-success-500' : 'text-danger-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💳</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Chưa có giao dịch nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Credit Card Summary Widget */}
      <CreditSummaryWidget onViewDetails={() => onNavigate?.('credit')} />
    </div>
  );
};

export default Dashboard;