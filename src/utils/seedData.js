// Seed data for initial app state

import { DEFAULT_CATEGORIES, LS_KEY } from '../constants';
import { uid, todayISO } from './helpers';

export const seed = {
  categories: DEFAULT_CATEGORIES,
  transactions: [
    { id: uid(), type: "income", amount: 12000000, category: "income", note: "Lương tháng", date: todayISO() },
    { id: uid(), type: "expense", amount: 350000, category: "food", note: "Ăn trưa", date: todayISO() },
    { id: uid(), type: "expense", amount: 120000, category: "transport", note: "Xăng xe", date: todayISO() },
  ],
  budgets: [
    { id: uid(), category: "food", monthly: 2000000 },
    { id: uid(), category: "transport", monthly: 800000 },
    { id: uid(), category: "shopping", monthly: 1500000 },
  ],
  debts: [
    { id: uid(), name: "Thẻ tín dụng A", balance: 3000000, apr: 28, minPay: 300000, dueDate: "2024-02-15" },
  ],
  goals: [
    { id: uid(), name: "Quỹ dự phòng", target: 20000000, saved: 4000000 },
  ],
  bills: [
    { id: uid(), name: "Hóa đơn điện", amount: 450000, dueDate: "2024-02-10", category: "bills", isPaid: false },
    { id: uid(), name: "Hóa đơn nước", amount: 120000, dueDate: "2024-02-12", category: "bills", isPaid: false },
    { id: uid(), name: "Internet", amount: 200000, dueDate: "2024-02-15", category: "bills", isPaid: false },
  ],
  bankAccounts: [
    { id: uid(), name: "Tài khoản chính", balance: 5000000, type: "checking", bankName: "Vietcombank" },
    { id: uid(), name: "Tài khoản tiết kiệm", balance: 15000000, type: "savings", bankName: "BIDV" },
  ],
  notifications: [],
  settings: { currency: "VND", notifications: true, theme: "light" },
};

export const migrateState = (oldState) => {
  if (!oldState) return seed;
  
  // Add missing properties to old state
  const migratedState = {
    ...oldState,
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

