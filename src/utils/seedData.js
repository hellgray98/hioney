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
  wallets: [],
  transactions: [],
  budgets: [],
  debts: [],
  goals: [],
  bills: [],
  bankAccounts: [],
  notifications: [],
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


