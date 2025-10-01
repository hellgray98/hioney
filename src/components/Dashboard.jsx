import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { formatCurrencyDisplay } from '../utils/formatCurrency';

const Dashboard = () => {
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

    const net = income - expense;

    // Category breakdown
    const categoryStats = {};
    filteredTransactions.forEach(t => {
      const category = data.categories.find(c => c.id === t.categoryId);
      if (category) {
        if (!categoryStats[category.id]) {
          categoryStats[category.id] = {
            name: category.name,
            icon: category.icon,
            color: category.color,
            amount: 0
          };
        }
        categoryStats[category.id].amount += t.amount;
      }
    });

    const topCategories = Object.values(categoryStats)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return { income, expense, net, topCategories };
  }, [data.transactions, data.categories, timeRange]);

  const formatCurrency = formatCurrencyDisplay;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 slide-in-down">
        <h1 className="text-xl font-bold">Tổng quan</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`px-3 py-2 rounded-lg border text-sm transition-colors btn-animate ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm này</option>
          <option value="all">Tất cả</option>
        </select>
      </div>

      {/* Balance Card */}
      <div className={`rounded-2xl p-4 transition-colors hover-lift scale-in ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center">
          <h2 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Số dư hiện tại</h2>
          <div className={`text-2xl sm:text-3xl md:text-4xl font-bold break-all pulse-amount ${
            data.balance >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {formatCurrency(data.balance)}
          </div>
        </div>
      </div>
        
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className={`rounded-xl p-4 transition-colors hover-lift stagger-item ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">Thu nhập</p>
              <p className="text-lg sm:text-xl font-bold text-green-500 break-all">
                {formatCurrency(stats.income)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <span className="text-lg">💰</span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 transition-colors hover-lift stagger-item ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">Chi tiêu</p>
              <p className="text-lg sm:text-xl font-bold text-red-500 break-all">
                {formatCurrency(stats.expense)}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
              <span className="text-lg">💸</span>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 transition-colors hover-lift stagger-item sm:col-span-2 lg:col-span-1 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">Lãi/Lỗ</p>
              <p className={`text-lg sm:text-xl font-bold break-all ${
                stats.net >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatCurrency(stats.net)}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-2 ${
              stats.net >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
            }`}>
              <span className="text-lg">{stats.net >= 0 ? '📈' : '📉'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className={`rounded-xl p-4 transition-colors ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className="text-sm font-semibold mb-3">Danh mục chi tiêu nhiều nhất</h3>
        {stats.topCategories.length > 0 ? (
          <div className="space-y-2">
            {stats.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <span className="font-medium text-sm truncate">{category.name}</span>
                </div>
                <span className="font-bold text-sm break-all ml-2">{formatCurrency(category.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4 text-sm">Chưa có dữ liệu</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className={`rounded-xl p-4 transition-colors ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className="text-sm font-semibold mb-3">Giao dịch gần đây</h3>
        {data.transactions.slice(0, 5).length > 0 ? (
          <div className="space-y-2">
            {data.transactions.slice(0, 5).map(transaction => {
              const category = data.categories.find(c => c.id === transaction.categoryId);
              return (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: category?.color || '#gray' }}
                    >
                      {category?.icon || '📝'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{category?.name || 'Không xác định'}</p>
                      {transaction.note && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{transaction.note}</p>
                      )}
                    </div>
                  </div>
                  <div className={`font-bold text-sm break-all ml-2 ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4 text-sm">Chưa có giao dịch nào</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;