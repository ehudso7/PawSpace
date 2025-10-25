import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const ServiceCardSkeleton: React.FC = () => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, {
        duration: 1000,
        easing: Easing.ease,
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Animated.View style={[styles.avatar, styles.skeleton, animatedStyle]} />
        <View style={styles.content}>
          <Animated.View style={[styles.titleSkeleton, styles.skeleton, animatedStyle]} />
          <Animated.View style={[styles.subtitleSkeleton, styles.skeleton, animatedStyle]} />
          <Animated.View style={[styles.priceSkeleton, styles.skeleton, animatedStyle]} />
        </View>
        <Animated.View style={[styles.buttonSkeleton, styles.skeleton, animatedStyle]} />
      </View>
      <Animated.View style={[styles.imageSkeleton, styles.skeleton, animatedStyle]} />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  container: {
    flexDirection: 'row',
    padding: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  titleSkeleton: {
    height: 18,
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitleSkeleton: {
    height: 14,
    width: '50%',
    borderRadius: 4,
    marginBottom: 6,
  },
  priceSkeleton: {
    height: 16,
    width: '40%',
    borderRadius: 4,
  },
  buttonSkeleton: {
    width: 80,
    height: 36,
    borderRadius: 8,
    alignSelf: 'center',
  },
  imageSkeleton: {
    height: 180,
    width: '100%',
  },
  skeleton: {
    backgroundColor: '#E0E0E0',
  },
});
