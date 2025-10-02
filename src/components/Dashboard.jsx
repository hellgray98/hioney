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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 slide-in-down">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Tổng quan</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">Quản lý tài chính thông minh</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`select-fintech w-auto min-w-[140px] ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="year">Năm này</option>
          <option value="all">Tất cả</option>
        </select>
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
        
      {/* Stats Cards - Enhanced Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <div className={`fintech-card p-6 hover-lift stagger-item md:col-span-2 lg:col-span-1 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Lãi/Lỗ</p>
              <p className={`text-2xl sm:text-3xl font-extrabold break-all ${
                stats.net >= 0 ? 'text-success-500' : 'text-danger-500'
              }`}>
                {formatCurrency(stats.net)}
              </p>
              <div className="flex items-center mt-2">
                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${stats.net >= 0 ? 'bg-success-500' : 'bg-danger-500'}`}></div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {stats.net >= 0 ? 'Tích lũy' : 'Thâm hụt'}
                </span>
              </div>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4 ${
              stats.net >= 0 ? 'bg-success-100 dark:bg-success-900/20' : 'bg-danger-100 dark:bg-danger-900/20'
            }`}>
              <span className="text-2xl">{stats.net >= 0 ? '📈' : '📉'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Categories */}
        <div className={`fintech-card p-6 transition-colors ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Danh mục hàng đầu</h3>
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-sm">📊</span>
            </div>
          </div>
          {stats.topCategories.length > 0 ? (
            <div className="space-y-4">
              {stats.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-fintech"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{category.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Danh mục chi tiêu</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-gray-900 dark:text-white break-all ml-2">{formatCurrency(category.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Chưa có dữ liệu</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Thêm giao dịch để xem thống kê</p>
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
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Bắt đầu thêm giao dịch đầu tiên!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;