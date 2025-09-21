import React, { useState } from 'react';
import { fmt } from '../utils/helpers';

const Notifications = ({ state, markNotificationAsRead, deleteNotification, markAllAsRead }) => {
  const [filter, setFilter] = useState('all'); // all, unread, read

  // Filter notifications
  const filteredNotifications = state.notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  // Count unread notifications
  const unreadCount = state.notifications.filter(n => !n.read).length;

  // Mark notification as read
  const handleMarkAsRead = (id) => {
    if (markNotificationAsRead) {
      markNotificationAsRead(id);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    if (markAllAsRead) {
      markAllAsRead();
    }
  };

  // Delete notification
  const handleDeleteNotification = (id) => {
    if (deleteNotification) {
      deleteNotification(id);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'bill_reminder': return '📋';
      case 'payment_alert': return '⚠️';
      case 'budget_warning': return '💰';
      case 'goal_milestone': return '🎯';
      case 'spending_alert': return '💸';
      default: return '🔔';
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'bill_reminder': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'payment_alert': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      case 'budget_warning': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'goal_milestone': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'spending_alert': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header - Minimalist */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Thông báo
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Quản lý thông báo và cảnh báo
        </p>
      </div>

      {/* Filter Buttons and Mark All Read */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'unread', label: 'Chưa đọc' },
            { id: 'read', label: 'Đã đọc' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
                filter === filterOption.id
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
        
        {/* Mark All as Read Button */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-medium transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Đánh dấu đã đọc hết ({unreadCount})
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12 7H4.828z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {filter === 'all' ? 'Chưa có thông báo' : 
               filter === 'unread' ? 'Không có thông báo chưa đọc' : 
               'Không có thông báo đã đọc'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filter === 'all' ? 'Bạn sẽ nhận được thông báo khi có sự kiện quan trọng' :
               filter === 'unread' ? 'Tất cả thông báo đã được đọc' :
               'Chưa có thông báo nào được đọc'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 transition-all duration-200 ${
                !notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Notification Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{new Date(notification.createdAt).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        <span>{new Date(notification.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        {!notification.read && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">Chưa đọc</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                          title="Đánh dấu đã đọc"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        title="Xóa thông báo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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