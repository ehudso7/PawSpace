import React from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  multiline,
  rows = 4,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          multiline && { height: rows * 20, textAlignVertical: 'top' },
          error && styles.input_error,
          style,
        ]}
        placeholderTextColor={COLORS.textLight}
        multiline={multiline}
        numberOfLines={multiline ? rows : 1}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  input_error: {
    borderColor: COLORS.error,
  },
  error: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
});
