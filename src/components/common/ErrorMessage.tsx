import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

export type ErrorMessageProps = {
  message?: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 8
  },
  text: {
    color: '#991b1b'
  }
});
