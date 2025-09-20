import React, { useState } from 'react';
import { useFinanceData } from './hooks/useFinanceData';
import { useAnalytics } from './hooks/useAnalytics';
import { NOTIFICATION_TYPES } from './constants';
import { uid } from './utils/helpers';

// Components
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Charts from './components/Charts';
import Analytics from './components/Analytics';
import FormModal from './components/FormModal';
import PWAStatus from './components/PWAStatus';
import Budgets from './components/Budgets';
import Bills from './components/Bills';
import Debts from './components/Debts';
import Goals from './components/Goals';
import Banking from './components/Banking';

// Import actual components
import Notifications from './components/Notifications';
import Settings from './components/Settings';

export default function PersonalFinanceApp() {
  const [tab, setTab] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Custom hooks
  const financeData = useFinanceData();
  const analytics = useAnalytics(financeData.state);

  // Form handlers
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (tab === "transactions") {
      if (editingItem) {
        financeData.updateTransaction(editingItem.id, formData);
      } else {
        financeData.addTransaction(formData);
      }
    } else if (tab === "budgets") {
      if (editingItem) {
        financeData.updateBudget(editingItem.id, formData);
      } else {
        financeData.addBudget(formData);
      }
    } else if (tab === "debts") {
      if (editingItem) {
        financeData.updateDebt(editingItem.id, formData);
      } else {
        financeData.addDebt(formData);
      }
    } else if (tab === "goals") {
      if (editingItem) {
        financeData.updateGoal(editingItem.id, formData);
      } else {
        financeData.addGoal(formData);
      }
    } else if (tab === "bills") {
      if (editingItem) {
        financeData.updateBill(editingItem.id, formData);
      } else {
        financeData.addBill(formData);
      }
    } else if (tab === "banking") {
      if (editingItem) {
        financeData.updateBankAccount(editingItem.id, formData);
      } else {
        financeData.addBankAccount(formData);
      }
    }
    setShowAddForm(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      if (tab === "transactions") financeData.deleteTransaction(id);
      else if (tab === "budgets") financeData.deleteBudget(id);
      else if (tab === "debts") financeData.deleteDebt(id);
      else if (tab === "goals") financeData.deleteGoal(id);
      else if (tab === "bills") financeData.deleteBill(id);
      else if (tab === "banking") financeData.deleteBankAccount(id);
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (tab) {
      case "dashboard":
        return <Dashboard analytics={analytics} state={financeData.state} />;
      case "transactions":
        return (
          <Transactions
            state={financeData.state}
            addTransaction={financeData.addTransaction}
            updateTransaction={financeData.updateTransaction}
            deleteTransaction={financeData.deleteTransaction}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleFormSubmit={handleFormSubmit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        );
      case "charts":
        return <Charts pieData={analytics.pieData} lineData={analytics.lineData} />;
      case "analytics":
        return (
          <Analytics
            spendingTrends={analytics.spendingTrends}
            categoryAnalysis={analytics.categoryAnalysis}
            state={financeData.state}
            monthExpenseByCat={analytics.monthExpenseByCat}
          />
        );
      case "budgets":
        return (
          <Budgets
            state={financeData.state}
            addBudget={financeData.addBudget}
            updateBudget={financeData.updateBudget}
            deleteBudget={financeData.deleteBudget}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleFormSubmit={handleFormSubmit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        );
      case "bills":
        return (
          <Bills
            state={financeData.state}
            addBill={financeData.addBill}
            updateBill={financeData.updateBill}
            deleteBill={financeData.deleteBill}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleFormSubmit={handleFormSubmit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        );
      case "debts":
        return (
          <Debts
            state={financeData.state}
            addDebt={financeData.addDebt}
            updateDebt={financeData.updateDebt}
            deleteDebt={financeData.deleteDebt}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleFormSubmit={handleFormSubmit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        );
      case "goals":
        return (
          <Goals
            state={financeData.state}
            addGoal={financeData.addGoal}
            updateGoal={financeData.updateGoal}
            deleteGoal={financeData.deleteGoal}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleFormSubmit={handleFormSubmit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        );
      case "banking":
        return (
          <Banking
            state={financeData.state}
            addBankAccount={financeData.addBankAccount}
            updateBankAccount={financeData.updateBankAccount}
            deleteBankAccount={financeData.deleteBankAccount}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            editingItem={editingItem}
            setEditingItem={setEditingItem}
            formData={formData}
            setFormData={setFormData}
            handleFormSubmit={handleFormSubmit}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        );
               case "notifications":
                 return <Notifications state={financeData.state} />;
               case "settings":
                 return <Settings state={financeData.state} />;
      default:
        return <Dashboard analytics={analytics} state={financeData.state} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 sm:pb-32">
        {renderTabContent()}
      </main>

      <FormModal
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        tab={tab}
        state={financeData.state}
      />

      <Navigation tab={tab} setTab={setTab} showAddForm={showAddForm} setShowAddForm={setShowAddForm} />
      <PWAStatus />
    </div>
  );
}

