// Email validation
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { isValid: false, error: 'Email is required' };
  if (!emailRegex.test(email)) return { isValid: false, error: 'Please enter a valid email address' };
  return { isValid: true };
};

// Password validation
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) return { isValid: false, error: 'Password is required' };
  if (password.length < 8) return { isValid: false, error: 'Password must be at least 8 characters long' };
  if (!/[A-Z]/.test(password)) return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  if (!/[a-z]/.test(password)) return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  if (!/\d/.test(password)) return { isValid: false, error: 'Password must contain at least one number' };
  return { isValid: true };
};

export const validateConfirmPassword = (password: string, confirmPassword: string): { isValid: boolean; error?: string } => {
  if (!confirmPassword) return { isValid: false, error: 'Please confirm your password' };
  if (password !== confirmPassword) return { isValid: false, error: 'Passwords do not match' };
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name) return { isValid: false, error: 'Name is required' };
  if (name.trim().length < 2) return { isValid: false, error: 'Name must be at least 2 characters long' };
  if (name.trim().length > 50) return { isValid: false, error: 'Name must be less than 50 characters long' };
  return { isValid: true };
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) return { isValid: true };
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  if (!phoneRegex.test(phone)) return { isValid: false, error: 'Please enter a valid phone number' };
  return { isValid: true };
};

export const validateDate = (date: string): { isValid: boolean; error?: string } => {
  if (!date) return { isValid: false, error: 'Date is required' };
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) return { isValid: false, error: 'Date cannot be in the past' };
  return { isValid: true };
};

export const validateFileSize = (fileSize: number, maxSizeBytes = 10 * 1024 * 1024): { isValid: boolean; error?: string } => {
  if (fileSize > maxSizeBytes) {
    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
    return { isValid: false, error: `File size cannot exceed ${maxSizeMB}MB` };
  }
  return { isValid: true };
};

export const validateImageType = (mimeType: string): { isValid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(mimeType)) return { isValid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  return { isValid: true };
};

export const validateForm = (
  fields: Record<string, any>,
  validators: Record<string, (value: any) => { isValid: boolean; error?: string }>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;
  Object.keys(validators).forEach((field) => {
    const validation = validators[field](fields[field]);
    if (!validation.isValid && validation.error) {
      errors[field] = validation.error;
      isValid = false;
    }
  });
  return { isValid, errors };
};
