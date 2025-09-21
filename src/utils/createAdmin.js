import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Tạo admin từ email đã tồn tại
 * @param {string} email - Email của user cần cấp quyền admin
 * @returns {Promise<boolean>} - true nếu thành công, false nếu thất bại
 */
export const createAdminByEmail = async (email) => {
  try {
    console.log(`🔍 Đang tìm user với email: ${email}`);
    
    // Tìm user document theo email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(`❌ Không tìm thấy user với email: ${email}`);
      return false;
    }

    // Lấy user document đầu tiên
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log(`✅ Tìm thấy user: ${userData.displayName || userData.email}`);

    // Cập nhật role thành admin
    await setDoc(doc(db, 'users', userDoc.id), {
      ...userData,
      role: 'admin',
      updatedAt: new Date().toISOString(),
      adminCreatedAt: new Date().toISOString()
    }, { merge: true });

    console.log(`🎉 Đã cấp quyền admin cho ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi tạo admin:', error);
    return false;
  }
};

/**
 * Tạo admin từ UID
 * @param {string} uid - UID của user cần cấp quyền admin
 * @returns {Promise<boolean>} - true nếu thành công, false nếu thất bại
 */
export const createAdminByUID = async (uid) => {
  try {
    console.log(`🔍 Đang tìm user với UID: ${uid}`);
    
    // Lấy user document theo UID
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      console.error(`❌ Không tìm thấy user với UID: ${uid}`);
      return false;
    }

    const userData = userDoc.data();
    console.log(`✅ Tìm thấy user: ${userData.displayName || userData.email}`);

    // Cập nhật role thành admin
    await setDoc(userDocRef, {
      ...userData,
      role: 'admin',
      updatedAt: new Date().toISOString(),
      adminCreatedAt: new Date().toISOString()
    }, { merge: true });

    console.log(`🎉 Đã cấp quyền admin cho UID: ${uid}`);
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi tạo admin:', error);
    return false;
  }
};

/**
 * Tạo admin đầu tiên (super admin)
 * @param {string} email - Email của super admin
 * @param {string} displayName - Tên hiển thị
 * @returns {Promise<boolean>} - true nếu thành công, false nếu thất bại
 */
export const createSuperAdmin = async (email, displayName = 'Super Admin') => {
  try {
    console.log(`🔍 Đang tạo super admin: ${email}`);
    
    // Tạo document ID từ email (hoặc có thể dùng UID nếu có)
    const adminId = email.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Tạo super admin document
    await setDoc(doc(db, 'users', adminId), {
      email: email,
      displayName: displayName,
      role: 'admin',
      isSuperAdmin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminCreatedAt: new Date().toISOString(),
      permissions: ['all'] // Super admin có tất cả quyền
    });

    console.log(`🎉 Đã tạo super admin: ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi tạo super admin:', error);
    return false;
  }
};

/**
 * Liệt kê tất cả users
 * @returns {Promise<Array>} - Danh sách users
 */
export const listAllUsers = async () => {
  try {
    console.log('🔍 Đang lấy danh sách users...');
    
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const usersList = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Tìm thấy ${usersList.length} users:`);
    usersList.forEach(user => {
      console.log(`  - ${user.email} (${user.role || 'user'})`);
    });

    return usersList;
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách users:', error);
    return [];
  }
};

/**
 * Kiểm tra user có phải admin không
 * @param {string} email - Email của user
 * @returns {Promise<boolean>} - true nếu là admin, false nếu không
 */
export const isAdmin = async (email) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return false;
    }

    const userData = querySnapshot.docs[0].data();
    return userData.role === 'admin';
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra admin:', error);
    return false;
  }
};
