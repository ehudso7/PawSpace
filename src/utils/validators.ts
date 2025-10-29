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

// Name validation
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  
  return { isValid: true };
};

// Phone validation
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) {
    return { isValid: true }; // Phone is optional
  }
  
  const phoneRegex = /^\+?[\d\s-()]+$/;
  
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }
  
  return { isValid: true };
};

// Bio validation
export const validateBio = (bio: string): { isValid: boolean; error?: string } => {
  if (!bio) {
    return { isValid: true }; // Bio is optional
  }
  
  if (bio.length > 500) {
    return { isValid: false, error: 'Bio must be less than 500 characters' };
  }
  
  return { isValid: true };
};

// Caption validation
export const validateCaption = (caption: string): { isValid: boolean; error?: string } => {
  if (!caption) {
    return { isValid: true }; // Caption is optional
  }
  
  if (caption.length > 2000) {
    return { isValid: false, error: 'Caption must be less than 2000 characters' };
  }
  
  return { isValid: true };
};

// URL validation
export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url) {
    return { isValid: true }; // URL is optional
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

// Date validation
export const validateDate = (date: string): { isValid: boolean; error?: string } => {
  if (!date) {
    return { isValid: false, error: 'Date is required' };
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) {
    return { isValid: false, error: 'Date cannot be in the past' };
  }
  
  return { isValid: true };
};

// Time validation
export const validateTime = (time: string): { isValid: boolean; error?: string } => {
  if (!time) {
    return { isValid: false, error: 'Time is required' };
  }
  
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (!timeRegex.test(time)) {
    return { isValid: false, error: 'Please enter a valid time (HH:MM format)' };
  }
  
  return { isValid: true };
};

// Rating validation
export const validateRating = (rating: number, maxRating = 5): { isValid: boolean; error?: string } => {
  if (rating < 0 || rating > maxRating) {
    return { isValid: false, error: `Rating must be between 0 and ${maxRating}` };
  }
  
  return { isValid: true };
};

// Form validation helper
export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => { isValid: boolean; error?: string }>): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  for (const [field, validator] of Object.entries(rules)) {
    const result = validator(data[field]);
    
    if (!result.isValid) {
      errors[field] = result.error || 'Invalid value';
      isValid = false;
    }
  }
  
  return { isValid, errors };
};