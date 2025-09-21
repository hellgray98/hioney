import React, { useState } from 'react';
import { fmt, formatDate, isUpcoming } from '../utils/helpers';

const Bills = ({ 
  state, 
  addBill, 
  updateBill, 
  deleteBill, 
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
  const [filter, setFilter] = useState("all"); // all, paid, unpaid, upcoming

  const catLabel = (id) => state.categories.find(c => c.id === id)?.label || id;

  // Filter bills
  const filteredBills = state.bills.filter(bill => {
    const matchesQuery = !query || bill.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = 
      filter === "all" || 
      (filter === "paid" && bill.isPaid) ||
      (filter === "unpaid" && !bill.isPaid) ||
      (filter === "upcoming" && !bill.isPaid && isUpcoming(bill.dueDate));
    
    return matchesQuery && matchesFilter;
  });

  // Calculate totals
  const totalBills = state.bills.length;
  const paidBills = state.bills.filter(b => b.isPaid).length;
  const unpaidBills = state.bills.filter(b => !b.isPaid).length;
  const upcomingBills = state.bills.filter(b => !b.isPaid && isUpcoming(b.dueDate)).length;
  const totalAmount = state.bills.reduce((sum, b) => sum + b.amount, 0);
  const paidAmount = state.bills.filter(b => b.isPaid).reduce((sum, b) => sum + b.amount, 0);
  const unpaidAmount = state.bills.filter(b => !b.isPaid).reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header - Minimalist */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Hóa đơn
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Quản lý hóa đơn và thanh toán
        </p>
      </div>

      {/* Search and Filters - Minimalist */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Tìm kiếm hóa đơn..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Tất cả</option>
            <option value="unpaid">Chưa thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="upcoming">Sắp đến hạn</option>
          </select>
        </div>
      </div>

      {/* Bills Overview - Minimalist */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tổng hóa đơn</div>
            <div className="text-3xl font-light text-gray-900 dark:text-gray-100">
              {totalBills}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Đã thanh toán</div>
            <div className="text-3xl font-light text-emerald-600">
              {paidBills}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Chưa thanh toán</div>
            <div className="text-3xl font-light text-red-600">
              {unpaidBills}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Sắp đến hạn</div>
            <div className="text-3xl font-light text-yellow-600">
              {upcomingBills}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: "all", label: "Tất cả", count: totalBills },
          { id: "unpaid", label: "Chưa thanh toán", count: unpaidBills },
          { id: "upcoming", label: "Sắp đến hạn", count: upcomingBills },
          { id: "paid", label: "Đã thanh toán", count: paidBills }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.id
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Bills List */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách hóa đơn</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredBills.map(bill => (
            <div key={bill.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      bill.isPaid ? 'bg-emerald-100' : 
                      isUpcoming(bill.dueDate) ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <span className="text-sm">
                        {bill.isPaid ? '✅' : isUpcoming(bill.dueDate) ? '🔔' : '⏰'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{bill.name}</h4>
                      <div className="text-sm text-gray-500">
                        Đến hạn: {formatDate(bill.dueDate)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">Danh mục: {catLabel(bill.category)}</span>
                    <span className={`font-semibold ${
                      bill.isPaid ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {fmt(bill.amount)}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {!bill.isPaid && (
                    <button
                      onClick={() => updateBill(bill.id, { isPaid: true })}
                      className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
                    >
                      Đánh dấu đã thanh toán
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(bill)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    title="Sửa hóa đơn"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(bill.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Xóa hóa đơn"
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

export default Bills;
