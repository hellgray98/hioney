import React from 'react';

const RetroLogo = ({ size = 'default', variant = 'full', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };

  const textSizes = {
    small: 'text-xs',
    default: 'text-sm',
    large: 'text-base',
    xlarge: 'text-lg'
  };

  if (variant === 'icon') {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <svg
          viewBox="0 0 48 48"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background with Retro Pattern */}
          <defs>
            <linearGradient id="retroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="30%" stopColor="#3B82F6" />
              <stop offset="70%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <pattern id="retroPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="rgba(255,255,255,0.05)" />
              <circle cx="4" cy="4" r="1" fill="rgba(255,255,255,0.1)" />
            </pattern>
          </defs>
          
          {/* Outer Hexagon - Retro Style */}
          <path
            d="M24 2 L42 12 L42 36 L24 46 L6 36 L6 12 Z"
            fill="url(#retroGradient)"
            stroke="url(#goldGradient)"
            strokeWidth="2"
          />
          
          {/* Inner Hexagon */}
          <path
            d="M24 6 L38 14 L38 34 L24 42 L10 34 L10 14 Z"
            fill="url(#retroPattern)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
          
          {/* Letter H - Retro Stylized */}
          <g stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Left vertical */}
            <path d="M18 14 L18 34" />
            {/* Right vertical */}
            <path d="M30 14 L30 34" />
            {/* Horizontal bar */}
            <path d="M18 24 L30 24" />
          </g>
          
          {/* Decorative Elements - Retro Style */}
          {/* Corner Stars */}
          <g fill="url(#goldGradient)">
            {/* Top */}
            <path d="M24 8 L25 12 L29 12 L26 14 L27 18 L24 16 L21 18 L22 14 L19 12 L23 12 Z" />
            {/* Bottom */}
            <path d="M24 40 L25 36 L29 36 L26 34 L27 30 L24 32 L21 30 L22 34 L19 36 L23 36 Z" />
            {/* Left */}
            <path d="M12 24 L16 23 L16 19 L18 22 L22 21 L20 24 L22 27 L18 26 L16 29 L16 25 Z" />
            {/* Right */}
            <path d="M36 24 L32 23 L32 19 L30 22 L26 21 L28 24 L26 27 L30 26 L32 29 L32 25 Z" />
          </g>
          
          {/* Center Diamond */}
          <path
            d="M24 20 L28 24 L24 28 L20 24 Z"
            fill="url(#goldGradient)"
            opacity="0.8"
          />
          
          {/* Inner Diamond */}
          <path
            d="M24 22 L26 24 L24 26 L22 24 Z"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <RetroLogo size={size} variant="icon" />
        <div className="flex flex-col">
          <span className={`font-bold text-gray-900 ${textSizes[size]} tracking-wide`}>
            HIONEY
          </span>
          <span className={`text-gray-500 ${size === 'small' ? 'text-xs' : 'text-xs'} tracking-wider`}>
            FINANCE
          </span>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative">
        <RetroLogo size={size} variant="icon" />
        {/* Retro Glow Effect */}
        <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-30 -z-10"></div>
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20 -z-10"></div>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-gray-900 ${textSizes[size]} tracking-wide`}>
          HIONEY
        </span>
        <span className={`text-gray-500 ${size === 'small' ? 'text-xs' : 'text-xs'} tracking-wider`}>
          Quản lý tài chính
        </span>
      </div>
    </div>
  );
};

export default RetroLogo;


