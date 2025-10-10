import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingScreen = ({ 
  message = 'Đang tải...', 
  variant = 'premium', 
  size = 'lg',
  showMessage = true,
  className = '',
  minDuration = 2000 // Minimum duration in milliseconds
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show loading screen immediately
    setShow(true);
    
    // Ensure minimum duration
    const timer = setTimeout(() => {
      setShow(false);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration]);

  if (!show) {
    return null;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 ${className}`}>
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

      {/* Loading Card */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-up">
          {/* Logo */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="w-16 h-16 rounded-[15px] flex items-center justify-center">
              <img
                src="/android-chrome-512x512.png"
                alt="Hioney"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center mb-6 animate-fade-in-delay">
            <LoadingSpinner variant={variant} size={size} />
          </div>

          {/* Loading Text */}
          <div className="text-center animate-slide-down">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {message}
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng chờ trong giây lát...
            </p>
            
            {/* Progress Steps */}
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Xác thực người dùng</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Đang tải giao dịch</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>Đang tải danh mục</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                <span>Đang tải ngân sách</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoadingScreen;
