# ⚠️ SỬA LỖI PERMISSIONS NGAY LẬP TỨC

## Vấn đề:
Firebase Firestore đang chặn TẤT CẢ requests vì rules chưa được deploy đúng.

## Giải pháp NHANH NHẤT:

### Bước 1: Vào Firebase Console
1. Truy cập: **https://console.firebase.google.com/**
2. Chọn project **Hioney**
3. Menu bên trái → **Firestore Database**
4. Click tab **Rules** (ở trên cùng)

### Bước 2: Copy & Paste Rules này

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // UserData collection
    match /userData/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Credit Cards
    match /users/{userId}/creditCards/{cardId} {
      allow read, write: if isOwner(userId);
    }
    
    // Credit Transactions
    match /users/{userId}/creditTransactions/{txId} {
      allow read, write: if isOwner(userId);
    }
    
    // Credit Payments
    match /users/{userId}/creditPayments/{paymentId} {
      allow read, write: if isOwner(userId);
    }
    
    // Credit Statements
    match /users/{userId}/creditStatements/{statementId} {
      allow read, write: if isOwner(userId);
    }
  }
}
```

### Bước 3: Publish
- Click nút **"Publish"** màu xanh
- Đợi vài giây

### Bước 4: Test
- Reload lại app (Ctrl + R hoặc F5)
- Thử thêm giao dịch/category/budget
- Thử thêm thẻ tín dụng

## ✅ Sau khi deploy:
- Tất cả tính năng sẽ hoạt động
- Data sẽ được lưu vào Firebase
- Không còn lỗi permissions

## 🔒 Bảo mật:
Rules đảm bảo:
- Chỉ user đã đăng nhập mới truy cập được
- Mỗi user chỉ thấy data của mình
- Credit cards có validation bổ sung (sẽ thêm sau khi app chạy được)

