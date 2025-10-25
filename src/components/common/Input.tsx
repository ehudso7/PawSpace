import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export type InputProps = TextInputProps & {
  errorText?: string;
};

export default function Input(props: InputProps): JSX.Element {
  return <TextInput {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
