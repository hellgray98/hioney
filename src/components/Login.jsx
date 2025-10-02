import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Login = ({ onToggleMode }) => {
  const { signin, error, setError } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      await signin(formData.email, formData.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all duration-1000 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-50 via-white to-gray-100' 
        : 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
    }`}>
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-float ${
          theme === 'dark' ? 'bg-gray-900/30' : 'bg-white/20'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-2xl animate-float-delayed ${
          theme === 'dark' ? 'bg-black/20' : 'bg-gray-100/30'
        }`}></div>
        <div className={`absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-xl animate-pulse-slow ${
          theme === 'dark' ? 'bg-gray-800/25' : 'bg-white/15'
        }`}></div>
        
        {/* Geometric Shapes */}
        <div className={`absolute top-20 left-20 w-32 h-32 rotate-45 animate-spin-slow ${
          theme === 'dark' ? 'bg-gradient-to-br from-gray-900/10 to-black/5' : 'bg-gradient-to-br from-white/10 to-gray-100/5'
        }`} style={{ borderRadius: '30%' }}></div>
        <div className={`absolute bottom-20 right-20 w-24 h-24 animate-bounce-slow ${
          theme === 'dark' ? 'bg-gradient-to-tl from-gray-700/15 to-gray-900/10' : 'bg-gradient-to-tl from-gray-200/15 to-white/10'
        }`} style={{ borderRadius: '40%', animationDelay: '2s' }}></div>
        
        {/* Grid Pattern */}
        <div className={`absolute inset-0 opacity-5 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`} style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className={`text-3xl font-bold tracking-tight animate-slide-in-left ${
            theme === 'dark' ? 'text-gray-900' : 'text-white'
          }`}>
            Đăng nhập
          </h1>
        </div>

        {/* Login Form */}
        <div className={`backdrop-blur-2xl rounded-2xl p-6 shadow-xl border animate-slide-up transform hover:scale-[1.01] transition-all duration-500 ${
          theme === 'dark' 
            ? 'bg-white/90 border-white/20 shadow-white/10' 
            : 'bg-black/90 border-black/20 shadow-black/10'
        }`}>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  {error}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-900' : 'text-white'
              }`}>
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`w-6 h-6 transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-600 group-focus-within:text-gray-900 group-focus-within:scale-110' 
                      : 'text-gray-400 group-focus-within:text-white group-focus-within:scale-110'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 focus:scale-[1.02] ${
                    theme === 'dark'
                      ? 'bg-gray-50/90 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:shadow-lg'
                      : 'bg-gray-900/90 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:bg-black focus:shadow-lg'
                  }`}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className={`block text-sm font-semibold ${
                theme === 'dark' ? 'text-gray-900' : 'text-white'
              }`}>
                Mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`w-6 h-6 transition-all duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-600 group-focus-within:text-gray-900 group-focus-within:scale-110' 
                      : 'text-gray-400 group-focus-within:text-white group-focus-within:scale-110'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 focus:scale-[1.02] ${
                    theme === 'dark'
                      ? 'bg-gray-50/90 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:bg-white focus:shadow-lg'
                      : 'bg-gray-900/90 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:bg-black focus:shadow-lg'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-1 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : theme === 'dark'
                    ? 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white shadow-lg hover:shadow-black/30'
                    : 'bg-gradient-to-r from-white to-gray-100 hover:from-gray-50 hover:to-white text-gray-900 shadow-lg hover:shadow-white/30'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng nhập...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Đăng nhập
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className={`flex-1 h-px ${
              theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
            }`}></div>
            <span className={`px-4 text-sm font-medium ${
              theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
            }`}>
              hoặc
            </span>
            <div className={`flex-1 h-px ${
              theme === 'dark' ? 'bg-gray-400' : 'bg-gray-500'
            }`}></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <button
              onClick={onToggleMode}
              className={`w-full py-3 px-6 rounded-xl font-medium border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-900 hover:bg-gray-100 hover:border-gray-900'
                  : 'border-gray-400 text-white hover:bg-gray-800 hover:border-white'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Tạo tài khoản mới
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(60px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.3) rotate(-10deg); }
          50% { opacity: 1; transform: scale(1.1) rotate(5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-3deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.3s both;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out 0.5s both;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out 0.7s both;
        }
        .animate-bounce-in {
          animation: bounce-in 1.2s ease-out 0.2s both;
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;