# Hướng dẫn Deploy Firestore Rules

## Cách 1: Firebase Console (Khuyến nghị)

1. Vào: https://console.firebase.google.com/
2. Chọn project **Hioney**
3. Vào **Firestore Database** → Tab **Rules**
4. Copy nội dung từ `firestore.rules` và paste vào
5. Click **Publish**

## Cách 2: Firebase CLI

```bash
# Cài Firebase CLI (nếu chưa có)
npm install -g firebase-tools

# Login vào Firebase
firebase login

# Initialize project (chọn Firestore)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Rules hiện tại:

File `firestore.rules` đã có đầy đủ rules cho:
- ✅ Users collection
- ✅ UserData subcollection  
- ✅ Credit Cards (với validation last4, cấm PAN/CVV)
- ✅ Credit Transactions
- ✅ Credit Payments
- ✅ Credit Statements

Tất cả đều có user isolation (chỉ truy cập data của mình).

## Sau khi deploy:

Module Tín dụng sẽ hoạt động bình thường!

