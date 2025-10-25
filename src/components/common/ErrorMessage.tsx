import React from 'react';
<<<<<<< HEAD
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

interface ErrorMessageProps {
  message: string;
  style?: ViewStyle;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
      <Text style={styles.text}>{message}</Text>
=======
import { View, Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  message: string;
<<<<<<< HEAD
  type?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, type = 'error' }) => {
  return (
    <View style={[styles.container, styles[type]]}>
      <Text style={styles.message}>{message}</Text>
=======
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Text style={styles.retryText} onPress={onRetry}>
          Tap to retry
        </Text>
      )}
>>>>>>> origin/main
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorBackground,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  text: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.error,
  },
});

export default ErrorMessage;
=======
<<<<<<< HEAD
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  error: {
    backgroundColor: '#FFE5E5',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  warning: {
    backgroundColor: '#FFF4E5',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  info: {
    backgroundColor: '#E5F0FF',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
});

export default ErrorMessage;
=======
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default ErrorMessage;
>>>>>>> origin/main
>>>>>>> origin/main
