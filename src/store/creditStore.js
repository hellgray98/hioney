import { create } from 'zustand';
import { 
  getCurrentBalance, 
  calculateUtilization, 
  computeStatement,
  calculateMinimumPayment
} from '../lib/creditMath';
import { 
  creditCardRepo, 
  creditTransactionRepo, 
  creditPaymentRepo, 
  creditStatementRepo 
} from '../repositories/creditRepo';

const useCreditStore = create((set, get) => ({
  // Initial state
  cards: [],
  transactions: [],
  payments: [],
  statements: [],
  loading: false,
  error: null,
  
  // Card actions
  addCard: async (cardData, userId) => {
    set({ loading: true, error: null });
    try {
      const card = await creditCardRepo.create(userId, {
        ...cardData,
        archived: false
      });
      
      set(state => ({
        cards: [...state.cards, card],
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  updateCard: async (id, updates, userId) => {
    set({ loading: true, error: null });
    try {
      await creditCardRepo.update(userId, id, updates);
      
      set(state => ({
        cards: state.cards.map(card => 
          card.id === id 
            ? { ...card, ...updates, updatedAt: new Date() }
            : card
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  deleteCard: async (id, userId) => {
    set({ loading: true, error: null });
    try {
      await creditCardRepo.delete(userId, id);
      
      set(state => ({
        cards: state.cards.filter(card => card.id !== id),
        transactions: state.transactions.filter(tx => tx.cardId !== id),
        payments: state.payments.filter(payment => payment.cardId !== id),
        statements: state.statements.filter(stmt => stmt.cardId !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  archiveCard: async (id) => {
    await get().updateCard(id, { archived: true });
  },
  
  // Transaction actions
  addTransaction: async (transactionData, userId) => {
    set({ loading: true, error: null });
    try {
      const transaction = await creditTransactionRepo.create(userId, transactionData);
      
      set(state => ({
        transactions: [...state.transactions, transaction],
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  updateTransaction: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      set(state => ({
        transactions: state.transactions.map(tx => 
          tx.id === id ? { ...tx, ...updates } : tx
        ),
        loading: false
      }));
      
      // TODO: Update in Firebase
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  deleteTransaction: async (id) => {
    set({ loading: true, error: null });
    try {
      set(state => ({
        transactions: state.transactions.filter(tx => tx.id !== id),
        loading: false
      }));
      
      // TODO: Delete from Firebase
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // Payment actions
  addPayment: async (paymentData, userId) => {
    set({ loading: true, error: null });
    try {
      const payment = await creditPaymentRepo.create(userId, paymentData);
      
      set(state => ({
        payments: [...state.payments, payment],
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  updatePayment: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      set(state => ({
        payments: state.payments.map(payment => 
          payment.id === id ? { ...payment, ...updates } : payment
        ),
        loading: false
      }));
      
      // TODO: Update in Firebase
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  deletePayment: async (id) => {
    set({ loading: true, error: null });
    try {
      set(state => ({
        payments: state.payments.filter(payment => payment.id !== id),
        loading: false
      }));
      
      // TODO: Delete from Firebase
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  // Statement actions
  generateStatement: async (cardId, statementDate = new Date()) => {
    set({ loading: true, error: null });
    try {
      const state = get();
      const card = state.cards.find(c => c.id === cardId);
      
      if (!card) {
        throw new Error('Card not found');
      }
      
      const previousStatement = state.getLatestStatement(cardId);
      const transactions = state.transactions.filter(tx => tx.cardId === cardId);
      const payments = state.payments.filter(pmt => pmt.cardId === cardId);
      
      const statement = computeStatement(
        card,
        previousStatement,
        transactions,
        payments,
        statementDate
      );
      
      set(state => ({
        statements: [...state.statements, statement],
        loading: false
      }));
      
      // TODO: Save to Firebase
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  getLatestStatement: (cardId) => {
    const statements = get().statements
      .filter(stmt => stmt.cardId === cardId)
      .sort((a, b) => b.statementDate.getTime() - a.statementDate.getTime());
    
    return statements[0] || null;
  },
  
  // Computed values
  getCardSummary: (cardId) => {
    const state = get();
    const card = state.cards.find(c => c.id === cardId);
    
    if (!card) return null;
    
    const lastStatement = state.getLatestStatement(cardId);
    const recentTransactions = state.transactions.filter(tx => tx.cardId === cardId);
    const recentPayments = state.payments.filter(pmt => pmt.cardId === cardId);
    
    const currentBalance = getCurrentBalance(lastStatement, recentTransactions, recentPayments);
    const availableCredit = card.creditLimit - currentBalance;
    const utilizationRate = calculateUtilization(currentBalance, card.creditLimit);
    
    // Calculate minimum payment based on current balance and card settings
    const minimumPaymentDue = calculateMinimumPayment(currentBalance, card.minPaymentPercent);
    
    const lastPayment = recentPayments
      .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime())[0];
    
    return {
      card,
      currentBalance,
      availableCredit,
      utilizationRate,
      minimumPaymentDue,
      nextDueDate: lastStatement?.dueDate || null,
      lastStatementBalance: lastStatement?.statementBalance || 0,
      lastPaymentAmount: lastPayment?.amount || 0,
      lastPaymentDate: lastPayment?.paymentDate || null
    };
  },
  
  getTotalBalance: () => {
    const state = get();
    return state.cards
      .filter(card => !card.archived)
      .reduce((total, card) => {
        const summary = state.getCardSummary(card.id);
        return total + (summary?.currentBalance || 0);
      }, 0);
  },
  
  getTotalAvailableCredit: () => {
    const state = get();
    return state.cards
      .filter(card => !card.archived)
      .reduce((total, card) => {
        const summary = state.getCardSummary(card.id);
        return total + (summary?.availableCredit || 0);
      }, 0);
  },
  
  getOverallUtilization: () => {
    const state = get();
    const totalBalance = state.getTotalBalance();
    const totalLimit = state.cards
      .filter(card => !card.archived)
      .reduce((total, card) => total + card.creditLimit, 0);
    
    if (totalLimit === 0) return 0;
    return (totalBalance / totalLimit) * 100;
  },
  
  // Data fetching
  fetchData: async (userId) => {
    set({ loading: true, error: null });
    try {
      const [cards, transactions, payments] = await Promise.all([
        creditCardRepo.getAll(userId),
        creditTransactionRepo.getAll(userId),
        creditPaymentRepo.getAll(userId)
      ]);
      
      // Get all statements for all cards
      const statementsPromises = cards.map(card => 
        creditStatementRepo.getByCard(userId, card.id)
      );
      const statementsArrays = await Promise.all(statementsPromises);
      const statements = statementsArrays.flat();
      
      set({ 
        cards, 
        transactions, 
        payments, 
        statements,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  
  clearData: () => {
    set({
      cards: [],
      transactions: [],
      payments: [],
      statements: [],
      loading: false,
      error: null
    });
  }
}));

export default useCreditStore;