import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface Props {
  beforeUri: string;
  afterUri: string;
  transition: 'fade' | 'slide' | 'swipe' | 'split';
}

const TransitionPreview: React.FC<Props> = ({ beforeUri, afterUri, transition }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.cubic) }), -1, true);
  }, [transition]);

  const beforeStyle = useAnimatedStyle(() => {
    switch (transition) {
      case 'fade':
        return { opacity: 1 - progress.value };
      case 'slide':
        return { transform: [{ translateX: -progress.value * 50 }] };
      case 'swipe':
        return { transform: [{ translateX: -progress.value * 200 }] };
      case 'split':
        return { transform: [{ translateY: -progress.value * 50 }] };
      default:
        return {};
    }
  });

  const afterStyle = useAnimatedStyle(() => {
    switch (transition) {
      case 'fade':
        return { opacity: progress.value };
      case 'slide':
        return { transform: [{ translateX: (1 - progress.value) * 50 }] };
      case 'swipe':
        return { transform: [{ translateX: (1 - progress.value) * 200 }] };
      case 'split':
        return { transform: [{ translateY: (1 - progress.value) * 50 }] };
      default:
        return {};
    }
  });

  return (
    <Animated.View style={styles.container}>
      <Animated.Image source={{ uri: beforeUri }} style={[StyleSheet.absoluteFillObject as any, beforeStyle]} />
      <Animated.Image source={{ uri: afterUri }} style={[StyleSheet.absoluteFillObject as any, afterStyle]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
});

export default TransitionPreview;
