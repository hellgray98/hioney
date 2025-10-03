import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const FormButton = ({
  type = 'submit',
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  loadingText = 'Đang xử lý...',
  loadingVariant = 'dots',
  className = '',
  animationClass = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500';
      case 'secondary':
        return 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400';
      case 'danger':
        return 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500';
      case 'success':
        return 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500';
      default:
        return 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3 text-sm';
      case 'md':
        return 'py-2.5 sm:py-3 px-4 text-sm sm:text-base';
      case 'lg':
        return 'py-3 sm:py-4 px-6 text-base sm:text-lg';
      default:
        return 'py-2.5 sm:py-3 px-4 text-sm sm:text-base';
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`w-full font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 ${getVariantClasses()} ${getSizeClasses()} ${animationClass} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-3">
          <LoadingSpinner variant={loadingVariant} size="sm" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default FormButton;
