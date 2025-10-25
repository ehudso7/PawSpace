import { ValidationResult } from '../types';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): ValidationResult => {
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
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid US phone number (10 digits)
  // You can modify this regex based on your requirements
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(cleanPhone);
};

export const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length > 0;
};

export const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateLocation = (location: string): boolean => {
  return location.trim().length >= 2;
};