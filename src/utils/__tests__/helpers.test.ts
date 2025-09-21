import { fmt, sum, uid, todayISO, formatDate, getCurrentMonth, getLastNMonths, isUpcoming, calculateSavingsRate, getProgressColor, getSavingsRateColor } from '../helpers';

describe('Helper Functions', () => {
  describe('fmt', () => {
    it('should format numbers as Vietnamese currency', () => {
      expect(fmt(1000000)).toBe('1.000.000 ₫');
      expect(fmt(0)).toBe('0 ₫');
      expect(fmt(null)).toBe('0 ₫');
      expect(fmt(undefined)).toBe('0 ₫');
    });
  });

  describe('sum', () => {
    it('should sum array of numbers', () => {
      expect(sum([1, 2, 3, 4])).toBe(10);
      expect(sum([])).toBe(0);
      expect(sum([-1, 1])).toBe(0);
    });
  });

  describe('uid', () => {
    it('should generate unique IDs', () => {
      const id1 = uid();
      const id2 = uid();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('todayISO', () => {
    it('should return today date in ISO format', () => {
      const today = todayISO();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(today).toDateString()).toBe(new Date().toDateString());
    });
  });

  describe('formatDate', () => {
    it('should format date to Vietnamese locale', () => {
      const date = '2024-01-15';
      const formatted = formatDate(date);
      expect(formatted).toContain('15');
      expect(formatted).toContain('1');
      expect(formatted).toContain('2024');
    });
  });

  describe('getCurrentMonth', () => {
    it('should return current month in YYYY-MM format', () => {
      const currentMonth = getCurrentMonth();
      expect(currentMonth).toMatch(/^\d{4}-\d{2}$/);
      const now = new Date();
      const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      expect(currentMonth).toBe(expected);
    });
  });

  describe('getLastNMonths', () => {
    it('should return last N months', () => {
      const months = getLastNMonths(3);
      expect(months).toHaveLength(3);
      expect(months[0]).toMatch(/^\d{4}-\d{2}$/);
      expect(months[2]).toMatch(/^\d{4}-\d{2}$/);
    });
  });

  describe('isUpcoming', () => {
    it('should check if date is upcoming within days', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 8);
      
      expect(isUpcoming(tomorrow.toISOString().split('T')[0])).toBe(true);
      expect(isUpcoming(nextWeek.toISOString().split('T')[0])).toBe(false);
    });
  });

  describe('calculateSavingsRate', () => {
    it('should calculate savings rate correctly', () => {
      expect(calculateSavingsRate(1000000, 800000)).toBe(20);
      expect(calculateSavingsRate(1000000, 1000000)).toBe(0);
      expect(calculateSavingsRate(0, 1000000)).toBe(0);
    });
  });

  describe('getProgressColor', () => {
    it('should return correct color based on percentage', () => {
      expect(getProgressColor(50)).toBe('bg-green-500');
      expect(getProgressColor(85)).toBe('bg-yellow-500');
      expect(getProgressColor(105)).toBe('bg-red-500');
    });
  });

  describe('getSavingsRateColor', () => {
    it('should return correct color based on savings rate', () => {
      expect(getSavingsRateColor(25)).toBe('text-green-600');
      expect(getSavingsRateColor(15)).toBe('text-yellow-600');
      expect(getSavingsRateColor(5)).toBe('text-red-600');
    });
  });
});

