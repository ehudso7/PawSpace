export function validateEmail(email: string): boolean {
  if (!email) return false;
  const re = /^(?:[a-zA-Z0-9_'^&+{}=\-`~]+(?:\.[a-zA-Z0-9_'^&+{}=\-`~]+)*|"(?:[^"]|\\")+")@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Include at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Include at least one lowercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Include at least one number.');
  }
  if (!/[!@#$%^&*(),.?":{}|<>\[\]\\/;'`~_+=\-]/.test(password)) {
    errors.push('Include at least one special character.');
  }
  return { valid: errors.length === 0, errors };
}

export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  // Accept E.164 or local digits (7-15 digits), allow spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-().]/g, '');
  const re = /^\+?[0-9]{7,15}$/;
  return re.test(cleaned);
}
