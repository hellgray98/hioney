// Format currency input with thousand separators
export const formatCurrencyInput = (value) => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, '');
  
  // Add thousand separators
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Handle currency input change with smart zero handling
export const handleCurrencyInputChange = (e, setValue) => {
  const value = e.target.value;
  const formatted = formatCurrencyInput(value);
  setValue(formatted);
};

// Handle key down events for currency input
export const handleCurrencyKeyDown = (e) => {
  const input = e.target;
  const value = input.value;
  const cursorPosition = input.selectionStart;
  
  // If user presses Delete or Backspace and cursor is at the beginning of "0"
  if ((e.key === 'Delete' || e.key === 'Backspace') && value === '0' && cursorPosition === 0) {
    e.preventDefault();
    input.value = '';
    return;
  }
  
  // Allow only numeric keys, backspace, delete, arrow keys, tab, etc.
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 
    'ArrowUp', 'ArrowDown', 'Home', 'End'
  ];
  
  if (allowedKeys.includes(e.key) || /[0-9]/.test(e.key)) {
    return; // Allow these keys
  }
  
  e.preventDefault(); // Block other keys
};

// Handle numeric input (for percentages, days, etc.)
export const handleNumericKeyDown = (e) => {
  // Allow only numeric keys, backspace, delete, arrow keys, tab, etc.
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 
    'ArrowUp', 'ArrowDown', 'Home', 'End', '.'
  ];
  
  if (allowedKeys.includes(e.key) || /[0-9]/.test(e.key)) {
    return; // Allow these keys
  }
  
  e.preventDefault(); // Block other keys
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

// Format currency for display (alias)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};