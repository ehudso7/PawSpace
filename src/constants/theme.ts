export const colors = {
  background: '#F7F7F7',
  text: '#111111',
  primary: '#3B82F6',
  secondary: '#10B981',
  danger: '#EF4444',
  card: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const typography = {
  title: { fontSize: 20, fontWeight: '700' as const },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
};

export const theme = { colors, spacing, typography } as const;
export type Theme = typeof theme;
