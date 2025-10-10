import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { validateEmail, getFirebaseErrorMessage, debounce } from '../utils/validation';

const ForgotPassword = ({ onBack }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Debounced validation
  const debouncedValidate = debounce((value) => {
    const emailError = validateEmail(value);
    setFieldErrors({ email: emailError });
  }, 300);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear general error when user starts typing
    if (error) setError('');
    
    // Validate field if it's been touched
    if (touchedFields.email) {
      debouncedValidate(value);
    }
  };

  const handleEmailBlur = (e) => {
    const value = e.target.value;
    setTouchedFields({ email: true });
    
    // Validate immediately on blur
    const emailError = validateEmail(value);
    setFieldErrors({ email: emailError });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark field as touched
    setTouchedFields({ email: true });
    
    // Validate email
    const emailError = validateEmail(email);
    setFieldErrors({ email: emailError });
    
    // If there are validation errors, don't submit
    if (emailError) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await resetPassword(email);
      setSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = getFirebaseErrorMessage(error.code);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-2xl rotate-12 animate-float-slow"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-3xl -rotate-12 animate-float-fast"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl rotate-45 animate-float-slow"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #64748b 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        </div>

        {/* Success Card */}
        <div className="relative w-full max-w-sm sm:max-w-md mx-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 animate-slide-up">
            {/* Success Icon */}
            <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl animate-pulse-slow">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-6 sm:mb-8 animate-slide-down">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Email đã được gửi!
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Vui lòng kiểm tra hộp thư của bạn
              </p>
            </div>

            {/* Instructions */}
            <div className="mb-6 sm:mb-8 animate-fade-in-delay">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 12a9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold mb-1">Hướng dẫn:</p>
                    <ul className="text-xs space-y-1">
                      <li>• Kiểm tra hộp thư đến và thư mục spam</li>
                      <li>• Click vào link trong email để đặt lại mật khẩu</li>
                      <li>• Link sẽ hết hạn sau 1 giờ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={onBack}
              className="w-full py-2.5 sm:py-3 px-4 bg-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 animate-slide-up-delay-4 text-sm sm:text-base"
            >
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Forgot Password Card */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 animate-slide-up">
          {/* Logo with enhanced animation */}
          <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl animate-pulse-slow">
              <img
                src="/android-chrome-192x192.png"
                alt="Hioney"
                className="w-8 h-8 sm:w-10 sm:h-10 filter invert"
              />
            </div>
          </div>

          {/* Title with animation */}
          <div className="text-center mb-6 sm:mb-8 animate-slide-down">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Nhập email để nhận link đặt lại mật khẩu
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 animate-fade-in-delay">
            {/* Email Field */}
            <div className="group animate-slide-up-delay-1">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-4 bg-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up-delay-2 text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <LoadingSpinner variant="modern" size="sm" />
                  <span>Đang gửi...</span>
                </div>
              ) : (
                'Gửi link đặt lại mật khẩu'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 sm:mt-8 text-center animate-fade-in-delay-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Nhớ mật khẩu?{' '}
              <button
                type="button"
                onClick={onBack}
                className="text-gray-900 hover:text-blue-700 font-semibold transition-colors"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;