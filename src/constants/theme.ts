export const COLORS = {
  primary: '#6B4CE6',
  secondary: '#FF6B9D',
  accent: '#FFA400',
  
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#999999',
  
  border: '#E0E0E0',
  divider: '#EEEEEE',
  
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  white: '#FFFFFF',
  black: '#000000',
  
  // Dark mode colors
  darkBackground: '#1A1A1A',
  darkBackgroundSecondary: '#2A2A2A',
  darkText: '#FFFFFF',
  darkTextSecondary: '#CCCCCC',
  darkBorder: '#3A3A3A',
};

export const DARK_COLORS = {
  ...COLORS,
  background: COLORS.darkBackground,
  backgroundSecondary: COLORS.darkBackgroundSecondary,
  text: COLORS.darkText,
  textSecondary: COLORS.darkTextSecondary,
  border: COLORS.darkBorder,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const FONT_WEIGHTS = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};
