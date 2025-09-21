import React, { useState } from 'react';
import { createAdminByEmail, createSuperAdmin, listAllUsers, isAdmin } from '../utils/createAdmin';

const AdminCreator = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);

  const handleCreateAdmin = async () => {
    if (!email) {
      setMessage('Vui lòng nhập email');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const success = await createAdminByEmail(email);
      if (success) {
        setMessage(`✅ Đã cấp quyền admin cho ${email}`);
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(`❌ Không thể cấp quyền admin cho ${email}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuperAdmin = async () => {
    if (!email) {
      setMessage('Vui lòng nhập email');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const success = await createSuperAdmin(email, displayName);
      if (success) {
        setMessage(`✅ Đã tạo super admin: ${email}`);
        setMessageType('success');
        setEmail('');
        setDisplayName('');
      } else {
        setMessage(`❌ Không thể tạo super admin: ${email}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleListUsers = async () => {
    setLoading(true);
    try {
      const usersList = await listAllUsers();
      setUsers(usersList);
      setShowUsers(true);
    } catch (error) {
      setMessage(`❌ Lỗi khi lấy danh sách users: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAdmin = async () => {
    if (!email) {
      setMessage('Vui lòng nhập email');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const adminStatus = await isAdmin(email);
      setMessage(adminStatus ? `✅ ${email} là admin` : `❌ ${email} không phải admin`);
      setMessageType(adminStatus ? 'success' : 'error');
    } catch (error) {
      setMessage(`❌ Lỗi khi kiểm tra: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🔧 Admin Creator Tool
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Công cụ tạo admin qua code
        </p>
      </div>

      <div className="space-y-6">
        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Name (cho Super Admin)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              placeholder="Super Admin Name"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleCreateAdmin}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            {loading ? 'Đang xử lý...' : 'Cấp quyền Admin'}
          </button>

          <button
            onClick={handleCreateSuperAdmin}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            {loading ? 'Đang xử lý...' : 'Tạo Super Admin'}
          </button>

          <button
            onClick={handleCheckAdmin}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            {loading ? 'Đang xử lý...' : 'Kiểm tra Admin'}
          </button>

          <button
            onClick={handleListUsers}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
          >
            {loading ? 'Đang xử lý...' : 'Danh sách Users'}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`rounded-xl p-3 ${
            messageType === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <p className={`text-sm ${
              messageType === 'success' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Users List */}
        {showUsers && users.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              📋 Danh sách Users ({users.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.displayName || 'Không có tên'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          ⚠️ Lưu ý quan trọng
        </h4>
        <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• <strong>Cấp quyền Admin</strong>: Cấp quyền admin cho user đã tồn tại</li>
          <li>• <strong>Tạo Super Admin</strong>: Tạo admin mới với quyền cao nhất</li>
          <li>• <strong>Kiểm tra Admin</strong>: Kiểm tra user có phải admin không</li>
          <li>• <strong>Danh sách Users</strong>: Xem tất cả users trong hệ thống</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminCreator;
