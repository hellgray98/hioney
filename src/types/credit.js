// Credit Card Types
export interface CreditCard {
  id: string;
  userId: string;
  holderName: string;
  issuer: string; // e.g., "Chase", "Citi", "Amex"
  network: 'Visa' | 'Mastercard' | 'Amex' | 'Discover' | 'JCB' | 'UnionPay';
  last4: string; // Last 4 digits only
  openedAt: Date;
  creditLimit: number;
  statementDay: number; // 1-28
  dueDay: number; // 1-28
  minPaymentPercent: number; // e.g., 0.02 for 2%
  minPaymentFloor: number; // e.g., 25 for $25 minimum
  gracePeriodDays: number; // typically 21-25 days
  purchaseAPR: number; // e.g., 0.1999 for 19.99%
  iconUrl?: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditTransaction {
  id: string;
  cardId: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  transactionDate: Date;
  postDate: Date;
  merchantName?: string;
  isPending: boolean;
  createdAt: Date;
}

export interface CreditPayment {
  id: string;
  cardId: string;
  userId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'bank_transfer' | 'debit_card' | 'cash' | 'other';
  note?: string;
  createdAt: Date;
}

export interface CreditStatement {
  id: string;
  cardId: string;
  userId: string;
  statementPeriodStart: Date;
  statementPeriodEnd: Date;
  statementDate: Date;
  dueDate: Date;
  previousBalance: number;
  newCharges: number;
  payments: number;
  credits: number;
  fees: number;
  interest: number;
  statementBalance: number;
  minimumPaymentDue: number;
  transactions: CreditTransaction[];
  payments: CreditPayment[];
  createdAt: Date;
}

export interface CreditCardSummary {
  card: CreditCard;
  currentBalance: number;
  availableCredit: number;
  utilizationRate: number;
  minimumPaymentDue: number;
  nextDueDate: Date | null;
  lastStatementBalance: number;
  lastPaymentAmount: number;
  lastPaymentDate: Date | null;
}
