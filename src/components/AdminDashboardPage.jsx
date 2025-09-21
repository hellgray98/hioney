import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import AdminSetup from './AdminSetup';
import AdminCreator from './AdminCreator';
import FirebaseDebug from './FirebaseDebug';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalRegularUsers: 0,
    recentUsers: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching users from Firebase...');
      
      const usersCollection = collection(db, 'users');
      console.log('📁 Users collection reference:', usersCollection);
      
      const usersSnapshot = await getDocs(usersCollection);
      console.log('📊 Users snapshot:', usersSnapshot);
      console.log('📋 Number of docs:', usersSnapshot.docs.length);
      
      const usersList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('👤 User data:', doc.id, data);
        return {
          id: doc.id,
          ...data
        };
      });
      
      console.log('✅ Final users list:', usersList);
      setUsers(usersList);
      
      // Calculate stats
      const totalUsers = usersList.length;
      const totalAdmins = usersList.filter(user => user.role === 'admin').length;
      const totalRegularUsers = usersList.filter(user => user.role === 'user').length;
      const recentUsers = usersList.filter(user => {
        if (!user.createdAt) return false;
        const createdAt = new Date(user.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
      }).length;

      console.log('📈 Stats:', { totalUsers, totalAdmins, totalRegularUsers, recentUsers });
      setStats({
        totalUsers,
        totalAdmins,
        totalRegularUsers,
        recentUsers
      });
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      console.error('Error details:', error.message, error.code);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setSelectedUser(userId);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      // Update stats
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return;
    
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-lg sm:text-2xl">👥</span>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2">
              {stats.totalUsers}
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Tổng Users</div>
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-lg sm:text-2xl">👑</span>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-red-600 dark:text-red-400 mb-1 sm:mb-2">
              {stats.totalAdmins}
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Admins</div>
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-lg sm:text-2xl">👤</span>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-1 sm:mb-2">
              {stats.totalRegularUsers}
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Users</div>
          </div>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <span className="text-lg sm:text-2xl">🆕</span>
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1 sm:mb-2">
              {stats.recentUsers}
            </div>
            <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Mới (7 ngày)</div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Users mới nhất
          </h3>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
            <span className="text-lg sm:text-xl">🆕</span>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {users
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(user => (
              <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl sm:rounded-2xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-200 gap-3 sm:gap-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Avatar" 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md">
                      <span className="text-white text-sm sm:text-lg font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {user.displayName || 'Không có tên'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
                  <span className={`px-3 sm:px-4 py-1 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-md ${
                    user.role === 'admin' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  }`}>
                    {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-700/50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Quản lý Users
        </h3>
        <button
          onClick={fetchUsers}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <span className="flex items-center space-x-2">
            <span>🔄</span>
            <span>Làm mới</span>
          </span>
        </button>
      </div>

      <div className="space-y-4">
        {users.map(user => (
          <div key={user.id} className="border border-gray-200/50 dark:border-gray-600/50 rounded-2xl p-6 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-700/50 dark:to-gray-600/50 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Avatar" 
                    className="w-14 h-14 rounded-2xl object-cover shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-md">
                    <span className="text-white text-lg font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {user.displayName || 'Không có tên'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Tạo: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => fetchUserData(user.id)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span>👁️</span>
                    <span>Xem Data</span>
                  </span>
                </button>
                
                <select
                  value={user.role || 'user'}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <span>🗑️</span>
                    <span>Xóa</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">👥</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Không có người dùng nào</p>
        </div>
      )}
    </div>
  );

  const renderUserData = () => (
    <div className="space-y-6">
      {/* User Selection */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          📊 Chi tiết dữ liệu User
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => fetchUserData(user.id)}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedUser === user.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Avatar" 
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {user.displayName || 'Không có tên'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* User Data Display */}
      {userData && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Dữ liệu của {userData.displayName || userData.email}
            </h3>
            <span className={`px-4 py-2 rounded-2xl text-sm font-semibold ${
              userData.role === 'admin' 
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            }`}>
              {userData.role === 'admin' ? '👑 Admin' : '👤 User'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                👤 Thông tin cơ bản
              </h4>
              <div className="space-y-2">
                <p><span className="font-medium">Email:</span> {userData.email}</p>
                <p><span className="font-medium">Tên:</span> {userData.displayName || 'Không có'}</p>
                <p><span className="font-medium">UID:</span> {selectedUser}</p>
                <p><span className="font-medium">Tạo:</span> {new Date(userData.createdAt).toLocaleString()}</p>
                {userData.lastLogin && (
                  <p><span className="font-medium">Đăng nhập cuối:</span> {new Date(userData.lastLogin).toLocaleString()}</p>
                )}
              </div>
            </div>

            {/* Financial Data */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
                💰 Dữ liệu tài chính
              </h4>
              <div className="space-y-2">
                <p><span className="font-medium">Wallets:</span> {userData.wallets?.length || 0}</p>
                <p><span className="font-medium">Giao dịch:</span> {userData.transactions?.length || 0}</p>
                <p><span className="font-medium">Ngân sách:</span> {userData.budgets?.length || 0}</p>
                <p><span className="font-medium">Mục tiêu:</span> {userData.goals?.length || 0}</p>
                <p><span className="font-medium">Hóa đơn:</span> {userData.bills?.length || 0}</p>
                <p><span className="font-medium">Nợ:</span> {userData.debts?.length || 0}</p>
              </div>
            </div>

            {/* System Data */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">
                ⚙️ Dữ liệu hệ thống
              </h4>
              <div className="space-y-2">
                <p><span className="font-medium">Thông báo:</span> {userData.notifications?.length || 0}</p>
                <p><span className="font-medium">Tài khoản NH:</span> {userData.bankAccounts?.length || 0}</p>
                <p><span className="font-medium">Đồng bộ cuối:</span> {userData.lastSync ? new Date(userData.lastSync).toLocaleString() : 'Chưa có'}</p>
                <p><span className="font-medium">Cập nhật:</span> {userData.updatedAt ? new Date(userData.updatedAt).toLocaleString() : 'Chưa có'}</p>
              </div>
            </div>
          </div>

          {/* Raw Data */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              📄 Dữ liệu thô (JSON)
            </h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-6 overflow-auto max-h-96">
              <pre className="text-sm text-gray-800 dark:text-gray-200">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:py-6 gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl sm:text-2xl">👑</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Quản lý hệ thống và người dùng
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={fetchUsers}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🔄</span>
                  <span className="hidden sm:inline">Làm mới</span>
                  <span className="sm:hidden">Refresh</span>
                </span>
              </button>
              <button
                onClick={async () => {
                  console.log('🧪 Testing Firebase connection...');
                  try {
                    // Test 1: Check if db is available
                    console.log('📁 Database reference:', db);
                    if (!db) {
                      throw new Error('Database reference is null');
                    }
                    
                    // Test 2: Check authentication
                    const { auth } = await import('../firebase/config');
                    console.log('🔐 Auth reference:', auth);
                    console.log('👤 Current user:', auth.currentUser);
                    
                    if (!auth.currentUser) {
                      throw new Error('User not authenticated');
                    }
                    
                    // Test 3: Try to access collection
                    console.log('📊 Trying to access users collection...');
                    const testCollection = collection(db, 'users');
                    console.log('✅ Collection reference created:', testCollection);
                    
                    // Test 4: Try to get documents
                    console.log('📋 Trying to get documents...');
                    const testSnapshot = await getDocs(testCollection);
                    console.log('✅ Snapshot retrieved:', testSnapshot);
                    console.log('📊 Number of documents:', testSnapshot.docs.length);
                    
                    // Test 5: Log each document
                    testSnapshot.docs.forEach((doc, index) => {
                      console.log(`👤 User ${index + 1}:`, {
                        id: doc.id,
                        data: doc.data()
                      });
                    });
                    
                    alert(`✅ Firebase kết nối thành công!\n📊 Tìm thấy ${testSnapshot.docs.length} users.\n👤 User hiện tại: ${auth.currentUser.email}`);
                  } catch (error) {
                    console.error('❌ Firebase connection failed:', error);
                    console.error('Error details:', {
                      message: error.message,
                      code: error.code,
                      stack: error.stack
                    });
                    alert(`❌ Lỗi kết nối Firebase:\n${error.message}\n\nChi tiết: ${error.code || 'Unknown error'}`);
                  }
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🧪</span>
                  <span className="hidden sm:inline">Test Firebase</span>
                  <span className="sm:hidden">Test</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Scrollable tabs */}
          <div className="block sm:hidden">
            <div className="flex space-x-1 py-2 overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 rounded-2xl font-medium text-xs transition-all duration-200 flex-shrink-0 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <span>📊</span>
                  <span>Tổng quan</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-3 rounded-2xl font-medium text-xs transition-all duration-200 flex-shrink-0 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <span>👥</span>
                  <span>Users</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('setup')}
                className={`px-4 py-3 rounded-2xl font-medium text-xs transition-all duration-200 flex-shrink-0 ${
                  activeTab === 'setup'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <span>🔑</span>
                  <span>Tạo Admin</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('creator')}
                className={`px-4 py-3 rounded-2xl font-medium text-xs transition-all duration-200 flex-shrink-0 ${
                  activeTab === 'creator'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <span>🔧</span>
                  <span>Creator</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('userdata')}
                className={`px-4 py-3 rounded-2xl font-medium text-xs transition-all duration-200 flex-shrink-0 ${
                  activeTab === 'userdata'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <span>📊</span>
                  <span>Data</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('debug')}
                className={`px-4 py-3 rounded-2xl font-medium text-xs transition-all duration-200 flex-shrink-0 ${
                  activeTab === 'debug'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-1">
                  <span>🔧</span>
                  <span>Debug</span>
                </span>
              </button>
            </div>
          </div>

          {/* Desktop: Full tabs */}
          <div className="hidden sm:block">
            <div className="flex space-x-1 py-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 rounded-2xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-1'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Tổng quan</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 rounded-2xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'users'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-1'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>Quản lý Users</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('setup')}
                className={`px-6 py-4 rounded-2xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'setup'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-1'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>🔑</span>
                  <span>Tạo Admin</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('creator')}
                className={`px-6 py-4 rounded-2xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'creator'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-1'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>🔧</span>
                  <span>Admin Creator</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('userdata')}
                className={`px-6 py-4 rounded-2xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'userdata'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-1'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>User Data</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('debug')}
                className={`px-6 py-4 rounded-2xl font-medium text-sm transition-all duration-200 ${
                  activeTab === 'debug'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-1'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>🔧</span>
                  <span>Debug</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="animate-fadeIn">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'setup' && <AdminSetup />}
          {activeTab === 'creator' && <AdminCreator />}
          {activeTab === 'userdata' && renderUserData()}
          {activeTab === 'debug' && <FirebaseDebug />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
