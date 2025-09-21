import React, { useState } from 'react';
import { fmt } from '../utils/helpers';

const Banking = ({ 
  state, 
  addBankAccount, 
  updateBankAccount, 
  deleteBankAccount, 
  showAddForm, 
  setShowAddForm,
  editingItem,
  setEditingItem,
  formData,
  setFormData,
  handleFormSubmit,
  handleEdit,
  handleDelete
}) => {
  const [query, setQuery] = useState("");

  // Calculate banking overview
  const totalBalance = state.bankAccounts.reduce((sum, a) => sum + a.balance, 0);
  const checkingAccounts = state.bankAccounts.filter(a => a.type === 'checking');
  const savingsAccounts = state.bankAccounts.filter(a => a.type === 'savings');
  const totalChecking = checkingAccounts.reduce((sum, a) => sum + a.balance, 0);
  const totalSavings = savingsAccounts.reduce((sum, a) => sum + a.balance, 0);

  // Get unique banks
  const uniqueBanks = [...new Set(state.bankAccounts.map(a => a.bankName))];

  return (
    <div className="space-y-8">
      {/* Header - Minimalist */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Tài khoản ngân hàng
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Quản lý tài khoản ngân hàng
        </p>
      </div>

      {/* Search Bar - Minimalist */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Tìm kiếm tài khoản..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Banking Overview - Minimalist */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tổng số dư</div>
            <div className="text-3xl font-light text-emerald-600">
              {fmt(totalBalance)}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Tài khoản thanh toán</div>
            <div className="text-3xl font-light text-blue-600">
              {fmt(totalChecking)}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Tài khoản tiết kiệm</div>
            <div className="text-3xl font-light text-purple-600">
              {fmt(totalSavings)}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ngân hàng</div>
            <div className="text-3xl font-light text-yellow-600">
              {uniqueBanks.length}
            </div>
          </div>
        </div>
      </div>

      {/* Bank Summary - Minimalist */}
      {uniqueBanks.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-6 text-center">Tổng quan theo ngân hàng</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueBanks.map(bank => {
              const bankAccounts = state.bankAccounts.filter(a => a.bankName === bank);
              const bankBalance = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
              
              return (
                <div key={bank} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🏦</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{bank}</h4>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {bankAccounts.length} tài khoản
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                    {fmt(bankBalance)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accounts List - Minimalist */}
      <div className="space-y-4">
        {state.bankAccounts.filter(a => {
          const q = query.toLowerCase();
          return !q || a.name.toLowerCase().includes(q) || a.bankName.toLowerCase().includes(q);
        }).map(account => (
          <div key={account.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    account.type === 'checking' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-purple-100 dark:bg-purple-900/20'
                  }`}>
                    <span className="text-lg">
                      {account.type === 'checking' ? '💳' : '💎'}
                    </span>
                  </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{account.name}</h4>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {account.bankName} • {account.type === 'checking' ? 'Thanh toán' : 'Tiết kiệm'}
                      </div>
                    </div>
                </div>
                
                <div className="text-2xl font-light text-emerald-600 dark:text-emerald-400">
                  {fmt(account.balance)}
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(account)}
                  className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all duration-200"
                  title="Sửa tài khoản"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all duration-200"
                  title="Xóa tài khoản"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banking;
