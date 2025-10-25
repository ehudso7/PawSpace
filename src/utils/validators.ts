export function isEmail(value: string): boolean {
  return /\S+@\S+\.\S+/.test(value);
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}
