import React, { useState } from 'react';
import { fmt, formatDate, isUpcoming } from '../utils/helpers';

const Debts = ({ 
  state, 
  addDebt, 
  updateDebt, 
  deleteDebt, 
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

  // Calculate debt analysis
  const totalDebt = state.debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPayment = state.debts.reduce((sum, d) => sum + d.minPay, 0);
  const avgAPR = state.debts.length > 0 ? 
    state.debts.reduce((sum, d) => sum + d.apr, 0) / state.debts.length : 0;

  // Calculate monthly interest
  const monthlyInterest = state.debts.reduce((sum, d) => {
    return sum + (d.balance * d.apr / 100 / 12);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Nợ & Thẻ tín dụng</h2>
          <p className="text-sm text-gray-600 mt-1">Quản lý nợ</p>
        </div>
        <div className="flex gap-3">
          <input
            className="flex-1 sm:w-64 input-field"
            placeholder="Tìm kiếm nợ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Debt Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">💳</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tổng nợ</div>
              <div className="text-lg font-bold text-red-600">{fmt(totalDebt)}</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Thanh toán tối thiểu</div>
              <div className="text-lg font-bold text-blue-600">{fmt(totalMinPayment)}</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">📈</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Lãi suất TB</div>
              <div className="text-lg font-bold text-yellow-600">{avgAPR.toFixed(1)}%</div>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <div className="text-sm text-gray-500">Lãi hàng tháng</div>
              <div className="text-lg font-bold text-purple-600">{fmt(monthlyInterest)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Alerts */}
      {state.debts.filter(d => d.dueDate && isUpcoming(d.dueDate)).length > 0 && (
        <div className="card p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🔔</span>
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800">Cảnh báo thanh toán</h3>
              <p className="text-sm text-yellow-700">
                Bạn có {state.debts.filter(d => d.dueDate && isUpcoming(d.dueDate)).length} khoản nợ sắp đến hạn thanh toán
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Debts List */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách nợ</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {state.debts.filter(d => {
            const q = query.toLowerCase();
            return !q || d.name.toLowerCase().includes(q);
          }).map(debt => (
            <div key={debt.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">💳</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{debt.name}</h4>
                      <div className="text-sm text-gray-500">
                        Lãi suất: {debt.apr}%/năm
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Số dư nợ</div>
                      <div className="font-semibold text-red-600">{fmt(debt.balance)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Thanh toán tối thiểu</div>
                      <div className="font-semibold text-blue-600">{fmt(debt.minPay)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Lãi hàng tháng</div>
                      <div className="font-semibold text-yellow-600">
                        {fmt(debt.balance * debt.apr / 100 / 12)}
                      </div>
                    </div>
                    {debt.dueDate && (
                      <div>
                        <div className="text-gray-500">Ngày đến hạn</div>
                        <div className={`font-semibold ${
                          isUpcoming(debt.dueDate) ? 'text-yellow-600' : 'text-gray-900'
                        }`}>
                          {formatDate(debt.dueDate)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(debt)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Sửa nợ"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(debt.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Xóa nợ"
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

export default Debts;
