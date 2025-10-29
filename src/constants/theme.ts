import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    // Primary Colors
    primary: '#6366F1', // Indigo
    primaryDark: '#4F46E5',
    primaryLight: '#A5B4FC',
    
    // Secondary Colors
    secondary: '#EC4899', // Pink
    secondaryDark: '#DB2777',
    secondaryLight: '#F9A8D4',
    
    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',
    gray: '#6B7280',
    lightGray: '#F3F4F6',
    darkGray: '#374151',
    
    // Background Colors
    background: '#F9FAFB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text Colors
    text: '#111827',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    
    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Status Background Colors
    successBackground: '#D1FAE5',
    warningBackground: '#FEF3C7',
    errorBackground: '#FEE2E2',
    infoBackground: '#DBEAFE',
    
    // Border Colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    borderDark: '#D1D5DB',
    
    // Other Colors
    disabled: '#F3F4F6',
    placeholder: '#9CA3AF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  fonts: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 80,
    '5xl': 96,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    '3xl': 32,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  
  dimensions: {
    window: { width, height },
    screen: { width, height },
    isSmallDevice: width < 375,
    isLargeDevice: width > 414,
  },
  
  layout: {
    headerHeight: 60,
    tabBarHeight: 80,
    statusBarHeight: 44,
    bottomSafeArea: 34,
  },
  
  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      linear: 'linear',
    },
  },
  
  zIndex: {
    modal: 1000,
    overlay: 999,
    dropdown: 998,
    header: 997,
    fab: 996,
  },
};

// Theme utility functions
export const getSpacing = (multiplier: number): number => {
  return theme.spacing.md * multiplier;
};

export const getFontSize = (size: keyof typeof theme.fonts): number => {
  return theme.fonts[size] as number;
};

export const getColor = (color: keyof typeof theme.colors): string => {
  return theme.colors[color];
};

export const getShadow = (level: keyof typeof theme.shadows) => {
  return theme.shadows[level];
};

export const getBorderRadius = (size: keyof typeof theme.borderRadius): number => {
  return theme.borderRadius[size];
};

export default theme;