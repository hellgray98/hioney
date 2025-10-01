# 🚀 Hướng dẫn Deploy Hioney Finance App lên Vercel

## 🔧 Cấu hình Environment Variables trên Vercel

### Bước 1: Lấy Firebase Config
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project `hioney-finance`
3. Click vào biểu tượng ⚙️ (Settings) > Project settings
4. Scroll xuống "Your apps" và click vào web app
5. Copy các giá trị config

### Bước 2: Cấu hình Environment Variables trên Vercel

#### Cách 1: Qua Vercel Dashboard (Khuyến nghị)
1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `hioney` của bạn
3. Vào tab **Settings** > **Environment Variables**
4. Thêm các biến môi trường sau:

```
VITE_FIREBASE_API_KEY = AIzaSyD6WogJjmb6OiJivzmH4U-0Xl8xY5dJBPM
VITE_FIREBASE_AUTH_DOMAIN = hioney-finance.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = hioney-finance
VITE_FIREBASE_STORAGE_BUCKET = hioney-finance.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = 694188619660
VITE_FIREBASE_APP_ID = 1:694188619660:web:a029e9365c31424f9208a9
VITE_FIREBASE_MEASUREMENT_ID = G-F4RGQ14PY7
```

5. Đảm bảo chọn **Production**, **Preview**, và **Development** cho tất cả biến
6. Click **Save**

#### Cách 2: Qua Vercel CLI
```bash
# Cài đặt Vercel CLI (nếu chưa có)
npm i -g vercel

# Login vào Vercel
vercel login

# Thêm environment variables
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_FIREBASE_MEASUREMENT_ID
```

### Bước 3: Redeploy Project
Sau khi thêm environment variables:
1. Vào Vercel Dashboard > Project > **Deployments**
2. Click **Redeploy** trên deployment mới nhất
3. Hoặc push một commit mới lên Git để trigger auto-deploy

### Bước 4: Kiểm tra Deployment
1. Truy cập URL của app trên Vercel
2. Mở Developer Tools (F12) > Console
3. Kiểm tra không có lỗi Firebase config
4. Thử đăng nhập/đăng ký để test Firebase Authentication

## 🔒 Bảo mật

### ✅ Đã làm:
- ✅ Loại bỏ hardcode Firebase config khỏi source code
- ✅ Sử dụng environment variables
- ✅ Thêm validation cho environment variables
- ✅ File `.env` đã được thêm vào `.gitignore`

### 🛡️ Best Practices:
- **Không bao giờ** commit file `.env` vào Git
- **Luôn** sử dụng environment variables cho production
- **Kiểm tra** environment variables trước khi deploy
- **Sử dụng** Vercel's built-in environment variable management

## 🐛 Troubleshooting

### Lỗi: "Missing Firebase configuration"
**Nguyên nhân**: Environment variables chưa được cấu hình đúng
**Giải pháp**:
1. Kiểm tra Vercel Dashboard > Settings > Environment Variables
2. Đảm bảo tất cả biến đã được thêm
3. Redeploy project

### Lỗi: "Firebase: Error (auth/configuration-not-found)"
**Nguyên nhân**: Firebase config không hợp lệ
**Giải pháp**:
1. Kiểm tra lại Firebase config từ Firebase Console
2. Đảm bảo project ID đúng
3. Kiểm tra domain được authorized trong Firebase Console

### Lỗi: "Firebase: Error (auth/unauthorized-domain)"
**Nguyên nhân**: Domain Vercel chưa được thêm vào authorized domains
**Giải pháp**:
1. Vào Firebase Console > Authentication > Settings
2. Thêm domain Vercel vào "Authorized domains"
3. Ví dụ: `hioney.vercel.app`, `hioney-git-main-yourusername.vercel.app`

## 📱 Test Checklist

Sau khi deploy, test các chức năng sau:
- [ ] App load được không có lỗi console
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập với email/password
- [ ] Đăng nhập với Google
- [ ] Thêm/sửa/xóa giao dịch
- [ ] Cloud sync hoạt động
- [ ] PWA install được
- [ ] Offline mode hoạt động

## 🚀 Auto Deploy

Vercel sẽ tự động deploy khi bạn:
1. Push code lên branch `main` (production)
2. Push code lên branch khác (preview)
3. Tạo Pull Request (preview)

---

**Lưu ý**: Sau khi cấu hình environment variables, app sẽ hoạt động bình thường trên Vercel mà không cần hardcode config trong source code.
