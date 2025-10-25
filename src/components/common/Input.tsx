import React from 'react';
<<<<<<< HEAD
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
=======
import { TextInput, View, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
>>>>>>> origin/main

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
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
        style={[styles.input, error && styles.inputError, style]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    marginTop: 4,
  },
});

<<<<<<< HEAD
export default Input;
=======
export default Input;
>>>>>>> origin/main
