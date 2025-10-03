import React from 'react';

const LoadingSpinner = React.memo(({ size = 'md', className = '', variant = 'default' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (variant === 'fintech') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          {/* Outer ring with gradient */}
          <div className={`${sizeClasses[size]} border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin`}>
            <div className="w-full h-full bg-white rounded-full m-0.5"></div>
          </div>
          {/* Inner ring with reverse animation */}
          <div className={`absolute inset-2 ${sizeClasses[size]} border border-blue-500/30 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          {/* Center dot with pulse */}
          <div className={`absolute inset-0 ${sizeClasses[size]} flex items-center justify-center`}>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          {/* Outer glow effect */}
          <div className={`absolute inset-0 ${sizeClasses[size]} bg-blue-500/10 rounded-full animate-ping`}></div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          {/* Clean ring */}
          <div className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin`}>
            <div className="w-full h-full border-2 border-transparent border-t-blue-500 rounded-full"></div>
          </div>
          {/* Subtle inner glow */}
          <div className={`absolute inset-1 ${sizeClasses[size]} bg-blue-500/10 rounded-full animate-pulse`}></div>
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }}></div>
        <div className="w-1 h-8 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
        <div className="w-1 h-6 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        <div className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse`}></div>
      </div>
    );
  }

  if (variant === 'modern') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          {/* Outer ring with gradient */}
          <div className={`${sizeClasses[size]} border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-spin`}>
            <div className="w-full h-full bg-white rounded-full m-0.5"></div>
          </div>
          {/* Inner ring with reverse animation */}
          <div className={`absolute inset-2 ${sizeClasses[size]} border border-blue-500/30 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          {/* Center dot with pulse */}
          <div className={`absolute inset-0 ${sizeClasses[size]} flex items-center justify-center`}>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          {/* Outer glow effect */}
          <div className={`absolute inset-0 ${sizeClasses[size]} bg-blue-500/10 rounded-full animate-ping`}></div>
        </div>
      </div>
    );
  }

  if (variant === 'elegant') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          {/* Outer ring */}
          <div className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin`}>
            <div className="w-full h-full border-2 border-transparent border-t-blue-500 rounded-full"></div>
          </div>
          {/* Inner ring */}
          <div className={`absolute inset-2 ${sizeClasses[size]} border border-blue-500/30 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          {/* Center dot */}
          <div className={`absolute inset-0 ${sizeClasses[size]} flex items-center justify-center`}>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal-dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
      </div>
    );
  }

  if (variant === 'gradient') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          {/* Gradient ring */}
          <div className={`${sizeClasses[size]} border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-spin`}>
            <div className="w-full h-full bg-white rounded-full m-0.5"></div>
          </div>
          {/* Inner gradient dot */}
          <div className={`absolute inset-0 ${sizeClasses[size]} flex items-center justify-center`}>
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'sleek') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          {/* Sleek ring */}
          <div className={`${sizeClasses[size]} border-2 border-gray-300 rounded-full animate-spin`}>
            <div className="w-full h-full border-2 border-transparent border-t-blue-500 border-r-blue-500/30 rounded-full"></div>
          </div>
          {/* Inner glow */}
          <div className={`absolute inset-1 ${sizeClasses[size]} bg-blue-500/5 rounded-full animate-pulse`}></div>
        </div>
      </div>
    );
  }

  if (variant === 'premium') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          {/* Outer ring with gradient */}
          <div className={`${sizeClasses[size]} border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full animate-spin`}>
            <div className="w-full h-full bg-white rounded-full m-0.5"></div>
          </div>
          {/* Inner ring with reverse animation */}
          <div className={`absolute inset-2 ${sizeClasses[size]} border border-blue-500/30 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          {/* Center dot with pulse */}
          <div className={`absolute inset-0 ${sizeClasses[size]} flex items-center justify-center`}>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          {/* Outer glow effect */}
          <div className={`absolute inset-0 ${sizeClasses[size]} bg-blue-500/10 rounded-full animate-ping`}></div>
        </div>
      </div>
    );
  }

  // Default variant - clean and minimal
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="w-full h-full border-2 border-gray-200 border-t-blue-500 rounded-full"></div>
      </div>
    </div>
  );
});

export default LoadingSpinner;