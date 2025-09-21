import React, { useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const createAdmin = async () => {
    if (!email) {
      setMessage('Vui lòng nhập email');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Tìm user document theo email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage('Không tìm thấy user với email này');
        setMessageType('error');
        return;
      }

      // Cập nhật role thành admin
      const userDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'users', userDoc.id), {
        role: 'admin',
        updatedAt: new Date().toISOString()
      });

      setMessage(`✅ Đã cấp quyền admin cho ${email}`);
      setMessageType('success');
      setEmail('');
    } catch (error) {
      console.error('Error creating admin:', error);
      setMessage('❌ Có lỗi xảy ra: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          🔑 Tạo Admin
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cấp quyền admin cho user đã tồn tại
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email của user
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            placeholder="user@example.com"
          />
        </div>

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

        <button
          onClick={createAdmin}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-colors"
        >
          {loading ? 'Đang xử lý...' : 'Cấp quyền Admin'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          ⚠️ Lưu ý quan trọng
        </h4>
        <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• User phải đã đăng ký và có tài khoản trong hệ thống</li>
          <li>• Admin có thể quản lý tất cả users và dữ liệu</li>
          <li>• Chỉ nên cấp quyền admin cho người tin tưởng</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSetup;
