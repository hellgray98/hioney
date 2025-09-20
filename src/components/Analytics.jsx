import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { fmt, getSavingsRateColor } from '../utils/helpers';

const Analytics = ({ spendingTrends, categoryAnalysis, state, monthExpenseByCat }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Phân tích nâng cao</h1>
        <p className="text-gray-600 mt-1">Thống kê chi tiết và xu hướng tài chính</p>
      </div>
      
      {/* Spending Trends */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">📊</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Xu hướng chi tiêu 6 tháng</h3>
            <p className="text-sm text-gray-500">Biến động thu chi và tiết kiệm</p>
          </div>
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

      {/* Category Analysis */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span>📈</span> So sánh chi tiêu theo danh mục
        </h3>
        <div className="space-y-4">
          {categoryAnalysis.map(category => (
            <div key={category.category} className="border-b border-gray-100 pb-4 last:border-b-0">
              <h4 className="font-medium text-gray-900 mb-2">{category.categoryLabel}</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {Object.entries(category.months).map(([month, amount]) => (
                  <div key={month} className="text-center">
                    <div className="text-gray-500">{month}</div>
                    <div className="font-semibold text-red-600">{fmt(amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Savings Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>💰</span> Tỷ lệ tiết kiệm
          </h3>
          <div className="space-y-3">
            {spendingTrends.slice(-3).map(trend => (
              <div key={trend.month} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{trend.month}</span>
                <div className="text-right">
                  <div className={`font-semibold ${getSavingsRateColor(trend.savingsRate)}`}>
                    {trend.savingsRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">{fmt(trend.savings)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📊</span> Thống kê tổng quan
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng giao dịch:</span>
              <span className="font-semibold">{state.transactions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Danh mục chi tiêu:</span>
              <span className="font-semibold">{Object.keys(monthExpenseByCat).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngân sách đang theo dõi:</span>
              <span className="font-semibold">{state.budgets.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mục tiêu tài chính:</span>
              <span className="font-semibold">{state.goals.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

