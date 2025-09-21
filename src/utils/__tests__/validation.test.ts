import { validateTransaction, validateBudget, validateDebt, validateGoal, validateBill, validateBankAccount } from '../validation';

describe('Validation Functions', () => {
  describe('validateTransaction', () => {
    it('should validate correct transaction data', () => {
      const validData = {
        type: 'expense',
        category: 'food',
        amount: 100000,
        note: 'Ăn trưa',
        date: '2024-01-15'
      };
      
      const result = validateTransaction(validData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should reject invalid transaction data', () => {
      const invalidData = {
        type: 'invalid',
        category: '',
        amount: -100,
        note: '',
        date: 'invalid-date'
      };
      
      const result = validateTransaction(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.type).toBeDefined();
      expect(result.errors.category).toBeDefined();
      expect(result.errors.amount).toBeDefined();
      expect(result.errors.note).toBeDefined();
      expect(result.errors.date).toBeDefined();
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const data = {
        type: 'expense',
        category: 'food',
        amount: 100000,
        note: 'Test',
        date: futureDate.toISOString().split('T')[0]
      };
      
      const result = validateTransaction(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.date).toContain('tương lai');
    });

    it('should reject amounts too large', () => {
      const data = {
        type: 'expense',
        category: 'food',
        amount: 2000000000,
        note: 'Test',
        date: '2024-01-15'
      };
      
      const result = validateTransaction(data);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).toContain('quá lớn');
    });
  });

  describe('validateBudget', () => {
    it('should validate correct budget data', () => {
      const validData = {
        category: 'food',
        monthly: 2000000
      };
      
      const result = validateBudget(validData);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid budget data', () => {
      const invalidData = {
        category: '',
        monthly: -1000
      };
      
      const result = validateBudget(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBeDefined();
      expect(result.errors.monthly).toBeDefined();
    });
  });

  describe('validateDebt', () => {
    it('should validate correct debt data', () => {
      const validData = {
        name: 'Thẻ tín dụng',
        balance: 5000000,
        apr: 18.5,
        minPay: 500000
      };
      
      const result = validateDebt(validData);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid debt data', () => {
      const invalidData = {
        name: '',
        balance: -1000,
        apr: -5,
        minPay: 1000000
      };
      
      const result = validateDebt(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.balance).toBeDefined();
      expect(result.errors.apr).toBeDefined();
    });
  });

  describe('validateGoal', () => {
    it('should validate correct goal data', () => {
      const validData = {
        name: 'Mua nhà',
        target: 2000000000,
        saved: 500000000
      };
      
      const result = validateGoal(validData);
      expect(result.isValid).toBe(true);
    });

    it('should reject saved amount greater than target', () => {
      const invalidData = {
        name: 'Mua nhà',
        target: 1000000,
        saved: 2000000
      };
      
      const result = validateGoal(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.saved).toContain('lớn hơn mục tiêu');
    });
  });

  describe('validateBill', () => {
    it('should validate correct bill data', () => {
      const validData = {
        name: 'Hóa đơn điện',
        amount: 450000,
        dueDate: '2024-02-15'
      };
      
      const result = validateBill(validData);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid bill data', () => {
      const invalidData = {
        name: '',
        amount: -1000,
        dueDate: 'invalid-date'
      };
      
      const result = validateBill(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.amount).toBeDefined();
      expect(result.errors.dueDate).toBeDefined();
    });
  });

  describe('validateBankAccount', () => {
    it('should validate correct bank account data', () => {
      const validData = {
        name: 'Tài khoản chính',
        bankName: 'Vietcombank',
        type: 'checking',
        balance: 5000000
      };
      
      const result = validateBankAccount(validData);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid bank account data', () => {
      const invalidData = {
        name: '',
        bankName: '',
        type: 'invalid',
        balance: -1000
      };
      
      const result = validateBankAccount(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.bankName).toBeDefined();
      expect(result.errors.type).toBeDefined();
      expect(result.errors.balance).toBeDefined();
    });
  });
});

