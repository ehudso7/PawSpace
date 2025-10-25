import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../constants/theme';

interface SettingItemProps {
  label: string;
  description?: string;
  type?: 'toggle' | 'navigation' | 'text';
  value?: boolean | string;
  onPress?: () => void;
  onValueChange?: (value: boolean) => void;
  destructive?: boolean;
}

export const SettingItem: React.FC<SettingItemProps> = ({
  label,
  description,
  type = 'navigation',
  value,
  onPress,
  onValueChange,
  destructive = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={type === 'toggle'}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.label, destructive && styles.destructive]}>
          {label}
        </Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <View style={styles.action}>
        {type === 'toggle' && (
          <Switch
            value={value as boolean}
            onValueChange={onValueChange}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        )}
        {type === 'text' && (
          <Text style={styles.valueText}>{value as string}</Text>
        )}
        {type === 'navigation' && (
          <Text style={styles.chevron}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  content: {
    flex: 1,
    marginRight: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  action: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  destructive: {
    color: COLORS.error,
  },
});
