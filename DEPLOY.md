# 🚀 Hướng dẫn Deploy Hioney lên Vercel

## 📋 **Chuẩn bị**

### 1. **Kiểm tra dự án**
```bash
# Test build local
npm run build

# Test preview
npm run preview
```

### 2. **Chuẩn bị Git**
```bash
# Khởi tạo git (nếu chưa có)
git init

# Thêm tất cả files
git add .

# Commit đầu tiên
git commit -m "Initial commit: Hioney Finance App v1.0.0"
```

## 🌐 **Deploy lên Vercel**

### **Phương pháp 1: GitHub + Vercel (Khuyến nghị)**

#### Bước 1: Push lên GitHub
```bash
# Tạo repository trên GitHub trước
# Sau đó push code
git remote add origin https://github.com/YOUR_USERNAME/hioney.git
git branch -M main
git push -u origin main
```

#### Bước 2: Deploy trên Vercel
1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập bằng GitHub
3. Click **"New Project"**
4. Import repository `hioney`
5. Vercel sẽ tự động detect:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Deploy"**

### **Phương pháp 2: Vercel CLI**

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Login vào Vercel
vercel login

# Deploy (lần đầu)
vercel

# Deploy production
vercel --prod
```

## ⚙️ **Cấu hình Vercel**

### **Build Settings**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

### **Environment Variables**
Không cần environment variables vì app sử dụng localStorage.

### **Custom Domain (Tùy chọn)**
1. Vào Project Settings
2. Chọn "Domains"
3. Thêm domain tùy chỉnh

## 🔧 **Troubleshooting**

### **Lỗi Build**
```bash
# Kiểm tra dependencies
npm install

# Clear cache
npm run build -- --force

# Kiểm tra Node version
node --version  # Cần >= 16.0.0
```

### **Lỗi 404 trên Vercel**
- Đảm bảo có file `vercel.json` với SPA routing
- Kiểm tra `outputDirectory` là `dist`

### **Performance Issues**
- File JS lớn (>500KB) - có thể optimize bằng code splitting
- Sử dụng dynamic imports cho các components lớn

## 📊 **Monitoring**

### **Vercel Analytics**
1. Vào Project Settings
2. Enable "Vercel Analytics"
3. Xem metrics về performance

### **Error Tracking**
- Vercel tự động track errors
- Xem logs trong Vercel Dashboard

## 🔄 **Auto Deploy**

Khi push code mới lên GitHub:
```bash
git add .
git commit -m "Update: Add new features"
git push origin main
```

Vercel sẽ tự động:
1. Detect changes
2. Build new version
3. Deploy to production
4. Send notification

## 📱 **PWA Support (Tương lai)**

Để thêm PWA support:
1. Thêm `vite-plugin-pwa`
2. Cấu hình service worker
3. Thêm manifest.json

## 🎯 **Best Practices**

1. **Commit Messages**: Sử dụng conventional commits
2. **Branch Strategy**: `main` cho production
3. **Testing**: Test build trước khi push
4. **Performance**: Monitor bundle size
5. **Security**: Không commit sensitive data

## 📞 **Support**

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Vite Docs**: [vitejs.dev](https://vitejs.dev)
- **React Docs**: [react.dev](https://react.dev)

---

**🎉 Chúc mừng! Ứng dụng Hioney của bạn đã sẵn sàng để deploy!**
