import React from 'react';

const SuccessMessage = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <div className={`mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-xs sm:text-sm animate-fade-in ${className}`}>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default SuccessMessage;