import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import theme from '@/constants/theme';

interface ErrorMessageProps {
  message: string;
  style?: ViewStyle;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  text: {
    color: theme.colors.text,
    fontSize: 14,
  },
});

export default ErrorMessage;
