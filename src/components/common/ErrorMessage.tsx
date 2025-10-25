import React from 'react';
import { Text, StyleSheet } from 'react-native';

export type ErrorMessageProps = {
  message?: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps): JSX.Element {
  if (!message) return <Text style={styles.hidden} />;
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: { color: '#d00', fontSize: 12, marginTop: 4 },
  hidden: { height: 0 },
});
