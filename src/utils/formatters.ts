import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatDate = (date: string | Date, pattern = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return format(dateObj, pattern);
  } catch {
    return 'Invalid date';
  }
};

export const formatTime = (date: string | Date, pattern = 'h:mm a'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid time';
    return format(dateObj, pattern);
  } catch {
    return 'Invalid time';
  }
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
};

export const formatNumber = (num: number, locale = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch {
    return String(num);
  }
};

export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, Math.max(0, maxLength - suffix.length)) + suffix;
};

export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
