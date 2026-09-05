import { format } from 'date-fns';

export const formatCurrency = (number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(number);
};

export const formatDate = (date, opts = {}) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return format(date, {
    ...{
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    ...opts
  });
};

export const calculatePercentage = (part, total) => {
  if (total === 0) return 0;
  return ((part / total) * 100).toFixed(1);
};

export const getIconForType = (type) => {
  // This would return a ReactIcon component, but for simplicity we return a string
  // In a real implementation, you would import and return the appropriate icon from react-icons
  return type === 'income' ? 'AiOutlineWallet' : 'AiOutlineMinusSquare';
};