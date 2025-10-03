import React from 'react';

const ValidationMessage = ({ error, touched, className = '' }) => {
  if (!error || !touched) return null;
  
  return (
    <p className={`text-red-500 text-xs mt-1 animate-shake ${className}`}>
      {error}
    </p>
  );
};

export default ValidationMessage;
