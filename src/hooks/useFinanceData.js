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

  const addWallet = (wallet) => {
    setState(prev => ({
      ...prev,
      wallets: [...prev.wallets, { ...wallet, id: uid() }]
    }));
  };

  const updateWallet = (id, updates) => {
    setState(prev => ({
      ...prev,
      wallets: prev.wallets.map(w => w.id === id ? { ...w, ...updates } : w)
    }));
  };

  const deleteWallet = (id) => {
    setState(prev => ({
      ...prev,
      wallets: prev.wallets.filter(w => w.id !== id)
    }));
  };

  const markNotificationAsRead = (id) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    }));
  };

  const deleteNotification = (id) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  };

  const markAllNotificationsAsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  // Load user-specific data from cloud
  const loadUserData = (cloudData) => {
    if (cloudData) {
      const userData = {
        wallets: cloudData.wallets || [],
        transactions: cloudData.transactions || [],
        budgets: cloudData.budgets || [],
        debts: cloudData.debts || [],
        goals: cloudData.goals || [],
        bills: cloudData.bills || [],
        bankAccounts: cloudData.bankAccounts || [],
        notifications: cloudData.notifications || [],
        settings: cloudData.settings || state.settings
      };
      setState(userData);
    }
  };

  return {
    state,
    setState,
    loadUserData,
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
    // Wallet methods
    addWallet,
    updateWallet,
    deleteWallet,
    // Notification methods
    markNotificationAsRead,
    deleteNotification,
    markAllNotificationsAsRead,
  };
};


