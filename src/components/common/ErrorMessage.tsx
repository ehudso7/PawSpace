import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, type = 'error' }) => {
  return (
    <View style={[styles.container, styles[type]]}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
