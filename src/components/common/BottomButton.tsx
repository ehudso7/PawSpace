import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

interface Props {
  title: string;
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const BottomButton: React.FC<Props> = ({ title, disabled, onPress, style }) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled ? styles.disabled : styles.enabled,
        pressed && !disabled ? { opacity: 0.85 } : null,
        style,
      ]}
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  enabled: { backgroundColor: '#4f46e5' },
  disabled: { backgroundColor: '#334155' },
  title: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default BottomButton;
