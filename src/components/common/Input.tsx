import React from 'react';
<<<<<<< HEAD
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { theme } from '@/constants/theme';
=======
<<<<<<< HEAD
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
=======
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
>>>>>>> origin/main
>>>>>>> origin/main

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
<<<<<<< HEAD
=======
<<<<<<< HEAD
}

const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
=======
>>>>>>> origin/main
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
<<<<<<< HEAD
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={theme.colors.gray}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
=======
        style={[styles.input, error && styles.inputError, style]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
>>>>>>> origin/main
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
<<<<<<< HEAD
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
=======
<<<<<<< HEAD
    fontSize: 14,
    fontWeight: '600',
=======
    fontSize: 16,
    fontWeight: '500',
>>>>>>> origin/main
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
<<<<<<< HEAD
    paddingVertical: 12,
    paddingHorizontal: 16,
=======
    paddingHorizontal: 12,
    paddingVertical: 10,
>>>>>>> origin/main
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
<<<<<<< HEAD
  error: {
    color: '#FF3B30',
    fontSize: 12,
=======
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
>>>>>>> origin/main
>>>>>>> origin/main
    marginTop: 4,
  },
});

<<<<<<< HEAD
export default Input;
=======
<<<<<<< HEAD
export default Input;
=======
export default Input;
>>>>>>> origin/main
>>>>>>> origin/main
