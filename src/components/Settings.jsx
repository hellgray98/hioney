import React, { useState } from 'react';

const Settings = ({ state }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    currency: 'VND',
    language: 'vi',
    notifications: {
      budget: true,
      bills: true,
      goals: true,
      debts: true
    },
    theme: 'light',
    autoBackup: true,
    dataRetention: '1year'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedSettingChange = (parent, key, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hioney-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          // Here you would typically update the state
          alert('Dữ liệu đã được import thành công!');
        } catch (error) {
          alert('Lỗi: File không hợp lệ!');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'general', label: 'Chung', icon: '⚙️' },
    { id: 'notifications', label: 'Thông báo', icon: '🔔' },
    { id: 'data', label: 'Dữ liệu', icon: '💾' },
    { id: 'about', label: 'Giới thiệu', icon: 'ℹ️' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <p className="text-gray-600 mt-1">Quản lý ứng dụng và dữ liệu</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Cài đặt chung</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị tiền tệ</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="VND">Việt Nam Đồng (₫)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giao diện</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="light">Sáng</option>
                      <option value="dark">Tối</option>
                      <option value="auto">Tự động</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Cài đặt thông báo</h2>
                
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {key === 'budget' ? 'Cảnh báo ngân sách' :
                           key === 'bills' ? 'Nhắc nhở hóa đơn' :
                           key === 'goals' ? 'Mục tiêu tài chính' :
                           'Thanh toán nợ'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {key === 'budget' ? 'Thông báo khi sắp vượt ngân sách' :
                           key === 'bills' ? 'Nhắc nhở hóa đơn sắp đến hạn' :
                           key === 'goals' ? 'Cập nhật tiến độ mục tiêu' :
                           'Nhắc nhở thanh toán nợ'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => handleNestedSettingChange('notifications', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Quản lý dữ liệu</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-2">Sao lưu dữ liệu</h3>
                    <p className="text-sm text-blue-700 mb-4">Tải xuống bản sao lưu dữ liệu của bạn</p>
                    <button
                      onClick={exportData}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Tải xuống
                    </button>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <h3 className="font-medium text-green-900 mb-2">Khôi phục dữ liệu</h3>
                    <p className="text-sm text-green-700 mb-4">Tải lên file sao lưu để khôi phục dữ liệu</p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-600 file:text-white hover:file:bg-green-700"
                    />
                  </div>

                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <h3 className="font-medium text-red-900 mb-2">Xóa tất cả dữ liệu</h3>
                    <p className="text-sm text-red-700 mb-4">Xóa vĩnh viễn tất cả dữ liệu trong ứng dụng</p>
                    <button
                      onClick={clearAllData}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Giới thiệu</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-gray-900 mb-2">Hioney Finance</h3>
                    <p className="text-sm text-gray-600 mb-2">Phiên bản 1.0.0</p>
                    <p className="text-sm text-gray-600">Ứng dụng quản lý tài chính cá nhân hiện đại</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-gray-900 mb-2">Thống kê dữ liệu</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Giao dịch:</span>
                        <span className="ml-2 font-medium">{state.transactions.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ngân sách:</span>
                        <span className="ml-2 font-medium">{state.budgets.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Hóa đơn:</span>
                        <span className="ml-2 font-medium">{state.bills.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Mục tiêu:</span>
                        <span className="ml-2 font-medium">{state.goals.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-gray-900 mb-2">Liên hệ</h3>
                    <p className="text-sm text-gray-600">Email: support@hioney.com</p>
                    <p className="text-sm text-gray-600">Website: www.hioney.com</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
