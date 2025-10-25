import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export type InputProps = TextInputProps & {
  errorText?: string;
};

export const Input: React.FC<InputProps> = (props) => {
  return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  }
});
