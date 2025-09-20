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
    { id: uid(), name: "Thẻ tín dụng A", balance: 3000000, apr: 28, minPay: 300000 },
  ],
  goals: [
    { id: uid(), name: "Quỹ dự phòng", target: 20000000, saved: 4000000 },
  ],
  settings: { currency: "VND" },
};

// ---------- Main App
export default function PersonalFinanceApp() {
  const [state, setState] = useState(loadState() || seed);
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

  // Tabs
  const TabItems = [
    { id: "dashboard", label: "Tổng quan", icon: "📊" },
    { id: "transactions", label: "Giao dịch", icon: "💸" },
    { id: "charts", label: "Biểu đồ", icon: "📈" },
    { id: "budgets", label: "Ngân sách", icon: "🧾" },
    { id: "debts", label: "Nợ/Thẻ", icon: "💳" },
    { id: "goals", label: "Mục tiêu", icon: "🎯" },
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
                  Hioney Finance
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
          <ul className="grid grid-cols-7">
            {TabItems.map((i) => (
              <li key={i.id}>
                <button
                  onClick={() => setTab(i.id)}
                  className={`w-full py-3 px-2 text-xs sm:text-sm transition-colors ${
                    tab === i.id
                      ? "font-semibold text-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg">{i.icon}</span>
                    <span className="hidden sm:block">{i.label}</span>
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
