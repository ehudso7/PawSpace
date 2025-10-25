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
