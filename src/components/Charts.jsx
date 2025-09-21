import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { fmt } from '../utils/helpers';
import { CHART_COLORS } from '../constants';

const Charts = ({ pieData, lineData }) => {
  return (
    <div className="space-y-8">
      {/* Header - Minimalist */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Thống kê & Phân tích
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Biểu đồ và thống kê chi tiết về tài chính
        </p>
      </div>
      
      {/* Charts Container with Horizontal Scroll */}
      <div className="space-y-6">
        {/* Pie Chart - Minimalist */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-6">
            <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">Chi tiêu theo danh mục</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phân bổ chi tiêu tháng này</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  dataKey="value" 
                  nameKey="name" 
                  outerRadius={100} 
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => fmt(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Minimalist */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center mb-6">
            <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-2">Xu hướng thu chi</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Biến động theo tháng</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={12}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(value) => fmt(value)} 
                  contentStyle={{ 
                    fontSize: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  name="Thu nhập" 
                  dot={{ r: 4, fill: '#10b981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  name="Chi tiêu" 
                  dot={{ r: 4, fill: '#ef4444' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;

