// Admin Creation Script
// Sử dụng script này để tạo admin từ browser console

import { createAdminByEmail, createSuperAdmin, listAllUsers, isAdmin } from './createAdmin';
import { testFirebaseConnection, checkCurrentUser, testAdminAccess } from './testFirebase';

// Tạo admin từ email
window.createAdmin = async (email) => {
  console.log(`🚀 Bắt đầu tạo admin cho: ${email}`);
  const result = await createAdminByEmail(email);
  if (result) {
    console.log(`✅ Thành công! ${email} đã được cấp quyền admin`);
  } else {
    console.log(`❌ Thất bại! Không thể cấp quyền admin cho ${email}`);
  }
  return result;
};

// Tạo super admin
window.createSuperAdmin = async (email, displayName = 'Super Admin') => {
  console.log(`🚀 Bắt đầu tạo super admin: ${email}`);
  const result = await createSuperAdmin(email, displayName);
  if (result) {
    console.log(`✅ Thành công! Super admin ${email} đã được tạo`);
  } else {
    console.log(`❌ Thất bại! Không thể tạo super admin ${email}`);
  }
  return result;
};

// Kiểm tra admin
window.checkAdmin = async (email) => {
  console.log(`🔍 Kiểm tra admin: ${email}`);
  const result = await isAdmin(email);
  if (result) {
    console.log(`✅ ${email} là admin`);
  } else {
    console.log(`❌ ${email} không phải admin`);
  }
  return result;
};

// Liệt kê tất cả users
window.listUsers = async () => {
  console.log(`📋 Lấy danh sách users...`);
  const users = await listAllUsers();
  console.log(`✅ Tìm thấy ${users.length} users:`);
  users.forEach(user => {
    console.log(`  - ${user.email} (${user.role || 'user'})`);
  });
  return users;
};

// Test Firebase connection
window.testFirebase = async () => {
  console.log('🧪 Testing Firebase connection...');
  const result = await testFirebaseConnection();
  if (result.success) {
    console.log('✅ Firebase connection successful!');
    console.log('📊 Users found:', result.count);
    console.log('👥 Users data:', result.users);
  } else {
    console.error('❌ Firebase connection failed:', result.error);
  }
  return result;
};

// Check current user
window.checkUser = async () => {
  console.log('🔐 Checking current user...');
  const result = await checkCurrentUser();
  if (result.authenticated) {
    console.log('✅ User authenticated:', result.user?.email);
    console.log('👑 User role:', result.role);
  } else {
    console.log('❌ User not authenticated');
  }
  return result;
};

// Test admin access
window.testAdmin = async () => {
  console.log('👑 Testing admin access...');
  const result = await testAdminAccess();
  if (result.success) {
    console.log('✅ Admin access successful!');
    console.log('📊 Users found:', result.count);
  } else {
    console.error('❌ Admin access failed:', result.error);
  }
  return result;
};

// Hướng dẫn sử dụng
window.adminHelp = () => {
  console.log(`
🔧 ADMIN CREATION SCRIPT
========================

Các lệnh có sẵn:

1. createAdmin('user@example.com')
   - Cấp quyền admin cho user đã tồn tại

2. createSuperAdmin('admin@example.com', 'Admin Name')
   - Tạo super admin mới

3. checkAdmin('user@example.com')
   - Kiểm tra user có phải admin không

4. listUsers()
   - Liệt kê tất cả users

5. testFirebase()
   - Test kết nối Firebase và lấy dữ liệu

6. checkUser()
   - Kiểm tra user hiện tại và role

7. testAdmin()
   - Test quyền admin

8. adminHelp()
   - Hiển thị hướng dẫn này

Ví dụ:
- createAdmin('john@example.com')
- createSuperAdmin('admin@company.com', 'Company Admin')
- checkAdmin('john@example.com')
- listUsers()
- testFirebase()
- checkUser()
- testAdmin()

⚠️ Lưu ý: Chỉ sử dụng trên môi trường development!
  `);
};

// Hiển thị hướng dẫn khi load script
console.log(`
🔧 ADMIN CREATION SCRIPT LOADED
===============================

Sử dụng adminHelp() để xem hướng dẫn
Hoặc gọi trực tiếp các function:
- createAdmin('email@example.com')
- createSuperAdmin('email@example.com', 'Name')
- checkAdmin('email@example.com')
- listUsers()
`);

export default {
  createAdmin: window.createAdmin,
  createSuperAdmin: window.createSuperAdmin,
  checkAdmin: window.checkAdmin,
  listUsers: window.listUsers,
  adminHelp: window.adminHelp
};
