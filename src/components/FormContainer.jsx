import React from 'react';

const FormContainer = ({
  children,
  title,
  subtitle,
  className = '',
  animationClass = 'animate-slide-up',
  ...props
}) => {
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

      {/* Form Card */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-4">
        <div className={`bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 ${animationClass} ${className}`} {...props}>
          {/* Logo */}
          <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl animate-pulse-slow">
              <img
                src="/pwa-512x512.png"
                alt="Hioney"
                className="w-8 h-8 sm:w-10 sm:h-10 filter invert"
              />
            </div>
          </div>

          {/* Title */}
          {title && (
            <div className="text-center mb-6 sm:mb-8 animate-slide-down">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
