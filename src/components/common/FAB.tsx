import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface Props {
  onPress: () => void;
}

export function FAB({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={{ position: 'absolute', right: spacing.lg, bottom: spacing.xxl, backgroundColor: colors.accent, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 }}>
      <Text style={{ color: 'white', fontSize: 28, marginTop: -4 }}>＋</Text>
    </Pressable>
  );
}

export default FAB;
