import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface Props {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
  radius?: number;
}

export const Skeleton: React.FC<Props> = ({ width = '100%', height = 16, style, radius = 8 }) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = 0.5 + 0.5 * Math.abs(0.5 - progress.value);
    return { opacity };
  });

  return (
    <Animated.View style={[styles.skeleton, { width, height, borderRadius: radius }, animatedStyle, style]} />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E1E9EE',
  },
});
