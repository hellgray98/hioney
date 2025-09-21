// Type definitions for Hioney Finance App

export interface Category {
  id: string;
  label: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note: string;
  date: string;
}

export interface Budget {
  id: string;
  category: string;
  monthly: number;
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  apr: number;
  minPay: number;
  dueDate: string | null;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
}

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings';
  bankName: string;
}

export interface Notification {
  id: string;
  type: 'bill_reminder' | 'payment_alert' | 'budget_warning' | 'goal_milestone' | 'spending_alert';
  message: string;
  date: string;
  read: boolean;
}

export interface Settings {
  currency: string;
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  autoBackup: boolean;
  dataRetention: string;
}

export interface AppState {
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  debts: Debt[];
  goals: Goal[];
  bills: Bill[];
  bankAccounts: BankAccount[];
  notifications: Notification[];
  settings: Settings;
}

export interface Analytics {
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
  currentMonth: string;
  monthTx: Transaction[];
  monthExpenseByCat: Record<string, number>;
  budgetAnalysis: BudgetAnalysis[];
  spendingTrends: SpendingTrend[];
  categoryAnalysis: CategoryAnalysis[];
  pieData: PieData[];
  lineData: LineData[];
}

export interface BudgetAnalysis extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
  categoryLabel: string;
}

export interface SpendingTrend {
  month: string;
  income: number;
  expense: number;
  savings: number;
  savingsRate: number;
}

export interface CategoryAnalysis {
  category: string;
  categoryLabel: string;
  months: Record<string, number>;
}

export interface PieData {
  name: string;
  value: number;
}

export interface LineData {
  month: string;
  income: number;
  expense: number;
}

export interface FormData {
  [key: string]: any;
}

export interface TabItem {
  id: string;
  label: string;
  icon: string;
}

export interface PWAData {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  needRefresh: boolean;
  installApp: () => Promise<void>;
  updateApp: () => void;
  dismissUpdate: () => void;
}

