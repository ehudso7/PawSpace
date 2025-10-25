import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

// Date formatting
export const formatDate = (date: string | Date, formatString = 'MMM dd, yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    return format(dateObj, formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

// Time formatting
export const formatTime = (date: string | Date, formatString = 'h:mm a'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid time';
    }
    
    return format(dateObj, formatString);
  } catch (error) {
    return 'Invalid time';
  }
};

// Relative time formatting (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

// Currency formatting
export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `$${amount.toFixed(2)}`;
  }
};

// Price formatting (without currency symbol for display)
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

// Number formatting with commas
export const formatNumber = (num: number, locale = 'en-US'): string => {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch (error) {
    return num.toString();
  }
};

// Phone number formatting
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a US number (10 or 11 digits)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // Return original if not a standard US format
  return phone;
};

// Name formatting (capitalize first letter of each word)
export const formatName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Duration formatting (minutes to hours and minutes)
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
};

// Rating formatting
export const formatRating = (rating: number, maxRating = 5): string => {
  return `${rating.toFixed(1)}/${maxRating}`;
};

// Percentage formatting
export const formatPercentage = (value: number, total: number): string => {
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

// Text truncation
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength - suffix.length) + suffix;
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Convert camelCase to Title Case
export const camelToTitle = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
};

// Format booking status for display
export const formatBookingStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  };
  
  return statusMap[status] || capitalize(status);
};

// Format service category for display
export const formatServiceCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    grooming: 'Grooming',
    training: 'Training',
    veterinary: 'Veterinary',
    boarding: 'Pet Boarding',
    walking: 'Dog Walking',
    sitting: 'Pet Sitting',
    photography: 'Pet Photography',
    other: 'Other Services',
  };
  
  return categoryMap[category] || capitalize(category);
};

// Format pet species for display
export const formatPetSpecies = (species: string): string => {
  const speciesMap: Record<string, string> = {
    dog: 'Dog',
    cat: 'Cat',
    bird: 'Bird',
    rabbit: 'Rabbit',
    other: 'Other',
  };
  
  return speciesMap[species] || capitalize(species);
};

// Format subscription plan for display
export const formatSubscriptionPlan = (plan: string): string => {
  const planMap: Record<string, string> = {
    free: 'Free',
    premium: 'Premium',
    pro: 'Pro',
  };
  
  return planMap[plan] || capitalize(plan);
};

// Format array as comma-separated string
export const formatArray = (arr: string[], separator = ', ', lastSeparator = ' and '): string => {
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return arr.join(lastSeparator);
  
  return arr.slice(0, -1).join(separator) + lastSeparator + arr[arr.length - 1];
};

// Format initials from name
export const formatInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

// Format address (basic formatting)
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    address.city,
    address.state && address.zipCode ? `${address.state} ${address.zipCode}` : address.state || address.zipCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
};