// Constants for Hioney Finance App

export const CURRENCY = "VND";

export const NOTIFICATION_TYPES = {
  BILL_REMINDER: 'bill_reminder',
  PAYMENT_ALERT: 'payment_alert',
  BUDGET_WARNING: 'budget_warning',
  GOAL_MILESTONE: 'goal_milestone',
  SPENDING_ALERT: 'spending_alert'
};

export const DEFAULT_CATEGORIES = [
  { id: "food", label: "Ăn uống" },
  { id: "transport", label: "Di chuyển" },
  { id: "bills", label: "Hóa đơn" },
  { id: "rent", label: "Thuê nhà" },
  { id: "shopping", label: "Mua sắm" },
  { id: "health", label: "Sức khỏe" },
  { id: "entertainment", label: "Giải trí" },
  { id: "income", label: "Thu nhập" },
];

// Main navigation tabs (always visible)
export const MAIN_TABS = [
  { id: "dashboard", label: "Tổng quan", icon: "📊" },
  { id: "transactions", label: "Giao dịch", icon: "💸" },
  { id: "analytics", label: "Phân tích", icon: "📈" },
  { id: "more", label: "Thêm", icon: "⋯" }
];

// Secondary tabs (in dropdown menu)
export const SECONDARY_TABS = [
  { id: "charts", label: "Biểu đồ", icon: "📊" },
  { id: "budgets", label: "Ngân sách", icon: "🧾" },
  { id: "bills", label: "Hóa đơn", icon: "📋" },
  { id: "debts", label: "Nợ/Thẻ", icon: "💳" },
  { id: "goals", label: "Mục tiêu", icon: "🎯" },
  { id: "banking", label: "Ngân hàng", icon: "🏦" },
  { id: "notifications", label: "Thông báo", icon: "🔔" },
  { id: "settings", label: "Cài đặt", icon: "⚙️" }
];

// All tabs for backward compatibility
export const TAB_ITEMS = [...MAIN_TABS, ...SECONDARY_TABS];

export const LS_KEY = "pfm_state_v1";

export const CHART_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", 
  "#ef4444", "#8b5cf6", "#06b6d4"
];

