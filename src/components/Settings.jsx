import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

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
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Cài đặt</h1>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          messageType === 'error' 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Theme Settings */}
      <div className={`rounded-2xl p-6 transition-colors ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className="text-lg font-semibold mb-4">Giao diện</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Chế độ tối</p>
            <p className="text-sm text-gray-500">Chuyển đổi giữa chế độ sáng và tối</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className={`rounded-2xl p-6 transition-colors ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className="text-lg font-semibold mb-4">Quản lý dữ liệu</h3>
        
        <div className="space-y-4">
          {/* Export */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg">📤</span>
              </div>
              <div>
                <p className="font-medium">Xuất dữ liệu</p>
                <p className="text-sm text-gray-500">Tải xuống file sao lưu JSON</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Xuất
            </button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg">📥</span>
              </div>
              <div>
                <p className="font-medium">Nhập dữ liệu</p>
                <p className="text-sm text-gray-500">Khôi phục từ file sao lưu</p>
              </div>
            </div>
            <button
              onClick={handleFileSelect}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Nhập
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
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-lg">🗑️</span>
              </div>
              <div>
                <p className="font-medium text-red-700">Xóa tất cả dữ liệu</p>
                <p className="text-sm text-red-500">Không thể hoàn tác</p>
              </div>
            </div>
            <button
              onClick={handleClearData}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className={`rounded-2xl p-6 transition-colors ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <h3 className="text-lg font-semibold mb-4">Thông tin ứng dụng</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Phiên bản</span>
            <span className="font-medium">2.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tác giả</span>
            <span className="font-medium">Hioney Team</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số giao dịch</span>
            <span className="font-medium">{data.transactions.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số danh mục</span>
            <span className="font-medium">{data.categories.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Số ngân sách</span>
            <span className="font-medium">{data.budgets.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;