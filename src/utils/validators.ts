/**
 * Validation utilities for form inputs
 */

import { ValidationResult } from '../types';

/**
 * Validates email format using regex
 * @param email - Email address to validate
 * @returns boolean indicating if email is valid
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * 
 * @param password - Password to validate
 * @returns object with valid flag and array of error messages
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    return {
      valid: false,
      errors: ['Password is required'],
    };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates phone number format
 * Accepts various formats: (123) 456-7890, 123-456-7890, 1234567890, +1234567890
 * @param phone - Phone number to validate
 * @returns boolean indicating if phone is valid
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Should have at least 10 digits (US format) or more (international)
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

/**
 * Validates full name
 * @param name - Full name to validate
 * @returns boolean indicating if name is valid
 */
export const validateFullName = (name: string): boolean => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  const trimmed = name.trim();
  // Should have at least 2 characters and contain at least one space (first and last name)
  return trimmed.length >= 2;
};

/**
 * Checks if passwords match
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns boolean indicating if passwords match
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword && password.length > 0;
};
