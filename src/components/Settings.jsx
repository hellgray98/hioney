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
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearData = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!')) {
      clearAllData();
      showMessage('Đã xóa tất cả dữ liệu', 'success');
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Cài đặt</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quản lý ứng dụng</p>
        </div>

        {message && (
          <div className={`rounded-2xl p-4 ${
            messageType === 'error' 
              ? theme === 'dark' ? 'bg-red-500/10 border border-red-800' : 'bg-red-50 border border-red-200'
              : theme === 'dark' ? 'bg-green-500/10 border border-green-800' : 'bg-green-50 border border-green-200'
          }`}>
            <p className={`font-medium text-sm ${
              messageType === 'error' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
            }`}>
              {message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme */}
          <div className={`rounded-2xl sm:rounded-3xl ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
          }`}>
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Giao diện</h3>
            </div>
            <div className="p-5 sm:p-6">
              <div className={`flex items-center justify-between p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Chế độ {theme === 'dark' ? 'tối' : 'sáng'}
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative h-8 w-14 rounded-full transition-all duration-200 ${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className={`rounded-2xl sm:rounded-3xl ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
          }`}>
            <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quản lý dữ liệu</h3>
            </div>
            <div className="p-5 sm:p-6 space-y-3">
              <button
                onClick={handleExport}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-800/80' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Xuất dữ liệu</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tải file JSON</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-800/80' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">Nhập dữ liệu</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Khôi phục từ file</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

              <button
                onClick={handleClearData}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                  theme === 'dark' ? 'bg-red-500/10 hover:bg-red-500/20' : 'bg-red-50 hover:bg-red-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-red-600 dark:text-red-400">Xóa tất cả dữ liệu</p>
                    <p className="text-sm text-red-600/70 dark:text-red-400/70">Không thể hoàn tác</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className={`rounded-2xl sm:rounded-3xl ${
          theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
        }`}>
          <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Thông tin</h3>
          </div>
          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className={`text-center p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="text-xl mb-1">🏷️</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ver</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">2.0</p>
              </div>
              <div className={`text-center p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="text-xl mb-1">💰</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Giao dịch</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{data.transactions.length}</p>
              </div>
              <div className={`text-center p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="text-xl mb-1">📂</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Danh mục</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{data.categories.length}</p>
              </div>
              <div className={`text-center p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="text-xl mb-1">🎯</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Ngân sách</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{data.budgets.length}</p>
              </div>
              <div className={`text-center p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="text-xl mb-1">💳</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Thẻ</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
