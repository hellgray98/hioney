// src/PersonalFinanceApp.jsx
import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from "recharts";

// === Personal Finance App (Single-file React Component) ===
// Mobile-first, responsive desktop layout. Data persists to localStorage.
// TailwindCSS 3.x utilities.

// ---------- Helpers
const CURRENCY = "VND";
const fmt = (n) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(n || 0);
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const uid = () => Math.random().toString(36).slice(2, 9);
const todayISO = () => new Date().toISOString().slice(0, 10);
const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN');

const defaultCategories = [
  { id: "food", label: "Ăn uống" },
  { id: "transport", label: "Di chuyển" },
  { id: "bills", label: "Hóa đơn" },
  { id: "rent", label: "Thuê nhà" },
  { id: "shopping", label: "Mua sắm" },
  { id: "health", label: "Sức khỏe" },
  { id: "entertainment", label: "Giải trí" },
  { id: "income", label: "Thu nhập" },
];

// Notification types
const NOTIFICATION_TYPES = {
  BILL_REMINDER: 'bill_reminder',
  PAYMENT_ALERT: 'payment_alert',
  BUDGET_WARNING: 'budget_warning',
  GOAL_MILESTONE: 'goal_milestone',
  SPENDING_ALERT: 'spending_alert'
};

// ---------- Local Storage
const LS_KEY = "pfm_state_v1";
const loadState = () => {
  try {
    const s = localStorage.getItem(LS_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};
const saveState = (state) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
};

// ---------- Seed Data (first run)
const seed = {
  categories: defaultCategories,
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

// ---------- Data Migration
const migrateState = (oldState) => {
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

// ---------- Main App
export default function PersonalFinanceApp() {
  const [state, setState] = useState(() => {
    const loadedState = loadState();
    return migrateState(loadedState);
  });
  const [tab, setTab] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => { saveState(state); }, [state]);

  // Derived
  const incomeTotal = useMemo(() => sum(state.transactions.filter(t=>t.type==="income").map(t=>t.amount)), [state.transactions]);
  const expenseTotal = useMemo(() => sum(state.transactions.filter(t=>t.type==="expense").map(t=>t.amount)), [state.transactions]);
  const balance = incomeTotal - expenseTotal;

  const currentMonth = new Date().toISOString().slice(0,7);
  const monthTx = state.transactions.filter(t => t.date?.slice(0,7) === currentMonth);
  const monthExpenseByCat = useMemo(()=>{
    const m = {};
    for (const t of monthTx) {
      if (t.type !== "expense") continue;
      m[t.category] = (m[t.category]||0)+t.amount;
    }
    return m;
  }, [state.transactions]);

  const categories = state.categories;
  const catLabel = (id) => categories.find(c=>c.id===id)?.label || id;

  // Notification helpers
  const addNotification = (type, title, message, data = {}) => {
    const notification = {
      id: uid(),
      type,
      title,
      message,
      data,
      timestamp: new Date().toISOString(),
      read: false
    };
    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications]
    }));
  };

  const markNotificationRead = (id) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  };

  const clearAllNotifications = () => {
    setState(prev => ({
      ...prev,
      notifications: []
    }));
  };

  // Bill management
  const addBill = (bill) => {
    setState(prev => ({
      ...prev,
      bills: [...prev.bills, { ...bill, id: uid() }]
    }));
  };

  const updateBill = (id, updates) => {
    setState(prev => ({
      ...prev,
      bills: prev.bills.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const deleteBill = (id) => {
    setState(prev => ({
      ...prev,
      bills: prev.bills.filter(b => b.id !== id)
    }));
  };

  const markBillPaid = (id) => {
    updateBill(id, { isPaid: true, paidDate: todayISO() });
    addNotification(
      NOTIFICATION_TYPES.BILL_REMINDER,
      "Hóa đơn đã thanh toán",
      "Bạn đã thanh toán hóa đơn thành công!"
    );
  };

  // Bank account management
  const addBankAccount = (account) => {
    setState(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, { ...account, id: uid() }]
    }));
  };

  const updateBankAccount = (id, updates) => {
    setState(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map(a => a.id === id ? { ...a, ...updates } : a)
    }));
  };

  const deleteBankAccount = (id) => {
    setState(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter(a => a.id !== id)
    }));
  };

  // Helper functions
  const addTransaction = (transaction) => {
    setState(prev => ({
      ...prev,
      transactions: [...prev.transactions, { ...transaction, id: uid() }]
    }));
  };

  const updateTransaction = (id, updates) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTransaction = (id) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  const addBudget = (budget) => {
    setState(prev => ({
      ...prev,
      budgets: [...prev.budgets, { ...budget, id: uid() }]
    }));
  };

  const updateBudget = (id, updates) => {
    setState(prev => ({
      ...prev,
      budgets: prev.budgets.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const deleteBudget = (id) => {
    setState(prev => ({
      ...prev,
      budgets: prev.budgets.filter(b => b.id !== id)
    }));
  };

  const addDebt = (debt) => {
    setState(prev => ({
      ...prev,
      debts: [...prev.debts, { ...debt, id: uid() }]
    }));
  };

  const updateDebt = (id, updates) => {
    setState(prev => ({
      ...prev,
      debts: prev.debts.map(d => d.id === id ? { ...d, ...updates } : d)
    }));
  };

  const deleteDebt = (id) => {
    setState(prev => ({
      ...prev,
      debts: prev.debts.filter(d => d.id !== id)
    }));
  };

  const addGoal = (goal) => {
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: uid() }]
    }));
  };

  const updateGoal = (id, updates) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g)
    }));
  };

  const deleteGoal = (id) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id)
    }));
  };

  // Charts data
  const pieData = Object.keys(monthExpenseByCat).map(cat => ({ name: catLabel(cat), value: monthExpenseByCat[cat] }));
  const lineData = [];
  const months = {};
  for (const t of state.transactions) {
    const ym = t.date.slice(0,7);
    if (!months[ym]) months[ym] = { month: ym, income: 0, expense: 0 };
    if (t.type === "income") months[ym].income += t.amount;
    if (t.type === "expense") months[ym].expense += t.amount;
  }
  for (const k of Object.keys(months).sort()) lineData.push(months[k]);

  // Budget analysis
  const budgetAnalysis = state.budgets.map(budget => {
    const spent = monthExpenseByCat[budget.category] || 0;
    const remaining = budget.monthly - spent;
    const percentage = (spent / budget.monthly) * 100;
    return {
      ...budget,
      spent,
      remaining,
      percentage: Math.min(percentage, 100),
      categoryLabel: catLabel(budget.category)
    };
  });

  // Advanced Analytics
  const spendingTrends = useMemo(() => {
    const trends = {};
    const last6Months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      last6Months.push(monthKey);
    }

    last6Months.forEach(month => {
      const monthTransactions = state.transactions.filter(t => t.date?.slice(0, 7) === month);
      const income = sum(monthTransactions.filter(t => t.type === 'income').map(t => t.amount));
      const expense = sum(monthTransactions.filter(t => t.type === 'expense').map(t => t.amount));
      
      trends[month] = {
        month,
        income,
        expense,
        savings: income - expense,
        savingsRate: income > 0 ? ((income - expense) / income) * 100 : 0
      };
    });

    return Object.values(trends);
  }, [state.transactions]);

  const categoryAnalysis = useMemo(() => {
    const analysis = {};
    const last3Months = [];
    
    for (let i = 2; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7);
      last3Months.push(monthKey);
    }

    last3Months.forEach(month => {
      const monthTransactions = state.transactions.filter(t => 
        t.date?.slice(0, 7) === month && t.type === 'expense'
      );
      
      monthTransactions.forEach(t => {
        if (!analysis[t.category]) {
          analysis[t.category] = {
            category: t.category,
            categoryLabel: catLabel(t.category),
            months: {}
          };
        }
        if (!analysis[t.category].months[month]) {
          analysis[t.category].months[month] = 0;
        }
        analysis[t.category].months[month] += t.amount;
      });
    });

    return Object.values(analysis);
  }, [state.transactions, categories]);

  // Bill reminders
  const upcomingBills = useMemo(() => {
    if (!state.bills) return [];
    const today = new Date();
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return state.bills.filter(bill => {
      if (bill.isPaid) return false;
      const dueDate = new Date(bill.dueDate);
      return dueDate >= today && dueDate <= next7Days;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [state.bills]);

  // Credit card payment alerts
  const creditCardAlerts = useMemo(() => {
    if (!state.debts) return [];
    const today = new Date();
    const next3Days = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    return state.debts.filter(debt => {
      if (!debt.dueDate) return false;
      const dueDate = new Date(debt.dueDate);
      return dueDate >= today && dueDate <= next3Days;
    });
  }, [state.debts]);

  // Budget warnings
  const budgetWarnings = useMemo(() => {
    return budgetAnalysis.filter(budget => budget.percentage > 80);
  }, [budgetAnalysis]);

  // Goal milestones
  const goalMilestones = useMemo(() => {
    if (!state.goals) return [];
    return state.goals.filter(goal => {
      const progress = (goal.saved / goal.target) * 100;
      return progress >= 25 && progress % 25 === 0; // 25%, 50%, 75%, 100%
    });
  }, [state.goals]);

  // Tabs
  const TabItems = [
    { id: "dashboard", label: "Tổng quan", icon: "📊" },
    { id: "transactions", label: "Giao dịch", icon: "💸" },
    { id: "charts", label: "Biểu đồ", icon: "📈" },
    { id: "analytics", label: "Phân tích", icon: "📊" },
    { id: "budgets", label: "Ngân sách", icon: "🧾" },
    { id: "bills", label: "Hóa đơn", icon: "📋" },
    { id: "debts", label: "Nợ/Thẻ", icon: "💳" },
    { id: "goals", label: "Mục tiêu", icon: "🎯" },
    { id: "banking", label: "Ngân hàng", icon: "🏦" },
    { id: "notifications", label: "Thông báo", icon: "🔔" },
    { id: "settings", label: "Cài đặt", icon: "⚙️" }
  ];

  // Form handlers
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (tab === "transactions") {
      if (editingItem) {
        updateTransaction(editingItem.id, formData);
      } else {
        addTransaction(formData);
      }
    } else if (tab === "budgets") {
      if (editingItem) {
        updateBudget(editingItem.id, formData);
      } else {
        addBudget(formData);
      }
    } else if (tab === "debts") {
      if (editingItem) {
        updateDebt(editingItem.id, formData);
      } else {
        addDebt(formData);
      }
    } else if (tab === "goals") {
      if (editingItem) {
        updateGoal(editingItem.id, formData);
      } else {
        addGoal(formData);
      }
    } else if (tab === "bills") {
      if (editingItem) {
        updateBill(editingItem.id, formData);
      } else {
        addBill(formData);
      }
    } else if (tab === "banking") {
      if (editingItem) {
        updateBankAccount(editingItem.id, formData);
      } else {
        addBankAccount(formData);
      }
    }
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      if (tab === "transactions") deleteTransaction(id);
      else if (tab === "budgets") deleteBudget(id);
      else if (tab === "debts") deleteDebt(id);
      else if (tab === "goals") deleteGoal(id);
      else if (tab === "bills") deleteBill(id);
      else if (tab === "banking") deleteBankAccount(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                ₫
              </div>
              <div>
                <div className="text-sm text-gray-500 leading-tight">Quản lý tài chính cá nhân</div>
                <div className="text-xl font-bold leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Hioney
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Dữ liệu được lưu tự động
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
        {/* Dashboard Tab */}
        {tab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Tổng thu nhập</div>
                    <div className="text-2xl font-bold text-emerald-600">{fmt(incomeTotal)}</div>
              </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💰</span>
              </div>
              </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Tổng chi tiêu</div>
                    <div className="text-2xl font-bold text-red-500">{fmt(expenseTotal)}</div>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💸</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Số dư hiện tại</div>
                    <div className={`text-2xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {fmt(balance)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Tháng: {currentMonth}</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Giao dịch tháng</div>
                    <div className="text-2xl font-bold text-indigo-600">{monthTx.length}</div>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📈</span> Xu hướng tháng này
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Thu nhập trung bình/ngày</span>
                    <span className="font-semibold text-emerald-600">
                      {fmt(incomeTotal / new Date().getDate())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chi tiêu trung bình/ngày</span>
                    <span className="font-semibold text-red-500">
                      {fmt(expenseTotal / new Date().getDate())}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>🎯</span> Mục tiêu tài chính
                </h3>
                <div className="space-y-3">
                  {state.goals.slice(0, 2).map(goal => (
                    <div key={goal.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 truncate">{goal.name}</span>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {fmt(goal.saved)} / {fmt(goal.target)}
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${Math.min((goal.saved / goal.target) * 100, 100)}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {tab === "transactions" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">Giao dịch</h2>
              <div className="flex gap-3">
            <input
                  className="flex-1 sm:w-64 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tìm kiếm giao dịch..."
              value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  + Thêm giao dịch
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Loại</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Danh mục</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ghi chú</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Số tiền</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                  <tbody className="divide-y divide-gray-100">
                    {state.transactions.filter(t => {
                    const q = query.toLowerCase();
                    return !q || t.note.toLowerCase().includes(q) || catLabel(t.category).toLowerCase().includes(q);
                    }).map(t => (
                      <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm">{formatDate(t.date)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            t.type === "income" 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {t.type === "income" ? "Thu" : "Chi"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{catLabel(t.category)}</td>
                        <td className="px-6 py-4 text-sm">{t.note}</td>
                        <td className={`px-6 py-4 text-sm font-semibold text-right ${
                          t.type === "income" ? "text-emerald-600" : "text-red-600"
                        }`}>
                          {fmt(t.amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(t)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {tab === "charts" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Phân tích biểu đồ</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>🥧</span> Chi tiêu theo danh mục
                </h3>
                <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                      <Pie 
                        data={pieData} 
                        dataKey="value" 
                        nameKey="name" 
                        outerRadius={100} 
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                    {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4"][index % 6]} />
                    ))}
                  </Pie>
                      <Tooltip formatter={(value) => fmt(value)} />
                </PieChart>
              </ResponsiveContainer>
                </div>
            </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📈</span> Thu/Chi theo tháng
                </h3>
                <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip formatter={(value) => fmt(value)} />
                  <Legend />
                      <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} name="Thu nhập" />
                      <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} name="Chi tiêu" />
                </LineChart>
              </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Phân tích nâng cao</h2>
            
            {/* Spending Trends */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📊</span> Xu hướng chi tiêu 6 tháng gần đây
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={spendingTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip formatter={(value) => fmt(value)} />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Thu nhập" />
                    <Bar dataKey="expense" fill="#ef4444" name="Chi tiêu" />
                    <Bar dataKey="savings" fill="#3b82f6" name="Tiết kiệm" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Analysis */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span>📈</span> So sánh chi tiêu theo danh mục
              </h3>
              <div className="space-y-4">
                {categoryAnalysis.map(category => (
                  <div key={category.category} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2">{category.categoryLabel}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {Object.entries(category.months).map(([month, amount]) => (
                        <div key={month} className="text-center">
                          <div className="text-gray-500">{month}</div>
                          <div className="font-semibold text-red-600">{fmt(amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>💰</span> Tỷ lệ tiết kiệm
                </h3>
                <div className="space-y-3">
                  {spendingTrends.slice(-3).map(trend => (
                    <div key={trend.month} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{trend.month}</span>
                      <div className="text-right">
                        <div className={`font-semibold ${trend.savingsRate >= 20 ? 'text-green-600' : trend.savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {trend.savingsRate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">{fmt(trend.savings)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📊</span> Thống kê tổng quan
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng giao dịch:</span>
                    <span className="font-semibold">{state.transactions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Danh mục chi tiêu:</span>
                    <span className="font-semibold">{Object.keys(monthExpenseByCat).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân sách đang theo dõi:</span>
                    <span className="font-semibold">{state.budgets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mục tiêu tài chính:</span>
                    <span className="font-semibold">{state.goals.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Budgets Tab */}
        {tab === "budgets" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">Ngân sách</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                + Thêm ngân sách
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {budgetAnalysis.map(budget => (
                <div key={budget.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{budget.categoryLabel}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Đã chi: {fmt(budget.spent)}</span>
                      <span className="text-gray-600">Ngân sách: {fmt(budget.monthly)}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          budget.percentage > 100 ? 'bg-red-500' : 
                          budget.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{width: `${Math.min(budget.percentage, 100)}%`}}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className={`font-semibold ${
                        budget.remaining < 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {budget.remaining < 0 ? 'Vượt quá' : 'Còn lại'}: {fmt(Math.abs(budget.remaining))}
                      </span>
                      <span className="text-gray-500">{budget.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bills Tab */}
        {tab === "bills" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">Quản lý hóa đơn</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                + Thêm hóa đơn
              </button>
            </div>

            {/* Upcoming Bills Alert */}
            {upcomingBills.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <span>⚠️</span> Hóa đơn sắp đến hạn
                </h3>
                <div className="space-y-2">
                  {upcomingBills.map(bill => (
                    <div key={bill.id} className="flex justify-between items-center bg-white rounded-lg p-3">
                      <div>
                        <div className="font-medium">{bill.name}</div>
                        <div className="text-sm text-gray-600">Đến hạn: {formatDate(bill.dueDate)}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-red-600">{fmt(bill.amount)}</span>
                        <button
                          onClick={() => markBillPaid(bill.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                        >
                          Đã thanh toán
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(state.bills || []).map(bill => (
                <div key={bill.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{bill.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(bill)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(bill.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số tiền:</span>
                      <span className="font-semibold text-red-600">{fmt(bill.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày đến hạn:</span>
                      <span className="font-semibold">{formatDate(bill.dueDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className={`font-semibold ${bill.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                        {bill.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </div>
                    {bill.isPaid && bill.paidDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày thanh toán:</span>
                        <span className="font-semibold text-green-600">{formatDate(bill.paidDate)}</span>
                      </div>
                    )}
                    {!bill.isPaid && (
                      <button
                        onClick={() => markBillPaid(bill.id)}
                        className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Đánh dấu đã thanh toán
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debts Tab */}
        {tab === "debts" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">Nợ & Thẻ tín dụng</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                + Thêm nợ
              </button>
            </div>

            {/* Payment Alerts */}
            {creditCardAlerts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <span>🚨</span> Cảnh báo thanh toán thẻ tín dụng
                </h3>
                <div className="space-y-2">
                  {creditCardAlerts.map(debt => (
                    <div key={debt.id} className="flex justify-between items-center bg-white rounded-lg p-3">
                      <div>
                        <div className="font-medium">{debt.name}</div>
                        <div className="text-sm text-gray-600">Đến hạn: {formatDate(debt.dueDate)}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-red-600">{fmt(debt.minPay)}</span>
                        <span className="text-sm text-gray-500">(Tối thiểu)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {state.debts.map(debt => (
                <div key={debt.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{debt.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(debt)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(debt.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số dư nợ:</span>
                      <span className="font-semibold text-red-600">{fmt(debt.balance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lãi suất:</span>
                      <span className="font-semibold">{debt.apr}%/năm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thanh toán tối thiểu:</span>
                      <span className="font-semibold">{fmt(debt.minPay)}</span>
                    </div>
                    {debt.dueDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày đến hạn:</span>
                        <span className="font-semibold">{formatDate(debt.dueDate)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lãi hàng tháng:</span>
                      <span className="font-semibold text-orange-600">
                        {fmt((debt.balance * debt.apr / 100) / 12)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {tab === "goals" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">Mục tiêu tài chính</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                + Thêm mục tiêu
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {state.goals.map(goal => (
                <div key={goal.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{goal.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Đã tiết kiệm: {fmt(goal.saved)}</span>
                      <span className="text-gray-600">Mục tiêu: {fmt(goal.target)}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all"
                        style={{width: `${Math.min((goal.saved / goal.target) * 100, 100)}%`}}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-blue-600">
                        Còn lại: {fmt(goal.target - goal.saved)}
                      </span>
                      <span className="text-gray-500">
                        {((goal.saved / goal.target) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Banking Tab */}
        {tab === "banking" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">Tài khoản ngân hàng</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                + Thêm tài khoản
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(state.bankAccounts || []).map(account => (
                <div key={account.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{account.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(account)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-semibold">{account.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại tài khoản:</span>
                      <span className="font-semibold">
                        {account.type === 'checking' ? 'Tài khoản thanh toán' : 'Tài khoản tiết kiệm'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số dư:</span>
                      <span className="font-semibold text-green-600">{fmt(account.balance)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Balance Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Tổng số dư tài khoản</h3>
              <div className="text-3xl font-bold">
                {fmt(sum((state.bankAccounts || []).map(a => a.balance)))}
              </div>
              <div className="text-blue-100 text-sm mt-1">
                {(state.bankAccounts || []).length} tài khoản
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {tab === "notifications" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">Thông báo & Nhắc nhở</h2>
              <button
                onClick={clearAllNotifications}
                className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
              >
                Xóa tất cả
              </button>
            </div>

            {/* Active Alerts */}
            <div className="space-y-4">
              {/* Budget Warnings */}
              {budgetWarnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <span>⚠️</span> Cảnh báo ngân sách
                  </h3>
                  <div className="space-y-2">
                    {budgetWarnings.map(budget => (
                      <div key={budget.id} className="bg-white rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{budget.categoryLabel}</span>
                          <span className="text-yellow-600 font-semibold">
                            {budget.percentage.toFixed(1)}% đã sử dụng
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Đã chi: {fmt(budget.spent)} / {fmt(budget.monthly)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Goal Milestones */}
              {goalMilestones.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <span>🎉</span> Mục tiêu đạt được
                  </h3>
                  <div className="space-y-2">
                    {goalMilestones.map(goal => (
                      <div key={goal.id} className="bg-white rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{goal.name}</span>
                          <span className="text-green-600 font-semibold">
                            {((goal.saved / goal.target) * 100).toFixed(0)}% hoàn thành
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {fmt(goal.saved)} / {fmt(goal.target)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification History */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Lịch sử thông báo</h3>
              {(state.notifications || []).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">🔔</span>
                  <p>Chưa có thông báo nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(state.notifications || []).map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 rounded-lg border ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDate(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markNotificationRead(notification.id)}
                            className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Đánh dấu đã đọc
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Cài đặt</h2>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Thông tin ứng dụng</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Phiên bản:</span>
                  <span className="font-semibold">1.0.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng giao dịch:</span>
                  <span className="font-semibold">{state.transactions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dung lượng dữ liệu:</span>
                  <span className="font-semibold">{(JSON.stringify(state).length / 1024).toFixed(2)} KB</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Quản lý dữ liệu</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(state, null, 2);
                    const dataBlob = new Blob([dataStr], {type: 'application/json'});
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'hioney-finance-backup.json';
                    link.click();
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  📥 Xuất dữ liệu
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Bạn có chắc muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!")) {
                      localStorage.removeItem(LS_KEY);
                      window.location.reload();
                    }
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  🗑️ Xóa tất cả dữ liệu
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Sửa' : 'Thêm'} {tab === 'transactions' ? 'giao dịch' : 
               tab === 'budgets' ? 'ngân sách' : 
               tab === 'debts' ? 'nợ' : 'mục tiêu'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {tab === "transactions" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                    <select
                      value={formData.type || ''}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn loại</option>
                      <option value="income">Thu nhập</option>
                      <option value="expense">Chi tiêu</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <input
                      type="text"
                      value={formData.note || ''}
                      onChange={(e) => setFormData({...formData, note: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                    <input
                      type="date"
                      value={formData.date || todayISO()}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {tab === "budgets" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.filter(c => c.id !== 'income').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngân sách hàng tháng</label>
                    <input
                      type="number"
                      value={formData.monthly || ''}
                      onChange={(e) => setFormData({...formData, monthly: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {tab === "debts" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên nợ</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số dư nợ</label>
                    <input
                      type="number"
                      value={formData.balance || ''}
                      onChange={(e) => setFormData({...formData, balance: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lãi suất (%/năm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.apr || ''}
                      onChange={(e) => setFormData({...formData, apr: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thanh toán tối thiểu</label>
                    <input
                      type="number"
                      value={formData.minPay || ''}
                      onChange={(e) => setFormData({...formData, minPay: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {tab === "goals" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên mục tiêu</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mục tiêu</label>
                    <input
                      type="number"
                      value={formData.target || ''}
                      onChange={(e) => setFormData({...formData, target: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đã tiết kiệm</label>
                    <input
                      type="number"
                      value={formData.saved || ''}
                      onChange={(e) => setFormData({...formData, saved: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {tab === "bills" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên hóa đơn</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đến hạn</label>
                    <input
                      type="date"
                      value={formData.dueDate || ''}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {tab === "banking" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên tài khoản</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên ngân hàng</label>
                    <input
                      type="text"
                      value={formData.bankName || ''}
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài khoản</label>
                    <select
                      value={formData.type || ''}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn loại tài khoản</option>
                      <option value="checking">Tài khoản thanh toán</option>
                      <option value="savings">Tài khoản tiết kiệm</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số dư hiện tại</label>
                    <input
                      type="number"
                      value={formData.balance || ''}
                      onChange={(e) => setFormData({...formData, balance: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({});
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <ul className="grid grid-cols-11">
            {TabItems.map((i) => (
              <li key={i.id}>
                <button
                  onClick={() => setTab(i.id)}
                  className={`w-full py-2 px-1 text-xs transition-colors ${
                    tab === i.id
                      ? "font-semibold text-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm">{i.icon}</span>
                    <span className="hidden lg:block text-xs">{i.label}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
