// Seed data for initial app state

import { DEFAULT_CATEGORIES, LS_KEY } from '../constants';
import { uid, todayISO } from './helpers';

// Generate random date within last 3 months
const getRandomDate = (daysBack = 90) => {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  const date = new Date(today);
  date.setDate(date.getDate() - randomDays);
  return date.toISOString().slice(0, 10);
};

// Generate random amount within range
const getRandomAmount = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate random date within last 30 days (for notifications)
const getRandomNotificationDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0];
};

// Generate random notification
const generateNotification = (type, message, daysAgo = 30, read = false) => ({
  id: uid(),
  type,
  message,
  title: type === 'bill_reminder' ? 'Nhắc nhở hóa đơn' :
         type === 'budget_warning' ? 'Cảnh báo ngân sách' :
         type === 'goal_milestone' ? 'Mốc mục tiêu' :
         type === 'payment_alert' ? 'Cảnh báo thanh toán' :
         type === 'spending_alert' ? 'Cảnh báo chi tiêu' : 'Thông báo',
  createdAt: getRandomNotificationDate(daysAgo),
  read
});

export const seed = {
  categories: DEFAULT_CATEGORIES,
  wallets: [
    { id: uid(), name: "Ví tiền mặt", type: "cash", balance: 500000 },
    { id: uid(), name: "Tài khoản chính", type: "bank", balance: 5000000 },
    { id: uid(), name: "Thẻ tín dụng", type: "credit", balance: -2000000 },
    { id: uid(), name: "Tài khoản tiết kiệm", type: "savings", balance: 10000000 },
  ],
  transactions: [
    // Thu nhập
    { id: uid(), type: "income", amount: 15000000, category: "income", note: "Lương tháng 1", date: "2024-01-01" },
    { id: uid(), type: "income", amount: 15000000, category: "income", note: "Lương tháng 2", date: "2024-02-01" },
    { id: uid(), type: "income", amount: 15000000, category: "income", note: "Lương tháng 3", date: "2024-03-01" },
    { id: uid(), type: "income", amount: 2000000, category: "income", note: "Thưởng dự án", date: "2024-02-15" },
    { id: uid(), type: "income", amount: 500000, category: "income", note: "Làm thêm cuối tuần", date: "2024-03-10" },
    
    // Chi tiêu ăn uống
    { id: uid(), type: "expense", amount: 45000, category: "food", note: "Cà phê sáng", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 120000, category: "food", note: "Ăn trưa văn phòng", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 85000, category: "food", note: "Ăn tối", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 350000, category: "food", note: "Đi nhà hàng cuối tuần", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 180000, category: "food", note: "Mua đồ ăn siêu thị", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 95000, category: "food", note: "Grab Food", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 220000, category: "food", note: "Buffet với bạn bè", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 65000, category: "food", note: "Trà sữa", date: getRandomDate(30) },
    
    // Chi tiêu di chuyển
    { id: uid(), type: "expense", amount: 150000, category: "transport", note: "Xăng xe máy", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 25000, category: "transport", note: "Grab đi làm", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 35000, category: "transport", note: "Taxi về nhà", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 8000, category: "transport", note: "Xe buýt", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 120000, category: "transport", note: "Bảo dưỡng xe", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 45000, category: "transport", note: "Grab đi chơi", date: getRandomDate(30) },
    
    // Chi tiêu mua sắm
    { id: uid(), type: "expense", amount: 1200000, category: "shopping", note: "Quần áo mùa đông", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 850000, category: "shopping", note: "Giày thể thao", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 450000, category: "shopping", note: "Mỹ phẩm", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 320000, category: "shopping", note: "Đồ điện tử", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 180000, category: "shopping", note: "Sách", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 950000, category: "shopping", note: "Túi xách", date: getRandomDate(30) },
    
    // Chi tiêu giải trí
    { id: uid(), type: "expense", amount: 180000, category: "entertainment", note: "Xem phim rạp", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 250000, category: "entertainment", note: "Karaoke", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 120000, category: "entertainment", note: "Netflix", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 350000, category: "entertainment", note: "Du lịch cuối tuần", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 150000, category: "entertainment", note: "Game online", date: getRandomDate(30) },
    
    // Chi tiêu sức khỏe
    { id: uid(), type: "expense", amount: 450000, category: "health", note: "Khám sức khỏe định kỳ", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 180000, category: "health", note: "Thuốc cảm", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 320000, category: "health", note: "Gym membership", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 120000, category: "health", note: "Vitamin", date: getRandomDate(30) },
    
    // Hóa đơn
    { id: uid(), type: "expense", amount: 450000, category: "bills", note: "Hóa đơn điện", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 120000, category: "bills", note: "Hóa đơn nước", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 200000, category: "bills", note: "Internet", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 150000, category: "bills", note: "Điện thoại", date: getRandomDate(30) },
    { id: uid(), type: "expense", amount: 800000, category: "rent", note: "Tiền thuê nhà", date: getRandomDate(30) },
  ],
  budgets: [
    { id: uid(), category: "food", monthly: 3000000 },
    { id: uid(), category: "transport", monthly: 1200000 },
    { id: uid(), category: "shopping", monthly: 2500000 },
    { id: uid(), category: "entertainment", monthly: 1500000 },
    { id: uid(), category: "health", monthly: 800000 },
    { id: uid(), category: "bills", monthly: 1000000 },
    { id: uid(), category: "rent", monthly: 800000 },
  ],
  debts: [
    { id: uid(), name: "Thẻ tín dụng Vietcombank", balance: 4500000, apr: 18.5, minPay: 450000, dueDate: "2024-02-15" },
    { id: uid(), name: "Thẻ tín dụng Techcombank", balance: 2800000, apr: 22.0, minPay: 280000, dueDate: "2024-02-20" },
    { id: uid(), name: "Vay mua xe", balance: 15000000, apr: 12.0, minPay: 1500000, dueDate: "2024-02-25" },
    { id: uid(), name: "Vay tiêu dùng", balance: 8000000, apr: 15.5, minPay: 800000, dueDate: "2024-02-28" },
  ],
  goals: [
    { id: uid(), name: "Quỹ dự phòng khẩn cấp", target: 50000000, saved: 12000000 },
    { id: uid(), name: "Mua nhà", target: 2000000000, saved: 150000000 },
    { id: uid(), name: "Du lịch châu Âu", target: 80000000, saved: 25000000 },
    { id: uid(), name: "Mua xe mới", target: 500000000, saved: 80000000 },
    { id: uid(), name: "Học thêm kỹ năng", target: 15000000, saved: 5000000 },
  ],
  bills: [
    { id: uid(), name: "Hóa đơn điện", amount: 450000, dueDate: "2024-02-10", category: "bills", isPaid: false },
    { id: uid(), name: "Hóa đơn nước", amount: 120000, dueDate: "2024-02-12", category: "bills", isPaid: false },
    { id: uid(), name: "Internet", amount: 200000, dueDate: "2024-02-15", category: "bills", isPaid: false },
    { id: uid(), name: "Điện thoại", amount: 150000, dueDate: "2024-02-18", category: "bills", isPaid: false },
    { id: uid(), name: "Bảo hiểm xe", amount: 1200000, dueDate: "2024-02-20", category: "bills", isPaid: false },
    { id: uid(), name: "Netflix", amount: 120000, dueDate: "2024-02-25", category: "bills", isPaid: false },
    { id: uid(), name: "Spotify", amount: 59000, dueDate: "2024-02-28", category: "bills", isPaid: false },
    { id: uid(), name: "Gym membership", amount: 320000, dueDate: "2024-03-01", category: "bills", isPaid: false },
  ],
  bankAccounts: [
    { id: uid(), name: "Tài khoản chính Vietcombank", balance: 8500000, type: "checking", bankName: "Vietcombank" },
    { id: uid(), name: "Tài khoản tiết kiệm BIDV", balance: 25000000, type: "savings", bankName: "BIDV" },
    { id: uid(), name: "Tài khoản đầu tư Techcombank", balance: 12000000, type: "savings", bankName: "Techcombank" },
    { id: uid(), name: "Tài khoản dự phòng", balance: 5000000, type: "checking", bankName: "Agribank" },
  ],
      notifications: [
        // Chỉ 3 thông báo mẫu
        generateNotification('bill_reminder', 'Hóa đơn điện sắp đến hạn thanh toán', 2, false),
        generateNotification('budget_warning', 'Bạn đã chi tiêu 80% ngân sách ăn uống tháng này', 5, false),
        generateNotification('goal_milestone', 'Chúc mừng! Bạn đã đạt 50% mục tiêu quỹ dự phòng', 1, true)
      ],
  settings: { 
    currency: "VND", 
    notifications: true, 
    theme: "light",
    language: "vi",
    autoBackup: true,
    dataRetention: "1year"
  },
};

export const migrateState = (oldState) => {
  if (!oldState) return seed;
  
  // Add missing properties to old state
  const migratedState = {
    ...oldState,
    wallets: oldState.wallets || seed.wallets,
    bills: oldState.bills || [],
    bankAccounts: oldState.bankAccounts || [],
    notifications: oldState.notifications || [],
    settings: {
      currency: "VND",
      notifications: true,
      theme: "light",
      ...oldState.settings
    }
  };
  
  // Add dueDate to existing debts if missing
  if (migratedState.debts) {
    migratedState.debts = migratedState.debts.map(debt => ({
      ...debt,
      dueDate: debt.dueDate || null
    }));
  }
  
  return migratedState;
};


