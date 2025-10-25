import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface PaymentButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
  title,
  variant = 'primary',
  size = 'medium',
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${variant}Button`]];
    
    if (isDisabled) {
      baseStyle.push(styles.disabledButton);
    }
    
    if (size === 'small') {
      baseStyle.push(styles.smallButton);
    } else if (size === 'large') {
      baseStyle.push(styles.largeButton);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${variant}Text`]];
    
    if (isDisabled) {
      baseStyle.push(styles.disabledText);
    }
    
    if (size === 'small') {
      baseStyle.push(styles.smallText);
    } else if (size === 'large') {
      baseStyle.push(styles.largeText);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? 'white' : '#007AFF'} 
          size="small" 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    backgroundColor: '#E5E5EA',
    borderColor: '#E5E5EA',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#007AFF',
  },
  dangerText: {
    color: 'white',
  },
  disabledText: {
    color: '#8E8E93',
  },
});

export default PaymentButton;