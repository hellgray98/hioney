// Custom hook for analytics calculations

import { useMemo } from 'react';
import { sum, getCurrentMonth, getLastNMonths } from '../utils/helpers';

export const useAnalytics = (state) => {
  // Basic calculations
  const incomeTotal = useMemo(() => 
    sum(state.transactions.filter(t => t.type === "income").map(t => t.amount)), 
    [state.transactions]
  );

  const expenseTotal = useMemo(() => 
    sum(state.transactions.filter(t => t.type === "expense").map(t => t.amount)), 
    [state.transactions]
  );

  const balance = incomeTotal - expenseTotal;

  const currentMonth = getCurrentMonth();
  const monthTx = state.transactions.filter(t => t.date?.slice(0, 7) === currentMonth);

  // Monthly expense by category
  const monthExpenseByCat = useMemo(() => {
    const m = {};
    for (const t of monthTx) {
      if (t.type !== "expense") continue;
      m[t.category] = (m[t.category] || 0) + t.amount;
    }
    return m;
  }, [state.transactions]);

  // Budget analysis
  const budgetAnalysis = useMemo(() => {
    return state.budgets.map(budget => {
      const spent = monthExpenseByCat[budget.category] || 0;
      const remaining = budget.monthly - spent;
      const percentage = (spent / budget.monthly) * 100;
      return {
        ...budget,
        spent,
        remaining,
        percentage: Math.min(percentage, 100),
        categoryLabel: state.categories.find(c => c.id === budget.category)?.label || budget.category
      };
    });
  }, [state.budgets, monthExpenseByCat, state.categories]);

  // Spending trends (6 months)
  const spendingTrends = useMemo(() => {
    const trends = {};
    const last6Months = getLastNMonths(6);

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

  // Category analysis (3 months)
  const categoryAnalysis = useMemo(() => {
    const analysis = {};
    const last3Months = getLastNMonths(3);

    last3Months.forEach(month => {
      const monthTransactions = state.transactions.filter(t => 
        t.date?.slice(0, 7) === month && t.type === 'expense'
      );
      
      monthTransactions.forEach(t => {
        if (!analysis[t.category]) {
          analysis[t.category] = {
            category: t.category,
            categoryLabel: state.categories.find(c => c.id === t.category)?.label || t.category,
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
  }, [state.transactions, state.categories]);

  // Charts data
  const pieData = useMemo(() => 
    Object.keys(monthExpenseByCat).map(cat => ({ 
      name: state.categories.find(c => c.id === cat)?.label || cat, 
      value: monthExpenseByCat[cat] 
    })), 
    [monthExpenseByCat, state.categories]
  );

  const lineData = useMemo(() => {
    const months = {};
    for (const t of state.transactions) {
      const ym = t.date.slice(0, 7);
      if (!months[ym]) months[ym] = { month: ym, income: 0, expense: 0 };
      if (t.type === "income") months[ym].income += t.amount;
      if (t.type === "expense") months[ym].expense += t.amount;
    }
    return Object.keys(months).sort().map(k => months[k]);
  }, [state.transactions]);

  return {
    // Basic stats
    incomeTotal,
    expenseTotal,
    balance,
    currentMonth,
    monthTx,
    
    // Analysis
    monthExpenseByCat,
    budgetAnalysis,
    spendingTrends,
    categoryAnalysis,
    
    // Charts
    pieData,
    lineData,
  };
};

