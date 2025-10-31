import { APP_CONFIG } from '../config/appConfig';

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
  maxDate.setDate(maxDate.getDate() + (APP_CONFIG.pagination?.defaultLimit || 90));
  
  if (selectedDate > maxDate) {
    return { isValid: false, error: `Date cannot be more than 90 days in advance` };
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
