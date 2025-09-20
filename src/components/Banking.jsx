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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tài khoản ngân hàng</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý tài khoản</p>
        </div>
        <div className="flex gap-3">
          <input
            className="flex-1 sm:w-64 input-field"
            placeholder="Tìm kiếm tài khoản..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Banking Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tổng số dư</div>
              <div className="text-lg font-bold text-emerald-600">{fmt(totalBalance)}</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏦</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tài khoản thanh toán</div>
              <div className="text-lg font-bold text-blue-600">{fmt(totalChecking)}</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">💎</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tài khoản tiết kiệm</div>
              <div className="text-lg font-bold text-purple-600">{fmt(totalSavings)}</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">🏛️</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Ngân hàng</div>
              <div className="text-lg font-bold text-yellow-600">{uniqueBanks.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Summary */}
      {uniqueBanks.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng quan theo ngân hàng</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueBanks.map(bank => {
              const bankAccounts = state.bankAccounts.filter(a => a.bankName === bank);
              const bankBalance = bankAccounts.reduce((sum, a) => sum + a.balance, 0);
              
              return (
                <div key={bank} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🏦</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{bank}</h4>
                      <div className="text-sm text-gray-500">
                        {bankAccounts.length} tài khoản
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-emerald-600">
                    {fmt(bankBalance)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accounts List */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách tài khoản</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {state.bankAccounts.filter(a => {
            const q = query.toLowerCase();
            return !q || a.name.toLowerCase().includes(q) || a.bankName.toLowerCase().includes(q);
          }).map(account => (
            <div key={account.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      account.type === 'checking' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      <span className="text-sm">
                        {account.type === 'checking' ? '💳' : '💎'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{account.name}</h4>
                      <div className="text-sm text-gray-500">
                        {account.bankName} • {account.type === 'checking' ? 'Thanh toán' : 'Tiết kiệm'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-lg font-bold text-emerald-600">
                    {fmt(account.balance)}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(account)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Sửa tài khoản"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Xóa tài khoản"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banking;
