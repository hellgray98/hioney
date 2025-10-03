/**
 * Calculate monthly interest based on APR
 * Formula: Monthly Interest = Balance × (APR / 12)
 * Example: 1,000,000 VNĐ × (19.99% / 12) = 1,000,000 × 0.01666 = 16,660 VNĐ
 */
export function calculateMonthlyInterest(balance, apr) {
  const monthlyRate = apr / 12;
  return balance * monthlyRate;
}

/**
 * Calculate minimum payment due
 */
export function calculateMinimumPayment(
  balance,
  minPaymentPercent
) {
  return balance * minPaymentPercent;
}

/**
 * Calculate credit utilization rate
 */
export function calculateUtilization(balance, creditLimit) {
  if (creditLimit === 0) return 0;
  return (balance / creditLimit) * 100;
}

/**
 * Get the next due date based on statement date and due day
 */
export function getNextDueDate(
  statementDate,
  dueDay,
  gracePeriodDays
) {
  const dueDate = new Date(statementDate);
  
  // Add grace period days
  dueDate.setDate(dueDate.getDate() + gracePeriodDays);
  
  // Set to the due day
  dueDate.setDate(dueDay);
  
  // If due day is before statement day, move to next month
  if (dueDate <= statementDate) {
    dueDate.setMonth(dueDate.getMonth() + 1);
  }
  
  return dueDate;
}

/**
 * Validate card settings
 */
export function validateCardSettings(card) {
  const errors = [];
  
  if (card.statementDay && (card.statementDay < 1 || card.statementDay > 28)) {
    errors.push('Ngày chốt sao kê phải từ 1 đến 28');
  }
  
  if (card.dueDay && (card.dueDay < 1 || card.dueDay > 28)) {
    errors.push('Ngày đến hạn phải từ 1 đến 28');
  }
  
  if (card.statementDay && card.dueDay && card.dueDay < card.statementDay) {
    errors.push('⚠️ Cảnh báo: Ngày đến hạn trước ngày chốt sao kê sẽ tính cho tháng sau');
  }
  
  if (card.creditLimit && card.creditLimit <= 0) {
    errors.push('Hạn mức tín dụng phải lớn hơn 0');
  }
  
  if (card.purchaseAPR && (card.purchaseAPR < 0 || card.purchaseAPR > 1)) {
    errors.push('APR phải từ 0% đến 100%');
  }
  
  if (card.minPaymentPercent && (card.minPaymentPercent < 0 || card.minPaymentPercent > 1)) {
    errors.push('Tỷ lệ thanh toán tối thiểu phải từ 0% đến 100%');
  }
  
  if (card.last4 && !/^\d{4}$/.test(card.last4)) {
    errors.push('4 số cuối phải là 4 chữ số');
  }
  
  return errors;
}

/**
 * Compute statement for a billing period
 */
export function computeStatement(
  card,
  previousStatement,
  transactions,
  payments,
  statementDate
) {
  // Calculate period dates
  const periodStart = new Date(statementDate);
  periodStart.setMonth(periodStart.getMonth() - 1);
  periodStart.setDate(card.statementDay + 1);
  
  const periodEnd = new Date(statementDate);
  periodEnd.setDate(card.statementDay);
  
  // Get previous balance
  const previousBalance = previousStatement?.statementBalance || 0;
  
  // Calculate interest on previous balance if not paid in full
  let interest = 0;
  if (previousStatement) {
    const previousPayments = previousStatement.payments.reduce((sum, p) => sum + p.amount, 0);
    const unpaidBalance = previousStatement.statementBalance - previousPayments;
    
    if (unpaidBalance > 0) {
      // Interest applies on unpaid balance from previous statement
      // Monthly interest = Unpaid balance × (APR / 12)
      interest = calculateMonthlyInterest(unpaidBalance, card.purchaseAPR);
    }
  }
  
  // Filter transactions and payments for this period
  const periodTransactions = transactions.filter(t => 
    t.transactionDate >= periodStart && 
    t.transactionDate <= periodEnd &&
    !t.isPending
  );
  
  const periodPayments = payments.filter(p => 
    p.paymentDate >= periodStart && 
    p.paymentDate <= periodEnd
  );
  
  // Calculate totals
  const newCharges = periodTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const paymentsTotal = periodPayments.reduce((sum, p) => sum + p.amount, 0);
  const credits = periodTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const fees = 0; // Could add late fees, over-limit fees, etc.
  
  // Calculate statement balance
  const statementBalance = previousBalance + newCharges - paymentsTotal - credits + fees + interest;
  
  // Calculate minimum payment
  const minimumPaymentDue = calculateMinimumPayment(
    statementBalance,
    card.minPaymentPercent
  );
  
  // Calculate due date
  const dueDate = getNextDueDate(statementDate, card.dueDay, card.gracePeriodDays);
  
  return {
    id: `stmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    cardId: card.id,
    userId: card.userId,
    statementPeriodStart: periodStart,
    statementPeriodEnd: periodEnd,
    statementDate,
    dueDate,
    previousBalance,
    newCharges,
    payments: paymentsTotal,
    credits,
    fees,
    interest,
    statementBalance,
    minimumPaymentDue,
    transactions: periodTransactions,
    payments: periodPayments,
    createdAt: new Date()
  };
}

/**
 * Get current balance from transactions and payments
 */
export function getCurrentBalance(
  lastStatement,
  recentTransactions,
  recentPayments
) {
  const statementBalance = lastStatement?.statementBalance || 0;
  const statementDate = lastStatement?.statementDate || new Date(0);
  
  // Get transactions after last statement
  const newTransactions = recentTransactions.filter(t => 
    t.transactionDate > statementDate && !t.isPending
  );
  
  // Get payments after last statement
  const newPayments = recentPayments.filter(p => 
    p.paymentDate > statementDate
  );
  
  const transactionsTotal = newTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const paymentsTotal = newPayments.reduce((sum, p) => sum + p.amount, 0);
  
  return statementBalance + transactionsTotal - paymentsTotal;
}
