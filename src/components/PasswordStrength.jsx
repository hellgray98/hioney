import React from 'react';

const PasswordStrength = ({ password, className = '' }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    strength = Object.values(checks).filter(Boolean).length;
    
    if (strength <= 2) {
      return { strength, label: 'Yếu', color: 'bg-red-500' };
    } else if (strength <= 3) {
      return { strength, label: 'Trung bình', color: 'bg-yellow-500' };
    } else if (strength <= 4) {
      return { strength, label: 'Mạnh', color: 'bg-blue-500' };
    } else {
      return { strength, label: 'Rất mạnh', color: 'bg-green-500' };
    }
  };

  const passwordStrength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className={`mt-2 ${className}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${
          passwordStrength.strength <= 2 ? 'text-red-500' :
          passwordStrength.strength <= 3 ? 'text-yellow-500' :
          passwordStrength.strength <= 4 ? 'text-blue-500' : 'text-green-500'
        }`}>
          {passwordStrength.label}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
        <div className={`flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{password.length >= 8 ? '✓' : '○'}</span>
          <span>Ít nhất 8 ký tự</span>
        </div>
        <div className={`flex items-center gap-1 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
          <span>Chữ thường</span>
        </div>
        <div className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
          <span>Chữ hoa</span>
        </div>
        <div className={`flex items-center gap-1 ${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{/\d/.test(password) ? '✓' : '○'}</span>
          <span>Số</span>
        </div>
        <div className={`flex items-center gap-1 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
          <span>{/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'}</span>
          <span>Ký tự đặc biệt</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;
