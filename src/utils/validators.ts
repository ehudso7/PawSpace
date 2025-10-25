export function validateEmail(email: string): boolean {
  // Basic RFC 5322 compliant-ish regex for most common cases
  const regex = /^(?:[a-zA-Z0-9_'^&\/+{}=?`|~!-]+(?:\.[a-zA-Z0-9_'^&\/+{}=?`|~!-]+)*)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return regex.test(String(email).trim());
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!password || password.length < 8) {
    errors.push('At least 8 characters');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('At least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>\[\]\\/;'`~_-]/.test(password)) {
    errors.push('At least one special character');
  }
  return { valid: errors.length === 0, errors };
}

export function validatePhone(phone: string): boolean {
  // Accept common international formats with optional +, spaces, dashes, parentheses
  const cleaned = String(phone).trim();
  if (!cleaned) return false;
  const regex = /^\+?[0-9 ()-]{7,20}$/;
  return regex.test(cleaned);
}
