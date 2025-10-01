import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadData, saveData } from '../utils/storage';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Danh mục mặc định
const defaultCategories = [
  { id: '1', name: 'Ăn uống', icon: '🍽️', color: '#FF6B6B', type: 'expense' },
  { id: '2', name: 'Đi lại', icon: '🚗', color: '#4ECDC4', type: 'expense' },
  { id: '3', name: 'Hóa đơn', icon: '📄', color: '#45B7D1', type: 'expense' },
  { id: '4', name: 'Giải trí', icon: '🎮', color: '#96CEB4', type: 'expense' },
  { id: '5', name: 'Mua sắm', icon: '🛍️', color: '#FFEAA7', type: 'expense' },
  { id: '6', name: 'Y tế', icon: '🏥', color: '#DDA0DD', type: 'expense' },
  { id: '7', name: 'Lương', icon: '💰', color: '#98D8C8', type: 'income' },
  { id: '8', name: 'Thưởng', icon: '🎁', color: '#F7DC6F', type: 'income' },
  { id: '9', name: 'Đầu tư', icon: '📈', color: '#BB8FCE', type: 'income' },
  { id: '10', name: 'Khác', icon: '📝', color: '#85C1E9', type: 'both' }
];

const initialState = {
  transactions: [],
  categories: defaultCategories,
  budgets: [],
  balance: 0
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(initialState);

  // Load data on mount
  useEffect(() => {
    const savedData = loadData();
    if (savedData) {
      setData(prevData => ({
        ...prevData,
        ...savedData,
        // Ensure categories always exist
        categories: savedData.categories || defaultCategories
      }));
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Calculate balance
  useEffect(() => {
    const balance = data.transactions.reduce((total, transaction) => {
      return total + (transaction.type === 'income' ? transaction.amount : -transaction.amount);
    }, 0);
    setData(prev => ({ ...prev, balance }));
  }, [data.transactions]);

  // Transaction methods
  const addTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }));
  };

  const updateTransaction = (id, updates) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      )
    }));
  };

  const deleteTransaction = (id) => {
    setData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id)
    }));
  };

  // Category methods
  const addCategory = (category) => {
    const newCategory = {
      id: Date.now().toString(),
      ...category
    };
    setData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
  };

  const updateCategory = (id, updates) => {
    setData(prev => ({
      ...prev,
      categories: prev.categories.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  };

  const deleteCategory = (id) => {
    // Don't allow deleting if there are transactions using this category
    const hasTransactions = data.transactions.some(t => t.categoryId === id);
    if (hasTransactions) {
      alert('Không thể xóa danh mục đang được sử dụng!');
      return false;
    }
    
    setData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
    return true;
  };

  // Budget methods
  const addBudget = (budget) => {
    const newBudget = {
      id: Date.now().toString(),
      ...budget
    };
    setData(prev => ({
      ...prev,
      budgets: [...prev.budgets, newBudget]
    }));
  };

  const updateBudget = (id, updates) => {
    setData(prev => ({
      ...prev,
      budgets: prev.budgets.map(b => 
        b.id === id ? { ...b, ...updates } : b
      )
    }));
  };

  const deleteBudget = (id) => {
    setData(prev => ({
      ...prev,
      budgets: prev.budgets.filter(b => b.id !== id)
    }));
  };

  // Export/Import methods
  const exportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hioney-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (importedData) => {
    setData(prevData => ({
      ...prevData,
      ...importedData,
      categories: importedData.categories || defaultCategories
    }));
  };

  const clearAllData = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!')) {
      setData(initialState);
    }
  };

  const value = {
    data,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    exportData,
    importData,
    clearAllData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
