import React, { useState } from 'react';
import { fmt } from '../utils/helpers';

const Wallets = ({ 
  state, 
  addWallet, 
  updateWallet, 
  deleteWallet, 
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

  // Filter wallets
  const filteredWallets = state.wallets.filter(wallet => 
    !query || 
    wallet.name.toLowerCase().includes(query.toLowerCase()) ||
    wallet.type.toLowerCase().includes(query.toLowerCase())
  );

  // Calculate total balance
  const totalBalance = state.wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

  return (
    <div className="space-y-8">
      {/* Header - Minimalist */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Quản lý ví
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Quản lý các tài khoản và ví của bạn
        </p>
      </div>

      {/* Total Balance */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tổng số dư</div>
        <div className="text-4xl font-light text-gray-900 dark:text-gray-100">
          {fmt(totalBalance)}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Tìm kiếm ví..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Wallets List */}
      <div className="space-y-4">
        {filteredWallets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Chưa có ví nào</h3>
            <p className="text-gray-500 dark:text-gray-400">Thêm ví đầu tiên để bắt đầu quản lý tài chính</p>
          </div>
        ) : (
          filteredWallets.map((wallet) => (
            <div key={wallet.id} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Wallet Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    wallet.type === 'cash' ? 'bg-green-100 dark:bg-green-900/20' :
                    wallet.type === 'bank' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    wallet.type === 'credit' ? 'bg-red-100 dark:bg-red-900/20' :
                    wallet.type === 'savings' ? 'bg-purple-100 dark:bg-purple-900/20' :
                    'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <span className="text-lg">
                      {wallet.type === 'cash' ? '💵' :
                       wallet.type === 'bank' ? '🏦' :
                       wallet.type === 'credit' ? '💳' :
                       wallet.type === 'savings' ? '💰' :
                       '💼'}
                    </span>
                  </div>

                  {/* Wallet Info */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{wallet.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {wallet.type === 'cash' ? 'Tiền mặt' :
                       wallet.type === 'bank' ? 'Tài khoản ngân hàng' :
                       wallet.type === 'credit' ? 'Thẻ tín dụng' :
                       wallet.type === 'savings' ? 'Tài khoản tiết kiệm' :
                       wallet.type}
                    </p>
                  </div>
                </div>

                {/* Balance and Actions */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-xl font-light ${
                      wallet.balance >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-500'
                    }`}>
                      {fmt(wallet.balance)}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(wallet)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                      title="Sửa ví"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(wallet.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      title="Xóa ví"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Wallets;
