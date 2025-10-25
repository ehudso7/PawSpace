<<<<<<< HEAD
import { APP_CONFIG } from '@/constants/config';

// Email validation
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  const { validation } = APP_CONFIG;
  
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < validation.password.minLength) {
    return { isValid: false, error: `Password must be at least ${validation.password.minLength} characters long` };
  }
  
  if (validation.password.requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  
  if (validation.password.requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  
  if (validation.password.requireNumbers && !/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  
  if (validation.password.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  
  return { isValid: true };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  
  return { isValid: true };
};

// Name validation
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters long' };
  }
  
  return { isValid: true };
};

// Phone validation
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: true }; // Phone is optional in most cases
  }
  
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  return { isValid: true };
};

// Username validation
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  const { validation } = APP_CONFIG;
  
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < validation.username.minLength) {
    return { isValid: false, error: `Username must be at least ${validation.username.minLength} characters long` };
  }
  
  if (username.length > validation.username.maxLength) {
    return { isValid: false, error: `Username must be less than ${validation.username.maxLength} characters long` };
  }
  
  if (!validation.username.allowedChars.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, dots, hyphens, and underscores' };
  }
  
  return { isValid: true };
};

// Bio validation
export const validateBio = (bio: string): { isValid: boolean; error?: string } => {
  const { validation } = APP_CONFIG;
  
  if (!bio) {
    return { isValid: true }; // Bio is optional
  }
  
  if (bio.length > validation.bio.maxLength) {
    return { isValid: false, error: `Bio must be less than ${validation.bio.maxLength} characters long` };
  }
  
  return { isValid: true };
};

// Caption validation
export const validateCaption = (caption: string): { isValid: boolean; error?: string } => {
  const { validation } = APP_CONFIG;
  
  if (!caption) {
    return { isValid: false, error: 'Caption is required' };
  }
  
  if (caption.length > validation.caption.maxLength) {
    return { isValid: false, error: `Caption must be less than ${validation.caption.maxLength} characters long` };
  }
  
  return { isValid: true };
};

// Price validation
export const validatePrice = (price: string | number): { isValid: boolean; error?: string } => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Please enter a valid price' };
  }
  
  if (numPrice < 0) {
    return { isValid: false, error: 'Price cannot be negative' };
  }
  
  if (numPrice > 10000) {
    return { isValid: false, error: 'Price cannot exceed $10,000' };
  }
  
  return { isValid: true };
};

// Date validation
export const validateDate = (date: string): { isValid: boolean; error?: string } => {
  if (!date) {
    return { isValid: false, error: 'Date is required' };
  }
  
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return { isValid: false, error: 'Date cannot be in the past' };
  }
  
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + APP_CONFIG.booking.maxAdvanceBookingDays);
  
  if (selectedDate > maxDate) {
    return { isValid: false, error: `Date cannot be more than ${APP_CONFIG.booking.maxAdvanceBookingDays} days in advance` };
  }
  
  return { isValid: true };
};

// Time validation
export const validateTime = (time: string, date: string): { isValid: boolean; error?: string } => {
  if (!time) {
    return { isValid: false, error: 'Time is required' };
  }
  
  const selectedDateTime = new Date(`${date} ${time}`);
  const now = new Date();
  const minBookingTime = new Date(now.getTime() + (APP_CONFIG.booking.minAdvanceBookingHours * 60 * 60 * 1000));
  
  if (selectedDateTime < minBookingTime) {
    return { isValid: false, error: `Booking must be at least ${APP_CONFIG.booking.minAdvanceBookingHours} hours in advance` };
  }
  
  return { isValid: true };
};

// File size validation
export const validateFileSize = (fileSize: number): { isValid: boolean; error?: string } => {
  const maxSize = APP_CONFIG.storage.maxFileSize;
  
  if (fileSize > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { isValid: false, error: `File size cannot exceed ${maxSizeMB}MB` };
  }
  
  return { isValid: true };
};

// Image type validation
export const validateImageType = (mimeType: string): { isValid: boolean; error?: string } => {
  const allowedTypes = APP_CONFIG.storage.allowedImageTypes;
  
  if (!allowedTypes.includes(mimeType)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  
  return { isValid: true };
};

// Form validation helper
export const validateForm = (fields: Record<string, any>, validators: Record<string, (value: any) => { isValid: boolean; error?: string }>): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  Object.keys(validators).forEach(field => {
    const validation = validators[field](fields[field]);
    if (!validation.isValid && validation.error) {
      errors[field] = validation.error;
      isValid = false;
    }
  });
  
  return { isValid, errors };
};
=======
<<<<<<< HEAD
import { config } from '@/constants';

// Email validation
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  if (email.length < config.validation.email.minLength) {
    return { valid: false, error: `Email must be at least ${config.validation.email.minLength} characters` };
  }

  if (email.length > config.validation.email.maxLength) {
    return { valid: false, error: `Email must be less than ${config.validation.email.maxLength} characters` };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
};

// Password validation
export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < config.validation.password.minLength) {
    return { valid: false, error: `Password must be at least ${config.validation.password.minLength} characters` };
  }

  if (password.length > config.validation.password.maxLength) {
    return { valid: false, error: `Password must be less than ${config.validation.password.maxLength} characters` };
  }

  if (config.validation.password.requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (config.validation.password.requireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (config.validation.password.requireNumber && !/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  if (config.validation.password.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }

  return { valid: true };
};

// Name validation
export const validateName = (name: string): { valid: boolean; error?: string } => {
  if (!name) {
    return { valid: false, error: 'Name is required' };
  }

  if (name.length < config.validation.name.minLength) {
    return { valid: false, error: `Name must be at least ${config.validation.name.minLength} characters` };
  }

  if (name.length > config.validation.name.maxLength) {
    return { valid: false, error: `Name must be less than ${config.validation.name.maxLength} characters` };
  }

  return { valid: true };
};

// Phone number validation (basic)
export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }

  const phoneRegex = /^\+?[\d\s\-()]+$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'Invalid phone number format' };
  }

  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { valid: false, error: 'Phone number must be between 10 and 15 digits' };
  }

  return { valid: true };
};

// URL validation
export const validateUrl = (url: string): { valid: boolean; error?: string } => {
  if (!url) {
    return { valid: false, error: 'URL is required' };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
};
=======
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  required: (value: string | number | undefined | null): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== undefined && value !== null;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  positiveNumber: (value: number): boolean => {
    return value > 0;
  },

  futureDate: (date: Date): boolean => {
    return date > new Date();
  },

  pastDate: (date: Date): boolean => {
    return date < new Date();
  },
};
>>>>>>> origin/main
>>>>>>> origin/main
