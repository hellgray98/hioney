# ⚡ Quick Deploy Guide

## 🚀 **Deploy trong 3 bước**

### **Bước 1: Chuẩn bị**
```bash
# Đảm bảo đã cài Node.js và npm
node --version  # >= 16.0.0
npm --version   # >= 8.0.0
```

### **Bước 2: Push lên GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hioney.git
git push -u origin main
```

### **Bước 3: Deploy trên Vercel**
1. Vào [vercel.com](https://vercel.com)
2. Login bằng GitHub
3. Click "New Project"
4. Import repository `hioney`
5. Click "Deploy"

## 🎯 **Hoặc dùng CLI**

```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
npm run deploy
```

## ✅ **Kiểm tra**
- Build thành công: ✅
- Files đã tạo: ✅
- Scripts đã thêm: ✅

**🎉 Xong! App sẽ có URL như: `https://hioney-xxx.vercel.app`**
