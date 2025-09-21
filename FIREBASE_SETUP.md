# Firebase Setup Guide

## 🔥 Cấu hình Firebase cho Hioney Finance App

### 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Đặt tên project: `hioney-finance`
4. Bật Google Analytics (tùy chọn)
5. Click "Create project"

### 2. Cấu hình Authentication

1. Trong Firebase Console, chọn "Authentication"
2. Click "Get started"
3. Chọn tab "Sign-in method"
4. Bật "Email/Password"
5. Bật "Google" (chọn project support email)
6. Click "Save"

### 3. Cấu hình Firestore Database

1. Trong Firebase Console, chọn "Firestore Database"
2. Click "Create database"
3. Chọn "Start in test mode" (cho development)
4. Chọn location gần nhất (asia-southeast1)
5. Click "Done"

### 4. Lấy Firebase Config

1. Trong Firebase Console, click vào biểu tượng ⚙️ (Settings)
2. Chọn "Project settings"
3. Scroll xuống "Your apps"
4. Click "Web app" (biểu tượng `</>`)
5. Đặt tên app: `hioney-web`
6. Copy config object

### 5. Cập nhật Firebase Config

Thay thế nội dung trong `src/firebase/config.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Thay thế bằng config từ Firebase Console
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
```

### 6. Cấu hình Firestore Rules

Trong Firebase Console > Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can read all users (for admin panel)
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 7. Cấu hình Storage Rules (tùy chọn)

Trong Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 8. Test Authentication

1. Chạy app: `npm run dev`
2. Vào Settings tab
3. Thử đăng ký tài khoản mới
4. Thử đăng nhập
5. Kiểm tra Firebase Console > Authentication để xem user

### 9. Test Authentication & Cloud Sync

1. **Test Google Sign-In**:
   - Vào app, click "Đăng nhập / Đăng ký"
   - Click "Tiếp tục với Google"
   - Chọn tài khoản Google
   - Kiểm tra Firebase Console > Authentication

2. **Test Email/Password**:
   - Thử đăng ký tài khoản mới với email/password
   - Thử đăng nhập với tài khoản đã tạo

3. **Test Cloud Sync**:
   - Đăng nhập vào app
   - Thêm một vài giao dịch
   - Click "Đồng bộ lên Cloud"
   - Kiểm tra Firebase Console > Firestore để xem dữ liệu
   - Thử "Tải từ Cloud" để restore dữ liệu

4. **Test Admin Panel** (nếu có quyền admin):
   - Vào Settings tab
   - Xem Admin Panel (chỉ hiện với admin)
   - Quản lý users và roles

### 🔒 Bảo mật

- **Development**: Sử dụng test mode rules
- **Production**: Cập nhật rules để bảo mật hơn
- **API Keys**: Không commit config thật vào git
- **Environment Variables**: Sử dụng .env file cho production

### 📱 PWA + Firebase

App đã được cấu hình PWA, sẽ hoạt động offline và sync khi có internet.

### 🚀 Deploy

1. Build: `npm run build`
2. Deploy lên Firebase Hosting hoặc Vercel/Netlify
3. Cập nhật Firebase config cho production domain

---

**Lưu ý**: Đây là setup cơ bản. Để production, cần cấu hình thêm bảo mật và optimization.
