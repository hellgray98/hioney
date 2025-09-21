import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { fmt, getSavingsRateColor } from '../utils/helpers';

const Analytics = ({ spendingTrends, categoryAnalysis, state, monthExpenseByCat }) => {
  return (
    <div className="space-y-8">
      {/* Header - Minimalist */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Phân tích nâng cao
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Thống kê chi tiết và xu hướng tài chính
        </p>
      </div>
      
      {/* Spending Trends - Minimalist */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-6">
          <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">Xu hướng chi tiêu 6 tháng</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Biến động thu chi và tiết kiệm</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                formatter={(value) => fmt(value)} 
                contentStyle={{ 
                  fontSize: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="income" fill="#10b981" name="Thu nhập" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Chi tiêu" radius={[4, 4, 0, 0]} />
              <Bar dataKey="savings" fill="#3b82f6" name="Tiết kiệm" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Analysis - Minimalist */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-6">
          <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">So sánh chi tiêu theo danh mục</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Phân tích chi tiết theo từng danh mục</p>
        </div>
        <div className="space-y-6">
          {categoryAnalysis.map(category => (
            <div key={category.category} className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 text-center">{category.categoryLabel}</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {Object.entries(category.months).map(([month, amount]) => (
                  <div key={month} className="text-center">
                    <div className="text-gray-500 dark:text-gray-400 mb-1">{month}</div>
                    <div className="font-medium text-red-600 dark:text-red-400">{fmt(amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Rate & Statistics - Minimalist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-6">
            <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">Tỷ lệ tiết kiệm</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">3 tháng gần nhất</p>
          </div>
          <div className="space-y-4">
            {spendingTrends.slice(-3).map(trend => (
              <div key={trend.month} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                <span className="text-sm text-gray-600 dark:text-gray-400">{trend.month}</span>
                <div className="text-right">
                  <div className={`font-medium ${getSavingsRateColor(trend.savingsRate)}`}>
                    {trend.savingsRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{fmt(trend.savings)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-6">
            <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">Thống kê tổng quan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tổng hợp dữ liệu</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <span className="text-gray-600 dark:text-gray-400">Tổng giao dịch:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{state.transactions.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <span className="text-gray-600 dark:text-gray-400">Danh mục chi tiêu:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{Object.keys(monthExpenseByCat).length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <span className="text-gray-600 dark:text-gray-400">Ngân sách đang theo dõi:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{state.budgets.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <span className="text-gray-600 dark:text-gray-400">Mục tiêu tài chính:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{state.goals.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

