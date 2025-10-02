# Credit Card Module Documentation

## 🎯 Tổng quan

Module Thẻ tín dụng cho phép người dùng quản lý thông tin thẻ tín dụng, theo dõi chi tiêu, thanh toán và sao kê hàng tháng.

## ✅ Tính năng đã hoàn thành

### 1. **Core Types & Models** (`src/types/credit.ts`)
- ✅ `CreditCard`: Model thẻ tín dụng với đầy đủ thông tin
- ✅ `CreditTransaction`: Giao dịch thẻ tín dụng
- ✅ `CreditPayment`: Thanh toán thẻ
- ✅ `CreditStatement`: Sao kê thẻ
- ✅ `CreditCardSummary`: Tổng quan thẻ

### 2. **Credit Math Library** (`src/lib/creditMath.ts`)
- ✅ `calculateMonthlyInterest`: Tính lãi hàng tháng từ APR
- ✅ `calculateMinimumPayment`: Tính thanh toán tối thiểu
- ✅ `calculateUtilization`: Tính tỷ lệ sử dụng hạn mức
- ✅ `getNextDueDate`: Xác định ngày đến hạn
- ✅ `validateCardSettings`: Kiểm tra cài đặt thẻ
- ✅ `computeStatement`: Tính toán sao kê (với cảnh báo dueDay < statementDay)
- ✅ `getCurrentBalance`: Lấy số dư hiện tại

### 3. **Zustand Store** (`src/store/creditStore.ts`)
- ✅ CRUD operations cho Cards, Transactions, Payments, Statements
- ✅ Computed values: getTotalBalance, getTotalAvailableCredit, getOverallUtilization
- ✅ Card archiving functionality
- ✅ Statement generation

### 4. **Components**
- ✅ `CardForm`: Form thêm/sửa thẻ với validation
  - Các trường: holderName, issuer, network, last4, openedAt, creditLimit
  - Cài đặt: statementDay, dueDay, minPaymentPercent, minPaymentFloor
  - APR & grace period settings
  - Cảnh báo khi dueDay < statementDay
- ✅ `CreditOverviewCard`: Tổng quan dư nợ và hạn mức
  - Hiển thị từng thẻ với utilization
  - Tổng dư nợ (không cộng vào Tổng tài sản)
  - Minimum payment due & due dates
- ✅ `CreditDashboard`: Trang chính module Credit

### 5. **Firebase Integration** (`src/repositories/creditRepo.ts`)
- ✅ Collections: creditCards, creditTransactions, creditPayments, creditStatements
- ✅ CRUD operations với Firestore
- ✅ Date conversion helpers (Timestamp ↔ Date)
- ✅ Cascading delete (xóa thẻ → xóa transactions/payments/statements)

### 6. **Security** (`firestore.rules`)
- ✅ Chỉ cho phép lưu 4 số cuối (last4)
- ✅ Cấm lưu PAN, CVV, expiry date
- ✅ User isolation (chỉ truy cập data của mình)
- ✅ Validation rules cho last4 format

### 7. **UI/UX Integration**
- ✅ Thêm tab "Tín dụng" vào MainApp
- ✅ Fintech styling consistent với app
- ✅ Responsive design
- ✅ Dark/Light theme support

## 🚧 Cần hoàn thiện

### 1. **Firebase Integration**
- [ ] Kết nối thực tế với Firebase trong creditStore
- [ ] Update creditRepo imports trong store
- [ ] Test với real Firebase data

### 2. **Additional Components**
- [ ] TransactionForm: Form thêm/sửa giao dịch
- [ ] PaymentForm: Form thêm thanh toán
- [ ] StatementView: Xem chi tiết sao kê
- [ ] CardsList: Danh sách thẻ với actions

### 3. **Features**
- [ ] Import transactions từ CSV
- [ ] Export statements PDF
- [ ] Notifications cho due dates
- [ ] Charts & analytics

## 📝 Hướng dẫn sử dụng

### 1. Thêm thẻ mới
```javascript
// Từ CreditDashboard, click "Thêm thẻ mới"
// Điền form với thông tin:
- Tên chủ thẻ
- Ngân hàng phát hành
- Mạng thẻ (Visa/Mastercard/etc)
- 4 số cuối
- Hạn mức tín dụng
- Ngày chốt sao kê (1-28)
- Ngày đến hạn (1-28)
- APR và minimum payment settings
```

### 2. Chốt kỳ sao kê
```javascript
// Click nút "Chốt kỳ" trong Quick Actions
// System sẽ:
- Lấy prevBalance từ statement kỳ trước
- Gom transactions/payments trong kỳ
- Tính interest nếu có
- Tạo statement mới
```

### 3. Security Notes
- **KHÔNG BAO GIỜ** lưu full card number
- **KHÔNG BAO GIỜ** lưu CVV/Security code
- **CHỈ** lưu 4 số cuối để nhận diện thẻ
- Firebase Rules tự động block sensitive data

## 🔧 Environment Variables

Thêm vào `.env.local`:
```env
VITE_FB_API_KEY=your_api_key
VITE_FB_AUTH_DOMAIN=your_auth_domain
VITE_FB_PROJECT_ID=your_project_id
VITE_FB_STORAGE_BUCKET=your_storage_bucket
VITE_FB_MESSAGING_SENDER_ID=your_sender_id
VITE_FB_APP_ID=your_app_id
```

## 🚀 Deploy

1. Build project:
```bash
npm run build
```

2. Deploy to Vercel:
```bash
vercel --prod
```

## 📚 Tech Stack

- **React** + **TypeScript**: Core framework
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Firebase Firestore**: Database
- **Firebase Auth**: Authentication
- **Vercel**: Deployment

## ⚠️ Lưu ý quan trọng

1. **Bảo mật**: Không lưu thông tin nhạy cảm của thẻ
2. **Validation**: Luôn validate dueDay vs statementDay
3. **Interest**: Chỉ tính lãi nếu không thanh toán đủ kỳ trước
4. **Utilization**: Nên giữ < 30% để tốt cho credit score
5. **Firebase**: Cần enable Firestore và Auth trước khi sử dụng
