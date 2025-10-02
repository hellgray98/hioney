import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Helper functions for date conversion
const dateToTimestamp = (date) => Timestamp.fromDate(date);
const timestampToDate = (timestamp) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Credit Cards Repository
export const creditCardRepo = {
        async create(userId, card) {
    // Validate last4 is only 4 digits
    if (!/^\d{4}$/.test(card.last4)) {
      throw new Error('Last 4 digits must be exactly 4 digits');
    }
    
    const cardRef = doc(collection(db, 'users', userId, 'creditCards'));
    const newCard = {
      ...card,
      userId,
      openedAt: dateToTimestamp(card.openedAt),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(cardRef, newCard);
    
    return {
      ...card,
      id: cardRef.id,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  },
  
  async update(userId, cardId, updates) {
    // Validate last4 if provided
    if (updates.last4 && !/^\d{4}$/.test(updates.last4)) {
      throw new Error('Last 4 digits must be exactly 4 digits');
    }
    
    const cardRef = doc(db, 'users', userId, 'creditCards', cardId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    if (updates.openedAt) {
      updateData.openedAt = dateToTimestamp(updates.openedAt);
    }
    
    await updateDoc(cardRef, updateData);
  },
  
  async delete(userId, cardId) {
    const cardRef = doc(db, 'users', userId, 'creditCards', cardId);
    await deleteDoc(cardRef);
    
    // Also delete related transactions, payments, and statements
    await Promise.all([
      this.deleteRelatedTransactions(userId, cardId),
      this.deleteRelatedPayments(userId, cardId),
      this.deleteRelatedStatements(userId, cardId)
    ]);
  },
  
  async deleteRelatedTransactions(userId, cardId) {
    const txQuery = query(
      collection(db, 'users', userId, 'creditTransactions'),
      where('cardId', '==', cardId)
    );
    const snapshot = await getDocs(txQuery);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },
  
  async deleteRelatedPayments(userId, cardId) {
    const paymentQuery = query(
      collection(db, 'users', userId, 'creditPayments'),
      where('cardId', '==', cardId)
    );
    const snapshot = await getDocs(paymentQuery);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },
  
  async deleteRelatedStatements(userId, cardId) {
    const stmtQuery = query(
      collection(db, 'users', userId, 'creditStatements'),
      where('cardId', '==', cardId)
    );
    const snapshot = await getDocs(stmtQuery);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  },
  
  async getAll(userId) {
    const cardsRef = collection(db, 'users', userId, 'creditCards');
    const snapshot = await getDocs(cardsRef);
    
    const cards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      openedAt: timestampToDate(doc.data().openedAt),
      createdAt: timestampToDate(doc.data().createdAt),
      updatedAt: timestampToDate(doc.data().updatedAt)
    }));
    
    // Sort in memory instead of using Firestore orderBy
    return cards.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  
  async getById(userId, cardId) {
    const cardRef = doc(db, 'users', userId, 'creditCards', cardId);
    const snapshot = await getDoc(cardRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      openedAt: timestampToDate(snapshot.data().openedAt),
      createdAt: timestampToDate(snapshot.data().createdAt),
      updatedAt: timestampToDate(snapshot.data().updatedAt)
    };
  }
};

// Credit Transactions Repository
export const creditTransactionRepo = {
  async create(userId, transaction) {
    const txRef = doc(collection(db, 'users', userId, 'creditTransactions'));
    const newTransaction = {
      ...transaction,
      userId,
      transactionDate: dateToTimestamp(transaction.transactionDate),
      postDate: dateToTimestamp(transaction.postDate),
      createdAt: serverTimestamp()
    };
    
    await setDoc(txRef, newTransaction);
    
    return {
      ...transaction,
      id: txRef.id,
      userId,
      createdAt: new Date()
    };
  },
  
  async update(userId, txId, updates) {
    const txRef = doc(db, 'users', userId, 'creditTransactions', txId);
    const updateData = { ...updates };
    
    if (updates.transactionDate) {
      updateData.transactionDate = dateToTimestamp(updates.transactionDate);
    }
    if (updates.postDate) {
      updateData.postDate = dateToTimestamp(updates.postDate);
    }
    
    await updateDoc(txRef, updateData);
  },
  
  async delete(userId, txId) {
    const txRef = doc(db, 'users', userId, 'creditTransactions', txId);
    await deleteDoc(txRef);
  },
  
  async getByCard(userId, cardId) {
    const txRef = collection(db, 'users', userId, 'creditTransactions');
    const q = query(txRef, where('cardId', '==', cardId));
    const snapshot = await getDocs(q);
    
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      transactionDate: timestampToDate(doc.data().transactionDate),
      postDate: timestampToDate(doc.data().postDate),
      createdAt: timestampToDate(doc.data().createdAt)
    }));
    
    // Sort in memory
    return transactions.sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());
  },
  
  async getAll(userId) {
    const txRef = collection(db, 'users', userId, 'creditTransactions');
    const snapshot = await getDocs(txRef);
    
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      transactionDate: timestampToDate(doc.data().transactionDate),
      postDate: timestampToDate(doc.data().postDate),
      createdAt: timestampToDate(doc.data().createdAt)
    }));
    
    // Sort in memory
    return transactions.sort((a, b) => b.transactionDate.getTime() - a.transactionDate.getTime());
  }
};

// Credit Payments Repository
export const creditPaymentRepo = {
  async create(userId, payment) {
    const paymentRef = doc(collection(db, 'users', userId, 'creditPayments'));
    const newPayment = {
      ...payment,
      userId,
      paymentDate: dateToTimestamp(payment.paymentDate),
      createdAt: serverTimestamp()
    };
    
    await setDoc(paymentRef, newPayment);
    
    return {
      ...payment,
      id: paymentRef.id,
      userId,
      createdAt: new Date()
    };
  },
  
  async update(userId, paymentId, updates) {
    const paymentRef = doc(db, 'users', userId, 'creditPayments', paymentId);
    const updateData = { ...updates };
    
    if (updates.paymentDate) {
      updateData.paymentDate = dateToTimestamp(updates.paymentDate);
    }
    
    await updateDoc(paymentRef, updateData);
  },
  
  async delete(userId, paymentId) {
    const paymentRef = doc(db, 'users', userId, 'creditPayments', paymentId);
    await deleteDoc(paymentRef);
  },
  
  async getByCard(userId, cardId) {
    const paymentRef = collection(db, 'users', userId, 'creditPayments');
    const q = query(paymentRef, where('cardId', '==', cardId));
    const snapshot = await getDocs(q);
    
    const payments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      paymentDate: timestampToDate(doc.data().paymentDate),
      createdAt: timestampToDate(doc.data().createdAt)
    }));
    
    // Sort in memory
    return payments.sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime());
  },
  
  async getAll(userId) {
    const paymentRef = collection(db, 'users', userId, 'creditPayments');
    const snapshot = await getDocs(paymentRef);
    
    const payments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      paymentDate: timestampToDate(doc.data().paymentDate),
      createdAt: timestampToDate(doc.data().createdAt)
    }));
    
    // Sort in memory
    return payments.sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime());
  }
};

// Credit Statements Repository
export const creditStatementRepo = {
  async create(userId, statement) {
    const stmtRef = doc(collection(db, 'users', userId, 'creditStatements'));
    const newStatement = {
      ...statement,
      statementPeriodStart: dateToTimestamp(statement.statementPeriodStart),
      statementPeriodEnd: dateToTimestamp(statement.statementPeriodEnd),
      statementDate: dateToTimestamp(statement.statementDate),
      dueDate: dateToTimestamp(statement.dueDate),
      createdAt: serverTimestamp(),
      // Convert nested arrays
      transactions: statement.transactions.map(tx => ({
        ...tx,
        transactionDate: dateToTimestamp(tx.transactionDate),
        postDate: dateToTimestamp(tx.postDate),
        createdAt: dateToTimestamp(tx.createdAt)
      })),
      payments: statement.payments.map(pmt => ({
        ...pmt,
        paymentDate: dateToTimestamp(pmt.paymentDate),
        createdAt: dateToTimestamp(pmt.createdAt)
      }))
    };
    
    await setDoc(stmtRef, newStatement);
    
    return {
      ...statement,
      id: stmtRef.id
    };
  },
  
  async getByCard(userId, cardId) {
    const stmtRef = collection(db, 'users', userId, 'creditStatements');
    const q = query(stmtRef, where('cardId', '==', cardId));
    const snapshot = await getDocs(q);
    
    const statements = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        statementPeriodStart: timestampToDate(data.statementPeriodStart),
        statementPeriodEnd: timestampToDate(data.statementPeriodEnd),
        statementDate: timestampToDate(data.statementDate),
        dueDate: timestampToDate(data.dueDate),
        createdAt: timestampToDate(data.createdAt),
        transactions: data.transactions?.map((tx) => ({
          ...tx,
          transactionDate: timestampToDate(tx.transactionDate),
          postDate: timestampToDate(tx.postDate),
          createdAt: timestampToDate(tx.createdAt)
        })) || [],
        payments: data.payments?.map((pmt) => ({
          ...pmt,
          paymentDate: timestampToDate(pmt.paymentDate),
          createdAt: timestampToDate(pmt.createdAt)
        })) || []
      };
    });
    
    // Sort in memory
    return statements.sort((a, b) => b.statementDate.getTime() - a.statementDate.getTime());
  },
  
  async getLatest(userId, cardId) {
    const statements = await this.getByCard(userId, cardId);
    return statements[0] || null;
  }
};