import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

export const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.lg,
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
});
