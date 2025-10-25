import React, { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { colors } from '../../theme/colors';

interface Props {
  isLiked: boolean;
  count: number;
  onToggle: () => void;
}

export const LikeButton = memo(function LikeButton({ isLiked, count, onToggle }: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  function handlePress() {
    scale.value = withSpring(1.2, { damping: 10 }, () => {
      scale.value = withTiming(1);
    });
    opacity.value = withTiming(0.8, { duration: 100 }, () => (opacity.value = withTiming(1, { duration: 100 })));
    onToggle();
  }

  return (
    <Pressable onPress={handlePress} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Animated.View style={[{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 6 }, animatedStyle]}>
        <Text style={{ color: isLiked ? colors.accent : colors.textSecondary }}>♥</Text>
      </Animated.View>
      <Text style={{ color: colors.textSecondary }}>{count}</Text>
    </Pressable>
  );
});
