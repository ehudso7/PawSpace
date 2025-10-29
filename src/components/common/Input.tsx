import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import theme from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput style={[styles.input, error && styles.inputError, style]} placeholderTextColor={theme.colors.gray} {...props} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '500', color: theme.colors.text, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  inputError: { borderColor: '#EF4444' },
  error: { color: '#EF4444', fontSize: 12, marginTop: 4 },
});

export default Input;
