import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const Settings = ({ state }) => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    currency: state.settings?.currency || 'VND',
    notifications: state.settings?.notifications || true,
    autoBackup: state.settings?.autoBackup || true,
    dataRetention: state.settings?.dataRetention || '1year',
    language: 'vi',
    dateFormat: 'dd/mm/yyyy'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    // Here you would typically save to state or localStorage
    console.log('Setting changed:', key, value);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleExportData = () => {
    // Export data functionality
    console.log('Exporting data...');
  };

  const handleImportData = () => {
    // Import data functionality
    console.log('Importing data...');
  };

  const handleClearData = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!')) {
      console.log('Clearing all data...');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header - Minimalist */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Cài đặt
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Tùy chỉnh ứng dụng theo ý muốn
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
          Cài đặt chung
        </h3>
        
        <div className="space-y-6">
          {/* Theme Setting */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Giao diện</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Chọn chế độ hiển thị</div>
            </div>
            <div className="flex gap-2">
              {[
                { value: 'light', label: 'Sáng', icon: '☀️' },
                { value: 'dark', label: 'Tối', icon: '🌙' },
                { value: 'auto', label: 'Tự động', icon: '🌓' }
              ].map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => handleThemeChange(themeOption.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    theme === themeOption.value
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="mr-1">{themeOption.icon}</span>
                  {themeOption.label}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Setting */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Đơn vị tiền tệ</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Hiển thị số tiền</div>
            </div>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="VND">VND (₫)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          {/* Language Setting */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Ngôn ngữ</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Giao diện ứng dụng</div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
          Thông báo
        </h3>
        
        <div className="space-y-6">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Thông báo</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Nhận thông báo từ ứng dụng</div>
            </div>
            <button
              onClick={() => handleSettingChange('notifications', !settings.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                settings.notifications ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Auto Backup Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Sao lưu tự động</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Tự động sao lưu dữ liệu</div>
            </div>
            <button
              onClick={() => handleSettingChange('autoBackup', !settings.autoBackup)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                settings.autoBackup ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
          Quản lý dữ liệu
        </h3>
        
        <div className="space-y-4">
          {/* Export Data */}
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <span className="text-lg">📤</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">Xuất dữ liệu</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Tải xuống file sao lưu</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Import Data */}
          <button
            onClick={handleImportData}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <span className="text-lg">📥</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">Nhập dữ liệu</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Khôi phục từ file sao lưu</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Clear Data */}
          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <span className="text-lg">🗑️</span>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-gray-100">Xóa tất cả dữ liệu</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Không thể hoàn tác</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
          Thông tin ứng dụng
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Phiên bản</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">1.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Tác giả</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">Hioney Team</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Ngày phát hành</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;