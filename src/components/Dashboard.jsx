import React from 'react';
import { fmt } from '../utils/helpers';

const Dashboard = ({ analytics, state }) => {
  const { incomeTotal, expenseTotal, balance, currentMonth, monthTx } = analytics;

  return (
    <div className="space-y-6">
      {/* Welcome Section - Modern Style */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Chào mừng trở lại!</h1>
              <p className="text-blue-100 mt-1">Tổng quan tài chính của bạn</p>
            </div>
            <div className="text-right">
              <div className="text-blue-200 text-sm">Tháng hiện tại</div>
              <div className="text-lg font-semibold">{currentMonth}</div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>

      {/* Stats Cards - Modern Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">💰</span>
            </div>
            <div className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
              +12.5%
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">Thu nhập</div>
          <div className="text-xl font-bold text-gray-900">{fmt(incomeTotal)}</div>
        </div>
        
        {/* Expense Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">💸</span>
            </div>
            <div className="text-xs text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-full">
              -8.2%
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">Chi tiêu</div>
          <div className="text-xl font-bold text-gray-900">{fmt(expenseTotal)}</div>
        </div>
        
        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              balance >= 0 
                ? 'bg-gradient-to-br from-blue-400 to-blue-600' 
                : 'bg-gradient-to-br from-orange-400 to-orange-600'
            }`}>
              <span className="text-white text-lg">💳</span>
            </div>
            <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
              balance >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-orange-600 bg-orange-50'
            }`}>
              {balance >= 0 ? '+5.3%' : '-2.1%'}
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">Số dư</div>
          <div className={`text-xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-orange-500'}`}>
            {fmt(balance)}
          </div>
        </div>
        
        {/* Transactions Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">📝</span>
            </div>
            <div className="text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
              {monthTx.length}
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-1">Giao dịch</div>
          <div className="text-xl font-bold text-gray-900">{monthTx.length}</div>
        </div>
      </div>

      {/* Quick Actions - Modern Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Xu hướng tháng này</h3>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">📈</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm">💰</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Thu nhập/ngày</div>
                  <div className="text-xs text-gray-600">Trung bình</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600">
                  {fmt(incomeTotal / new Date().getDate())}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm">💸</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Chi tiêu/ngày</div>
                  <div className="text-xs text-gray-600">Trung bình</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-red-600">
                  {fmt(expenseTotal / new Date().getDate())}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mục tiêu tài chính</h3>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
          </div>
          <div className="space-y-4">
            {state.goals.slice(0, 2).map(goal => (
              <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 truncate">{goal.name}</span>
                  <span className="text-xs text-gray-500">
                    {Math.round((goal.saved / goal.target) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{width: `${Math.min((goal.saved / goal.target) * 100, 100)}%`}}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{fmt(goal.saved)}</span>
                  <span>{fmt(goal.target)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

