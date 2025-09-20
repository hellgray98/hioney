// Custom hook for managing finance data

import { useState, useEffect, useMemo } from 'react';
import { loadState, saveState } from '../utils/storage';
import { migrateState } from '../utils/seedData';
import { uid } from '../utils/helpers';

export const useFinanceData = () => {
  const [state, setState] = useState(() => {
    const loadedState = loadState();
    return migrateState(loadedState);
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

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

  return {
    state,
    setState,
    // Transaction methods
    addTransaction,
    updateTransaction,
    deleteTransaction,
    // Budget methods
    addBudget,
    updateBudget,
    deleteBudget,
    // Debt methods
    addDebt,
    updateDebt,
    deleteDebt,
    // Goal methods
    addGoal,
    updateGoal,
    deleteGoal,
    // Bill methods
    addBill,
    updateBill,
    deleteBill,
    // Bank account methods
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
  };
};

