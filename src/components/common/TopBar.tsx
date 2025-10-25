import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface Props {
  title: string;
  onSearch?: () => void;
  onFilter?: () => void;
}

export function TopBar({ title, onSearch, onFilter }: Props) {
  return (
    <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.textPrimary, fontWeight: '700', fontSize: 18 }}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Pressable onPress={onSearch} hitSlop={8}><Text style={{ color: colors.textSecondary }}>🔎</Text></Pressable>
        <Pressable onPress={onFilter} hitSlop={8}><Text style={{ color: colors.textSecondary }}>⛃</Text></Pressable>
      </View>
    </View>
  );
}

export default TopBar;
