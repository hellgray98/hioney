// Helper functions for Hioney Finance App

export const fmt = (n) => new Intl.NumberFormat("vi-VN", { 
  style: "currency", 
  currency: "VND", 
  maximumFractionDigits: 0 
}).format(n || 0);

export const sum = (arr) => arr.reduce((a, b) => a + b, 0);

export const uid = () => Math.random().toString(36).slice(2, 9);

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN');

export const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

export const getLastNMonths = (n) => {
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push(date.toISOString().slice(0, 7));
  }
  return months;
};

export const isUpcoming = (date, days = 7) => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= days;
};

export const calculateSavingsRate = (income, expense) => {
  return income > 0 ? ((income - expense) / income) * 100 : 0;
};

export const getProgressColor = (percentage) => {
  if (percentage > 100) return 'bg-red-500';
  if (percentage > 80) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const getSavingsRateColor = (rate) => {
  if (rate >= 20) return 'text-green-600';
  if (rate >= 10) return 'text-yellow-600';
  return 'text-red-600';
};

