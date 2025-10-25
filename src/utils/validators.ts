export function isEmail(value: string): boolean {
  return /.+@.+\..+/.test(value);
}

export function isNonEmpty(value: string | null | undefined): boolean {
  return !!value && value.trim().length > 0;
}
