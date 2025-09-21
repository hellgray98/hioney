// Validation utilities for Hioney Finance App

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateTransaction = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  // Type validation
  if (!data.type || !['income', 'expense'].includes(data.type)) {
    errors.type = 'Vui lòng chọn loại giao dịch';
  }

  // Category validation
  if (!data.category || data.category.trim() === '') {
    errors.category = 'Vui lòng chọn danh mục';
  }

  // Amount validation
  if (!data.amount || isNaN(data.amount)) {
    errors.amount = 'Số tiền không hợp lệ';
  } else if (data.amount <= 0) {
    errors.amount = 'Số tiền phải lớn hơn 0';
  } else if (data.amount > 1000000000) {
    errors.amount = 'Số tiền quá lớn (tối đa 1 tỷ VND)';
  }

  // Note validation
  if (!data.note || data.note.trim() === '') {
    errors.note = 'Vui lòng nhập ghi chú';
  } else if (data.note.length > 200) {
    errors.note = 'Ghi chú quá dài (tối đa 200 ký tự)';
  }

  // Date validation
  if (!data.date) {
    errors.date = 'Vui lòng chọn ngày';
  } else {
    const date = new Date(data.date);
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    if (isNaN(date.getTime())) {
      errors.date = 'Ngày không hợp lệ';
    } else if (date > today) {
      errors.date = 'Ngày không được trong tương lai';
    } else if (date < oneYearAgo) {
      errors.date = 'Ngày không được quá 1 năm trước';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBudget = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.category || data.category.trim() === '') {
    errors.category = 'Vui lòng chọn danh mục';
  }

  if (!data.monthly || isNaN(data.monthly)) {
    errors.monthly = 'Ngân sách không hợp lệ';
  } else if (data.monthly <= 0) {
    errors.monthly = 'Ngân sách phải lớn hơn 0';
  } else if (data.monthly > 100000000) {
    errors.monthly = 'Ngân sách quá lớn (tối đa 100 triệu VND)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateDebt = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Vui lòng nhập tên nợ';
  } else if (data.name.length > 100) {
    errors.name = 'Tên nợ quá dài (tối đa 100 ký tự)';
  }

  if (!data.balance || isNaN(data.balance)) {
    errors.balance = 'Số dư nợ không hợp lệ';
  } else if (data.balance <= 0) {
    errors.balance = 'Số dư nợ phải lớn hơn 0';
  } else if (data.balance > 10000000000) {
    errors.balance = 'Số dư nợ quá lớn (tối đa 10 tỷ VND)';
  }

  if (!data.apr || isNaN(data.apr)) {
    errors.apr = 'Lãi suất không hợp lệ';
  } else if (data.apr < 0) {
    errors.apr = 'Lãi suất không được âm';
  } else if (data.apr > 50) {
    errors.apr = 'Lãi suất quá cao (tối đa 50%)';
  }

  if (!data.minPay || isNaN(data.minPay)) {
    errors.minPay = 'Thanh toán tối thiểu không hợp lệ';
  } else if (data.minPay <= 0) {
    errors.minPay = 'Thanh toán tối thiểu phải lớn hơn 0';
  } else if (data.minPay > data.balance) {
    errors.minPay = 'Thanh toán tối thiểu không được lớn hơn số dư nợ';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateGoal = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Vui lòng nhập tên mục tiêu';
  } else if (data.name.length > 100) {
    errors.name = 'Tên mục tiêu quá dài (tối đa 100 ký tự)';
  }

  if (!data.target || isNaN(data.target)) {
    errors.target = 'Mục tiêu không hợp lệ';
  } else if (data.target <= 0) {
    errors.target = 'Mục tiêu phải lớn hơn 0';
  } else if (data.target > 10000000000) {
    errors.target = 'Mục tiêu quá lớn (tối đa 10 tỷ VND)';
  }

  if (data.saved === undefined || data.saved === null || isNaN(data.saved)) {
    errors.saved = 'Số tiền đã tiết kiệm không hợp lệ';
  } else if (data.saved < 0) {
    errors.saved = 'Số tiền đã tiết kiệm không được âm';
  } else if (data.saved > data.target) {
    errors.saved = 'Số tiền đã tiết kiệm không được lớn hơn mục tiêu';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBill = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Vui lòng nhập tên hóa đơn';
  } else if (data.name.length > 100) {
    errors.name = 'Tên hóa đơn quá dài (tối đa 100 ký tự)';
  }

  if (!data.amount || isNaN(data.amount)) {
    errors.amount = 'Số tiền không hợp lệ';
  } else if (data.amount <= 0) {
    errors.amount = 'Số tiền phải lớn hơn 0';
  } else if (data.amount > 100000000) {
    errors.amount = 'Số tiền quá lớn (tối đa 100 triệu VND)';
  }

  if (!data.dueDate) {
    errors.dueDate = 'Vui lòng chọn ngày đến hạn';
  } else {
    const date = new Date(data.dueDate);
    if (isNaN(date.getTime())) {
      errors.dueDate = 'Ngày đến hạn không hợp lệ';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBankAccount = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === '') {
    errors.name = 'Vui lòng nhập tên tài khoản';
  } else if (data.name.length > 100) {
    errors.name = 'Tên tài khoản quá dài (tối đa 100 ký tự)';
  }

  if (!data.bankName || data.bankName.trim() === '') {
    errors.bankName = 'Vui lòng nhập tên ngân hàng';
  } else if (data.bankName.length > 100) {
    errors.bankName = 'Tên ngân hàng quá dài (tối đa 100 ký tự)';
  }

  if (!data.type || !['checking', 'savings'].includes(data.type)) {
    errors.type = 'Vui lòng chọn loại tài khoản';
  }

  if (data.balance === undefined || data.balance === null || isNaN(data.balance)) {
    errors.balance = 'Số dư không hợp lệ';
  } else if (data.balance < 0) {
    errors.balance = 'Số dư không được âm';
  } else if (data.balance > 10000000000) {
    errors.balance = 'Số dư quá lớn (tối đa 10 tỷ VND)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

