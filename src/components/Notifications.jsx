import React, { useState } from 'react';
import { fmt } from '../utils/helpers';

const Notifications = ({ state }) => {
  const [filter, setFilter] = useState('all'); // all, budget, bill, goal, debt

  // Generate notifications based on current data
  const generateNotifications = () => {
    const notifications = [];

    // Budget warnings
    state.budgets.forEach(budget => {
      const spent = state.transactions
        .filter(t => t.category === budget.category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      const percentage = (spent / budget.amount) * 100;

      if (percentage > 100) {
        notifications.push({
          id: `budget-over-${budget.id}`,
          type: 'budget',
          title: 'Vượt ngân sách',
          message: `Ngân sách ${budget.category} đã vượt quá ${fmt(budget.amount)}`,
          time: new Date().toISOString(),
          priority: 'high',
          icon: '⚠️'
        });
      } else if (percentage > 80) {
        notifications.push({
          id: `budget-warning-${budget.id}`,
          type: 'budget',
          title: 'Cảnh báo ngân sách',
          message: `Ngân sách ${budget.category} đã sử dụng ${percentage.toFixed(0)}%`,
          time: new Date().toISOString(),
          priority: 'medium',
          icon: '⚠️'
        });
      }
    });

    // Bill reminders
    state.bills.forEach(bill => {
      const dueDate = new Date(bill.dueDate);
      const today = new Date();
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilDue <= 3 && daysUntilDue >= 0 && !bill.isPaid) {
        notifications.push({
          id: `bill-due-${bill.id}`,
          type: 'bill',
          title: 'Hóa đơn sắp đến hạn',
          message: `${bill.name} - ${fmt(bill.amount)} (${daysUntilDue} ngày)`,
          time: new Date().toISOString(),
          priority: 'high',
          icon: '📋'
        });
      }
    });

    // Goal milestones
    state.goals.forEach(goal => {
      const percentage = (goal.saved / goal.target) * 100;
      if (percentage >= 50 && percentage < 100) {
        notifications.push({
          id: `goal-milestone-${goal.id}`,
          type: 'goal',
          title: 'Mục tiêu tiến bộ',
          message: `${goal.name} đã đạt ${percentage.toFixed(0)}%`,
          time: new Date().toISOString(),
          priority: 'low',
          icon: '🎯'
        });
      }
    });

    // Debt reminders
    state.debts.forEach(debt => {
      if (debt.dueDate) {
        const dueDate = new Date(debt.dueDate);
        const today = new Date();
        const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (daysUntilDue <= 7 && daysUntilDue >= 0) {
          notifications.push({
            id: `debt-due-${debt.id}`,
            type: 'debt',
            title: 'Thanh toán nợ',
            message: `${debt.name} - ${fmt(debt.amount)} (${daysUntilDue} ngày)`,
            time: new Date().toISOString(),
            priority: 'high',
            icon: '💳'
          });
        }
      }
    });

    return notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  const notifications = generateNotifications();
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'budget': return '🧾';
      case 'bill': return '📋';
      case 'goal': return '🎯';
      case 'debt': return '💳';
      default: return '🔔';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
        <p className="text-gray-600 mt-1">Nhắc nhở và cảnh báo tài chính</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'Tất cả', count: notifications.length },
          { id: 'budget', label: 'Ngân sách', count: notifications.filter(n => n.type === 'budget').length },
          { id: 'bill', label: 'Hóa đơn', count: notifications.filter(n => n.type === 'bill').length },
          { id: 'goal', label: 'Mục tiêu', count: notifications.filter(n => n.type === 'goal').length },
          { id: 'debt', label: 'Nợ', count: notifications.filter(n => n.type === 'debt').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                filter === tab.id ? 'bg-blue-500' : 'bg-gray-300'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🔔</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'Không có thông báo' : `Không có thông báo ${filter}`}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Tất cả đều ổn! Không có cảnh báo nào.' 
                : `Không có thông báo nào cho ${filter}`
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all ${
                notification.priority === 'high' ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                  notification.priority === 'high' ? 'bg-red-100' :
                  notification.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {notification.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      getPriorityColor(notification.priority)
                    }`}>
                      {notification.priority === 'high' ? 'Cao' :
                       notification.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(notification.time).toLocaleString('vi-VN')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {getTypeIcon(notification.type)} {notification.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
