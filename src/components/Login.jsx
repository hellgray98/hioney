import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { validateEmail, validatePassword, getFirebaseErrorMessage, debounce } from '../utils/validation';

const Login = ({ onToggleMode, onShowForgot }) => {
  const { signin, error, setError, signinLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Debounced validation
  const debouncedValidate = debounce((name, value) => {
    let fieldError = null;
    
    if (name === 'email') {
      fieldError = validateEmail(value);
    } else if (name === 'password') {
      fieldError = validatePassword(value);
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  }, 300);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear general error when user starts typing
    if (error) setError('');
    
    // Validate field if it's been touched
    if (touchedFields[name]) {
      debouncedValidate(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Validate immediately on blur
    let fieldError = null;
    if (name === 'email') {
      fieldError = validateEmail(value);
    } else if (name === 'password') {
      fieldError = validatePassword(value);
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouchedFields({ email: true, password: true });
    
    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    const newFieldErrors = {};
    if (emailError) newFieldErrors.email = emailError;
    if (passwordError) newFieldErrors.password = passwordError;
    
    setFieldErrors(newFieldErrors);
    
    // If there are validation errors, don't submit
    if (Object.keys(newFieldErrors).length > 0) {
      return;
    }

    try {
      await signin(formData.email, formData.password);
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = getFirebaseErrorMessage(error.code);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl rotate-12 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-full animate-float-medium"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-3xl -rotate-12 animate-float-fast"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl rotate-45 animate-float-slow"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
      </div>

      {/* Login Card with enhanced animations */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 animate-slide-up">
          {/* Logo with enhanced animation */}
          <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl animate-pulse-slow">
              <img
                src="/pwa-512x512.png"
                alt="Hioney"
                className="w-8 h-8 sm:w-10 sm:h-10 filter invert"
              />
            </div>
          </div>

          {/* Title with animation */}
          <div className="text-center mb-6 sm:mb-8 animate-slide-down">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Đăng nhập
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Chào mừng bạn quay trở lại
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs sm:text-sm animate-shake">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Form with enhanced animations */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 animate-fade-in-delay">
                 {/* Email Field */}
                 <div className="group animate-slide-up-delay-1">
                   <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                     Email
                   </label>
                   <div className="relative">
                     <input
                       type="email"
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       required
                       className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 border rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:bg-white/90 ${
                         fieldErrors.email && touchedFields.email
                           ? 'border-red-500 focus:ring-red-500'
                           : 'border-gray-200 focus:ring-blue-500'
                       }`}
                       placeholder="Nhập email của bạn"
                     />
                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                       <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${
                         fieldErrors.email && touchedFields.email ? 'text-red-500' : 'text-gray-400'
                       }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                       </svg>
                     </div>
                   </div>
                   {fieldErrors.email && touchedFields.email && (
                     <p className="text-red-500 text-xs mt-1 animate-shake">
                       {fieldErrors.email}
                     </p>
                   )}
                 </div>

            {/* Password Field */}
            <div className="group animate-slide-up-delay-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 border rounded-xl text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:bg-white/90 ${
                    fieldErrors.password && touchedFields.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && touchedFields.password && (
                <p className="text-red-500 text-xs mt-1 animate-shake">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right animate-slide-up-delay-3">
              <button
                type="button"
                onClick={onShowForgot}
                className="text-xs sm:text-sm text-gray-900 hover:text-blue-700 font-medium transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={signinLoading}
              className="w-full py-2.5 sm:py-3 px-4 bg-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up-delay-4 text-sm sm:text-base"
            >
              {signinLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <LoadingSpinner variant="sleek" size="sm" />
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 sm:mt-8 text-center animate-fade-in-delay-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={onToggleMode}
                className="text-gray-900 hover:text-blue-700 font-semibold transition-colors"
              >
                Đăng ký ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;