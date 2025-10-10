import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/FirebaseDataContext';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Account = () => {
  const { currentUser, logout } = useAuth();
  const { theme } = useTheme();
  const { exportData, clearAllData } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    dateOfBirth: '',
    phone: '',
    address: '',
    facebook: '',
    github: '',
    instagram: '',
    bio: ''
  });

  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setFormData(prev => ({
              ...prev,
              displayName: currentUser.displayName || userData.displayName || '',
              email: currentUser.email || '',
              dateOfBirth: userData.dateOfBirth || '',
              phone: userData.phone || '',
              address: userData.address || '',
              facebook: userData.facebook || '',
              github: userData.github || '',
              instagram: userData.instagram || '',
              bio: userData.bio || ''
            }));
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.displayName.trim()) {
      setError('Vui lòng nhập họ tên');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: formData.displayName
      });

      // Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        address: formData.address,
        facebook: formData.facebook,
        github: formData.github,
        instagram: formData.instagram,
        bio: formData.bio,
        updatedAt: new Date().toISOString()
      });

      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.')) {
      try {
        setLoading(true);
        await clearAllData();
        setSuccess('Đã xóa tất cả dữ liệu thành công!');
      } catch (error) {
        setError('Có lỗi xảy ra khi xóa dữ liệu');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
              {currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {currentUser?.displayName || 'Tài khoản'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className={`rounded-2xl p-4 ${
          theme === 'dark' ? 'bg-red-500/10 border border-red-800' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-danger-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-danger-700 dark:text-danger-400">
              {error}
            </span>
          </div>
        </div>
      )}

      {success && (
        <div className={`rounded-2xl p-4 ${
          theme === 'dark' ? 'bg-green-500/10 border border-green-800' : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-success-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-success-700 dark:text-success-400">
              {success}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Thông tin cá nhân
                </h2>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`btn-fintech-${isEditing ? 'secondary' : 'primary'} w-12 h-12 p-0`}
                title={isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isEditing ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  )}
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input-fintech ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                    placeholder="Nhập họ và tên"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="input-fintech opacity-50 cursor-not-allowed"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input-fintech ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`input-fintech ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                    placeholder="0123 456 789"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Địa chỉ
                </label>
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`input-fintech ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Liên kết mạng xã hội
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Facebook
                    </label>
                    <input
                      name="facebook"
                      type="url"
                      value={formData.facebook}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-fintech ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                      placeholder="https://facebook.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      GitHub
                    </label>
                    <input
                      name="github"
                      type="url"
                      value={formData.github}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-fintech ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Instagram
                    </label>
                    <input
                      name="instagram"
                      type="url"
                      value={formData.instagram}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-fintech ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Giới thiệu bản thân
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className={`input-fintech resize-none ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="Viết vài dòng về bản thân..."
                />
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-fintech-primary px-8 py-3 font-semibold ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang cập nhật...
                      </div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Stats */}
          <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
          }`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Thống kê tài khoản
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tham gia:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {currentUser?.metadata?.creationTime ? 
                    new Date(currentUser.metadata.creationTime).toLocaleDateString('vi-VN') : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Đăng nhập cuối:</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {currentUser?.metadata?.lastSignInTime ? 
                    new Date(currentUser.metadata.lastSignInTime).toLocaleDateString('vi-VN') : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">User ID:</span>
                <span className="text-xs font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {currentUser?.uid?.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
          }`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Thao tác nhanh
            </h3>
            <div className="space-y-3">
              <button
                onClick={exportData}
                className="btn-fintech-outline w-full py-3 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Xuất dữ liệu
              </button>
              
              <button
                onClick={handleClearData}
                disabled={loading}
                className="btn-fintech-danger w-full py-3 text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa tất cả dữ liệu
              </button>
            </div>
          </div>

          {/* Security */}
          <div className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 ${
            theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
          }`}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Bảo mật
            </h3>
            <button
              onClick={handleLogout}
              className="btn-fintech-secondary w-full py-3 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
