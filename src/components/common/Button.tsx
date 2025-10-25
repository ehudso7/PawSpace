import React from 'react';
<<<<<<< HEAD
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/constants/theme';
=======
<<<<<<< HEAD
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', style, ...props }) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant], style]}
      {...props}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
=======
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
>>>>>>> origin/main

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
<<<<<<< HEAD
      activeOpacity={0.7}
=======
>>>>>>> origin/main
    >
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
        {title}
      </Text>
<<<<<<< HEAD
=======
>>>>>>> origin/main
>>>>>>> origin/main
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
<<<<<<< HEAD
=======
<<<<<<< HEAD
    paddingVertical: 12,
    paddingHorizontal: 24,
=======
>>>>>>> origin/main
>>>>>>> origin/main
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
<<<<<<< HEAD
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
=======
    backgroundColor: '#007AFF',
  },
  secondary: {
<<<<<<< HEAD
    backgroundColor: '#5856D6',
=======
    backgroundColor: '#6C757D',
>>>>>>> origin/main
>>>>>>> origin/main
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
<<<<<<< HEAD
    borderColor: theme.colors.primary,
  },
=======
    borderColor: '#007AFF',
  },
<<<<<<< HEAD
  text: {
    fontSize: 16,
=======
>>>>>>> origin/main
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
<<<<<<< HEAD
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryText: {
    color: theme.colors.white,
  },
  outlineText: {
    color: theme.colors.primary,
  },
});

export default Button;
=======
>>>>>>> origin/main
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#007AFF',
  },
});

<<<<<<< HEAD
export default Button;
=======
export default Button;
>>>>>>> origin/main
>>>>>>> origin/main
