import React, { memo } from 'react';
import { fmt, formatDate } from '../utils/helpers';

const Dashboard = memo(({ analytics, state }) => {
  const { incomeTotal, expenseTotal, balance, currentMonth, monthTx } = analytics;
  
  // Calculate total balance from wallets
  const totalWalletBalance = state.wallets ? state.wallets.reduce((sum, wallet) => sum + wallet.balance, 0) : 0;
  
  // Get recent transactions (last 5)
  const recentTransactions = state.transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  // Helper function to get category label
  const catLabel = (id) => state.categories.find(c => c.id === id)?.label || id;
  
  // Helper function to get wallet name
  const walletName = (id) => state.wallets?.find(w => w.id === id)?.name || 'Không xác định';

  // Calculate additional financial data
  const totalBankBalance = state.bankAccounts ? state.bankAccounts.reduce((sum, account) => sum + account.balance, 0) : 0;
  const totalDebt = state.debts ? state.debts.reduce((sum, debt) => sum + debt.balance, 0) : 0;
  const totalBudget = state.budgets ? state.budgets.reduce((sum, budget) => sum + budget.monthly, 0) : 0;
  const totalGoalTarget = state.goals ? state.goals.reduce((sum, goal) => sum + goal.target, 0) : 0;
  const totalGoalSaved = state.goals ? state.goals.reduce((sum, goal) => sum + goal.saved, 0) : 0;
  
  // Calculate budget analysis
  const budgetAnalysis = state.budgets ? state.budgets.map(budget => {
    const spent = state.transactions
      .filter(t => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      ...budget,
      spent,
      remaining: budget.monthly - spent
    };
  }) : [];
  
  const totalBudgetSpent = budgetAnalysis.reduce((sum, b) => sum + b.spent, 0);
  const totalBudgetRemaining = budgetAnalysis.reduce((sum, b) => sum + b.remaining, 0);
  
  // Calculate bills analysis
  const totalBills = state.bills ? state.bills.length : 0;
  const paidBills = state.bills ? state.bills.filter(bill => bill.paid).length : 0;
  const unpaidBills = totalBills - paidBills;
  
  // Calculate goals analysis
  const completedGoals = state.goals ? state.goals.filter(goal => goal.saved >= goal.target).length : 0;
  const overallProgress = totalGoalTarget > 0 ? (totalGoalSaved / totalGoalTarget) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Section - Minimalist Style */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">
          Tổng quan tài chính
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {new Date().toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Financial Overview - Comprehensive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Assets */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Tổng tài sản</div>
            <div className={`text-3xl font-light ${(totalWalletBalance + totalBankBalance) >= 0 ? 'text-gray-900 dark:text-gray-100' : 'text-red-500'}`}>
              {fmt(totalWalletBalance + totalBankBalance)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Ví: {totalWalletBalance >= 1000000 ? `${(totalWalletBalance / 1000000).toFixed(1)}M ₫` : fmt(totalWalletBalance)} • 
              NH: {totalBankBalance >= 1000000 ? `${(totalBankBalance / 1000000).toFixed(1)}M ₫` : fmt(totalBankBalance)}
            </div>
          </div>
        </div>
        
        {/* Total Debt */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Tổng nợ</div>
            <div className="text-3xl font-light text-red-600">
              {fmt(totalDebt)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {state.debts ? state.debts.length : 0} khoản nợ
            </div>
          </div>
        </div>
        
        {/* Net Worth */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Tài sản ròng</div>
            <div className={`text-3xl font-light ${(totalWalletBalance + totalBankBalance - totalDebt) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {fmt(totalWalletBalance + totalBankBalance - totalDebt)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Tài sản - Nợ
            </div>
          </div>
        </div>
        
        {/* Monthly Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-words">Giao dịch tháng</div>
            <div className="text-3xl font-light text-gray-900 dark:text-gray-100">{monthTx.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Thu: {incomeTotal >= 1000000 ? `${(incomeTotal / 1000000).toFixed(1)}M ₫` : fmt(incomeTotal)} • 
              Chi: {expenseTotal >= 1000000 ? `${(expenseTotal / 1000000).toFixed(1)}M ₫` : fmt(expenseTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* Budget & Goals Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Overview */}
        {state.budgets && state.budgets.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-6 text-center">Ngân sách tháng này</h3>
            <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Tổng ngân sách</span>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-xs truncate ml-2" title={fmt(totalBudget)}>
                {totalBudget >= 1000000000 ? `${(totalBudget / 1000000000).toFixed(1)}B ₫` : 
                 totalBudget >= 1000000 ? `${(totalBudget / 1000000).toFixed(1)}M ₫` : 
                 fmt(totalBudget)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Đã chi tiêu</span>
              <span className="font-bold text-red-600 text-xs truncate ml-2" title={fmt(totalBudgetSpent)}>
                {totalBudgetSpent >= 1000000000 ? `${(totalBudgetSpent / 1000000000).toFixed(1)}B ₫` : 
                 totalBudgetSpent >= 1000000 ? `${(totalBudgetSpent / 1000000).toFixed(1)}M ₫` : 
                 fmt(totalBudgetSpent)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Còn lại</span>
              <span className={`font-bold text-xs truncate ml-2 ${totalBudgetRemaining >= 0 ? 'text-emerald-600' : 'text-red-600'}`} title={fmt(totalBudgetRemaining)}>
                {totalBudgetRemaining >= 1000000000 ? `${(totalBudgetRemaining / 1000000000).toFixed(1)}B ₫` : 
                 totalBudgetRemaining >= 1000000 ? `${(totalBudgetRemaining / 1000000).toFixed(1)}M ₫` : 
                 fmt(totalBudgetRemaining)}
              </span>
            </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    totalBudgetSpent > totalBudget ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{width: `${Math.min((totalBudgetSpent / totalBudget) * 100, 100)}%`}}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Goals Overview */}
        {state.goals && state.goals.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-6 text-center">Mục tiêu tài chính</h3>
            <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Tổng mục tiêu</span>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-xs truncate ml-2" title={fmt(totalGoalTarget)}>
                {totalGoalTarget >= 1000000000 ? `${(totalGoalTarget / 1000000000).toFixed(1)}B ₫` : 
                 totalGoalTarget >= 1000000 ? `${(totalGoalTarget / 1000000).toFixed(1)}M ₫` : 
                 fmt(totalGoalTarget)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Đã tiết kiệm</span>
              <span className="font-bold text-emerald-600 text-xs truncate ml-2" title={fmt(totalGoalSaved)}>
                {totalGoalSaved >= 1000000000 ? `${(totalGoalSaved / 1000000000).toFixed(1)}B ₫` : 
                 totalGoalSaved >= 1000000 ? `${(totalGoalSaved / 1000000).toFixed(1)}M ₫` : 
                 fmt(totalGoalSaved)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Đã hoàn thành</span>
              <span className="font-bold text-blue-600 text-xs truncate ml-2">{completedGoals}/{state.goals.length}</span>
            </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{width: `${Math.min(overallProgress, 100)}%`}}
                ></div>
              </div>
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                {overallProgress.toFixed(1)}% hoàn thành
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bills & Notifications Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bills Overview */}
        {state.bills && state.bills.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-6 text-center">Hóa đơn</h3>
            <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Tổng hóa đơn</span>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-xs truncate ml-2">{totalBills}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Đã thanh toán</span>
              <span className="font-bold text-emerald-600 text-xs truncate ml-2">{paidBills}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Chưa thanh toán</span>
              <span className="font-bold text-red-600 text-xs truncate ml-2">{unpaidBills}</span>
            </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{width: `${totalBills > 0 ? (paidBills / totalBills) * 100 : 0}%`}}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-6 text-center">Thống kê nhanh</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tổng ví</span>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-xs">{state.wallets ? state.wallets.length : 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Tài khoản NH</span>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-xs">{state.bankAccounts ? state.bankAccounts.length : 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Danh mục</span>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-xs">{state.categories ? state.categories.length : 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 break-words">Thông báo</span>
              <span className="font-bold text-yellow-600 text-xs">
                {state.notifications ? state.notifications.filter(n => !n.read).length : 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section - Minimalist Style */}
      {recentTransactions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-6 text-center">
            Giao dịch gần đây
          </h3>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Transaction Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    transaction.type === 'income' 
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' 
                      : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    <span className="text-lg">
                      {transaction.type === 'income' ? '💰' : '💸'}
                    </span>
                  </div>

                  {/* Transaction Info */}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {transaction.note}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {catLabel(transaction.category)} • {walletName(transaction.walletId)}
                    </div>
                  </div>
                </div>

                {/* Amount and Date */}
                <div className="text-right">
                  <div className={`font-medium text-sm ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{fmt(transaction.amount)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;

