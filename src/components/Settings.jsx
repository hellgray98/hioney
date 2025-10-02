import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/FirebaseDataContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { data, exportData, importData, clearAllData } = useData();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const fileInputRef = useRef(null);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleExport = () => {
    try {
      exportData();
      showMessage('Đã xuất dữ liệu thành công!');
    } catch (error) {
      showMessage('Lỗi khi xuất dữ liệu', 'error');
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        importData(importedData);
        showMessage('Đã nhập dữ liệu thành công!');
      } catch (error) {
        showMessage('File không hợp lệ', 'error');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleClearData = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!')) {
      clearAllData();
      showMessage('Đã xóa tất cả dữ liệu', 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 fade-in">
      {/* Header */}
      <div className="slide-in-down">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Cài đặt</h1>
      </div>

      {/* Message */}
      {message && (
        <div className={`fintech-card p-4 scale-in ${
          messageType === 'error' 
            ? 'bg-danger-50 border-danger-200 dark:bg-danger-900/20 dark:border-danger-800' 
            : 'bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              messageType === 'error' ? 'bg-danger-500' : 'bg-success-500'
            }`}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {messageType === 'error' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                )}
              </svg>
            </div>
            <span className={`font-medium ${
              messageType === 'error' 
                ? 'text-danger-700 dark:text-danger-400' 
                : 'text-success-700 dark:text-success-400'
            }`}>
              {message}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theme Settings */}
        <div className={`fintech-card p-6 transition-colors hover-lift slide-in-up ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3 text-2xl">🎨</span>
                Giao diện
              </h3>
            </div>
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-sm">{theme === 'dark' ? '🌙' : '☀️'}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Chế độ {theme === 'dark' ? 'tối' : 'sáng'}</p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                  theme === 'dark' ? 'bg-success-500' : 'bg-gray-300'
                } hover:scale-105`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-fintech ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className={`fintech-card p-6 transition-colors hover-lift slide-in-up ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="mr-3 text-2xl">💾</span>
                Quản lý dữ liệu
              </h3>
            </div>
            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <span className="text-sm">📊</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Export */}
            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-fintech ${
              theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-success-100 dark:bg-success-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">Xuất dữ liệu</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tải file JSON chứa toàn bộ dữ liệu</p>
                </div>
              </div>
              <button
                onClick={handleExport}
                className="btn-fintech-success w-10 h-10 p-0 flex-shrink-0 ml-4"
                title="Xuất dữ liệu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>

            {/* Import */}
            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-fintech ${
              theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white">Nhập dữ liệu</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Khôi phục từ file sao lưu JSON</p>
                </div>
              </div>
              <button
                onClick={handleFileSelect}
                className="btn-fintech-primary w-10 h-10 p-0 flex-shrink-0 ml-4"
                title="Nhập dữ liệu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>

            {/* Clear Data */}
            <div className={`flex items-center justify-between p-4 rounded-xl border border-danger-200 dark:border-danger-800 transition-all duration-200 hover:shadow-fintech`}>
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-danger-100 dark:bg-danger-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-danger-600 dark:text-danger-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-danger-700 dark:text-danger-400">Xóa tất cả dữ liệu</p>
                  <p className="text-sm text-danger-600 dark:text-danger-500 mt-1">⚠️ Hành động không thể hoàn tác</p>
                </div>
              </div>
              <button
                onClick={handleClearData}
                className="btn-fintech-danger w-10 h-10 p-0 flex-shrink-0 ml-4"
                title="Xóa tất cả dữ liệu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className={`fintech-card p-6 transition-colors hover-lift slide-in-up ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <span className="mr-3 text-2xl">ℹ️</span>
              Thông tin ứng dụng
            </h3>
          </div>
          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-sm">📱</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="text-center p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">🏷️</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phiên bản</p>
            <p className="font-bold text-gray-900 dark:text-white">2.0.0</p>
          </div>
          
          <div className="text-center p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">👥</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tác giả</p>
            <p className="font-bold text-gray-900 dark:text-white">Hioney</p>
          </div>
          
          <div className="text-center p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Giao dịch</p>
            <p className="font-bold text-success-500">{data.transactions.length}</p>
          </div>
          
          <div className="text-center p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">📂</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Danh mục</p>
            <p className="font-bold text-primary-500">{data.categories.length}</p>
          </div>
          
          <div className="text-center p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ngân sách</p>
            <p className="font-bold text-warning-500">{data.budgets.length}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 flex items-center justify-center shadow-fintech">
                <span className="text-white dark:text-gray-900 font-extrabold text-sm">H</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Hioney - Personal Finance</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ứng dụng quản lý tài chính cá nhân thông minh</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Made with ❤️</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fintech Design</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;