import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Default categories for new users
const defaultCategories = [
  { id: 'income-salary', name: 'Lương', icon: '💰', color: '#10b981', type: 'income' },
  { id: 'income-bonus', name: 'Thưởng', icon: '🎁', color: '#059669', type: 'income' },
  { id: 'income-investment', name: 'Đầu tư', icon: '📈', color: '#047857', type: 'income' },
  { id: 'expense-food', name: 'Ăn uống', icon: '🍜', color: '#ef4444', type: 'expense' },
  { id: 'expense-transport', name: 'Di chuyển', icon: '🚗', color: '#f97316', type: 'expense' },
  { id: 'expense-shopping', name: 'Mua sắm', icon: '🛒', color: '#8b5cf6', type: 'expense' },
  { id: 'expense-entertainment', name: 'Giải trí', icon: '🎬', color: '#06b6d4', type: 'expense' },
  { id: 'expense-healthcare', name: 'Y tế', icon: '🏥', color: '#ec4899', type: 'expense' },
  { id: 'expense-bills', name: 'Hóa đơn', icon: '📄', color: '#6366f1', type: 'expense' },
  { id: 'expense-other', name: 'Khác', icon: '📝', color: '#6b7280', type: 'expense' }
];

const initialState = {
  transactions: [],
  categories: defaultCategories,
  budgets: [],
  balance: 0
};

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from Firestore
  useEffect(() => {
    if (!currentUser) {
      setData(initialState);
      setLoading(false);
      return;
    }

    const userDataRef = doc(db, 'userData', currentUser.uid);
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(userDataRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setData({
          transactions: userData.transactions || [],
          categories: userData.categories || defaultCategories,
          budgets: userData.budgets || [],
          balance: userData.balance || 0
        });
      } else {
        // Initialize user data if doesn't exist
        initializeUserData();
      }
      setLoading(false);
    }, (error) => {
      console.error('Error listening to user data:', error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Initialize user data in Firestore
  const initializeUserData = async () => {
    if (!currentUser) return;

    try {
      const userDataRef = doc(db, 'userData', currentUser.uid);
      await setDoc(userDataRef, {
        ...initialState,
        categories: defaultCategories,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error initializing user data:', error);
      setError(error.message);
    }
  };

  // Update user data in Firestore
  const updateUserData = async (updates) => {
    if (!currentUser) return;

    try {
      const userDataRef = doc(db, 'userData', currentUser.uid);
      await updateDoc(userDataRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      setError(error.message);
      throw error;
    }
  };

  // Calculate balance from transactions
  const calculateBalance = (transactions) => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);
  };

  // Add transaction
  const addTransaction = async (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const newTransactions = [...data.transactions, newTransaction];
    const newBalance = calculateBalance(newTransactions);

    await updateUserData({
      transactions: newTransactions,
      balance: newBalance
    });
  };

  // Update transaction
  const updateTransaction = async (id, updatedTransaction) => {
    const newTransactions = data.transactions.map(t => 
      t.id === id ? { ...t, ...updatedTransaction, updatedAt: new Date().toISOString() } : t
    );
    const newBalance = calculateBalance(newTransactions);

    await updateUserData({
      transactions: newTransactions,
      balance: newBalance
    });
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    const newTransactions = data.transactions.filter(t => t.id !== id);
    const newBalance = calculateBalance(newTransactions);

    await updateUserData({
      transactions: newTransactions,
      balance: newBalance
    });
  };

  // Add category
  const addCategory = async (category) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const newCategories = [...data.categories, newCategory];

    await updateUserData({
      categories: newCategories
    });
  };

  // Update category
  const updateCategory = async (id, updatedCategory) => {
    const newCategories = data.categories.map(c => 
      c.id === id ? { ...c, ...updatedCategory, updatedAt: new Date().toISOString() } : c
    );

    await updateUserData({
      categories: newCategories
    });
  };

  // Delete category
  const deleteCategory = async (id) => {
    // Don't delete if category is being used in transactions or budgets
    const isUsedInTransactions = data.transactions.some(t => t.categoryId === id);
    const isUsedInBudgets = data.budgets.some(b => b.categoryId === id);

    if (isUsedInTransactions || isUsedInBudgets) {
      throw new Error('Không thể xóa danh mục đang được sử dụng');
    }

    const newCategories = data.categories.filter(c => c.id !== id);

    await updateUserData({
      categories: newCategories
    });
  };

  // Add budget
  const addBudget = async (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    const newBudgets = [...data.budgets, newBudget];

    await updateUserData({
      budgets: newBudgets
    });
  };

  // Update budget
  const updateBudget = async (id, updatedBudget) => {
    const newBudgets = data.budgets.map(b => 
      b.id === id ? { ...b, ...updatedBudget, updatedAt: new Date().toISOString() } : b
    );

    await updateUserData({
      budgets: newBudgets
    });
  };

  // Delete budget
  const deleteBudget = async (id) => {
    const newBudgets = data.budgets.filter(b => b.id !== id);

    await updateUserData({
      budgets: newBudgets
    });
  };

  // Export data
  const exportData = () => {
    const dataToExport = {
      ...data,
      exportedAt: new Date().toISOString(),
      user: {
        email: currentUser?.email,
        displayName: currentUser?.displayName
      }
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hioney-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import data
  const importData = async (importedData) => {
    try {
      // Validate imported data structure
      if (!importedData.transactions || !importedData.categories) {
        throw new Error('Dữ liệu không hợp lệ');
      }

      // Merge with existing data
      const mergedTransactions = [...data.transactions, ...importedData.transactions];
      const mergedCategories = [...data.categories];
      
      // Add new categories that don't exist
      importedData.categories.forEach(importedCat => {
        if (!mergedCategories.find(cat => cat.id === importedCat.id)) {
          mergedCategories.push(importedCat);
        }
      });

      const mergedBudgets = [...data.budgets, ...(importedData.budgets || [])];
      const newBalance = calculateBalance(mergedTransactions);

      await updateUserData({
        transactions: mergedTransactions,
        categories: mergedCategories,
        budgets: mergedBudgets,
        balance: newBalance
      });

      return { success: true, message: 'Dữ liệu đã được nhập thành công' };
    } catch (error) {
      console.error('Error importing data:', error);
      return { success: false, message: error.message };
    }
  };

  // Clear all data
  const clearAllData = async () => {
    await updateUserData({
      transactions: [],
      categories: defaultCategories,
      budgets: [],
      balance: 0
    });
  };

  const value = {
    data,
    loading,
    error,
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

export default DataContext;
