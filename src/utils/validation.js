// Validation utility functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email là bắt buộc';
  if (!emailRegex.test(email)) return 'Email không hợp lệ';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Mật khẩu là bắt buộc';
  if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
  if (password.length > 128) return 'Mật khẩu không được quá 128 ký tự';
  return null;
};

export const validateStrongPassword = (password) => {
  if (!password) return 'Mật khẩu là bắt buộc';
  if (password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
  if (password.length > 128) return 'Mật khẩu không được quá 128 ký tự';
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase) return 'Mật khẩu phải có ít nhất 1 chữ hoa';
  if (!hasLowerCase) return 'Mật khẩu phải có ít nhất 1 chữ thường';
  if (!hasNumbers) return 'Mật khẩu phải có ít nhất 1 số';
  if (!hasSpecialChar) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
  
  return null;
};

export const validateName = (name) => {
  if (!name) return 'Tên là bắt buộc';
  if (name.length < 2) return 'Tên phải có ít nhất 2 ký tự';
  if (name.length > 50) return 'Tên không được quá 50 ký tự';
  if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name)) return 'Tên chỉ được chứa chữ cái và khoảng trắng';
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Xác nhận mật khẩu là bắt buộc';
  if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp';
  return null;
};

export const validateForm = (formData, rules) => {
  const errors = {};
  
  for (const [field, validators] of Object.entries(rules)) {
    const value = formData[field];
    
    for (const validator of validators) {
      const error = validator(value, formData);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for each field
      }
    }
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

// Firebase error messages mapping
export const getFirebaseErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/user-not-found': 'Không tìm thấy tài khoản với email này',
    'auth/wrong-password': 'Mật khẩu không chính xác',
    'auth/email-already-in-use': 'Email này đã được sử dụng',
    'auth/weak-password': 'Mật khẩu quá yếu, vui lòng chọn mật khẩu mạnh hơn',
    'auth/invalid-email': 'Email không hợp lệ',
    'auth/user-disabled': 'Tài khoản đã bị vô hiệu hóa',
    'auth/too-many-requests': 'Quá nhiều yêu cầu, vui lòng thử lại sau',
    'auth/network-request-failed': 'Lỗi kết nối mạng, vui lòng kiểm tra internet',
    'auth/invalid-credential': 'Thông tin đăng nhập không chính xác',
    'auth/account-exists-with-different-credential': 'Tài khoản đã tồn tại với phương thức đăng nhập khác',
    'auth/operation-not-allowed': 'Thao tác không được phép',
    'auth/requires-recent-login': 'Vui lòng đăng nhập lại để thực hiện thao tác này'
  };
  
  return errorMessages[errorCode] || 'Có lỗi xảy ra, vui lòng thử lại';
};

// Real-time validation helpers
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateField = (field, value, formData, rules) => {
  const fieldRules = rules[field];
  if (!fieldRules) return null;
  
  for (const rule of fieldRules) {
    const error = rule(value, formData);
    if (error) return error;
  }
  
  return null;
};
