// Format currency input with thousand separators
export const formatCurrencyInput = (value) => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Add thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Parse formatted currency back to number
export const parseCurrencyInput = (formattedValue) => {
  // Remove all non-numeric characters
  return parseInt(formattedValue.replace(/\D/g, '')) || 0;
};

// Format currency for display
export const formatCurrencyDisplay = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
