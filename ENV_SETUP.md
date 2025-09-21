# Environment Variables Setup

## 🔐 Cách giấu Firebase secrets

### 1. Tạo file .env trong root project:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD6WogJjmb6OiJivzmH4U-0Xl8xY5dJBPM
VITE_FIREBASE_AUTH_DOMAIN=hioney-finance.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hioney-finance
VITE_FIREBASE_STORAGE_BUCKET=hioney-finance.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=694188619660
VITE_FIREBASE_APP_ID=1:694188619660:web:a029e9365c31424f9208a9
VITE_FIREBASE_MEASUREMENT_ID=G-F4RGQ14PY7
```

### 2. Vercel Deployment:

Trong Vercel Dashboard:
1. Vào **Settings** → **Environment Variables**
2. Thêm từng biến:
   - `VITE_FIREBASE_API_KEY` = `AIzaSyD6WogJjmb6OiJivzmH4U-0Xl8xY5dJBPM`
   - `VITE_FIREBASE_AUTH_DOMAIN` = `hioney-finance.firebaseapp.com`
   - `VITE_FIREBASE_PROJECT_ID` = `hioney-finance`
   - `VITE_FIREBASE_STORAGE_BUCKET` = `hioney-finance.firebasestorage.app`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = `694188619660`
   - `VITE_FIREBASE_APP_ID` = `1:694188619660:web:a029e9365c31424f9208a9`
   - `VITE_FIREBASE_MEASUREMENT_ID` = `G-F4RGQ14PY7`

### 3. Kết quả:

- ✅ **Local**: Dùng file .env
- ✅ **Vercel**: Dùng Environment Variables
- ✅ **GitHub**: Không có secrets trong code
- ✅ **Security**: Secrets được bảo vệ
