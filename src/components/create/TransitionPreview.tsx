import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { TransitionType } from '../../types/editor';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TransitionPreviewProps {
  beforeImage: string;
  afterImage: string;
  transition: TransitionType;
  isPlaying: boolean;
  duration?: number;
}

export const TransitionPreview: React.FC<TransitionPreviewProps> = ({
  beforeImage,
  afterImage,
  transition,
  isPlaying,
  duration = 2000,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isPlaying) {
      progress.value = 0;
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      progress.value = withTiming(0, { duration: 300 });
    }
  }, [isPlaying, transition, duration]);

  const fadeStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    };
  });

  const slideStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: (1 - progress.value) * SCREEN_WIDTH,
        },
      ],
    };
  });

  const swipeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: progress.value * SCREEN_WIDTH,
        },
      ],
    };
  });

  const splitLeftStyle = useAnimatedStyle(() => {
    return {
      width: progress.value * SCREEN_WIDTH,
    };
  });

  const renderTransition = () => {
    switch (transition) {
      case 'fade':
        return (
          <View style={styles.container}>
            <Image source={{ uri: beforeImage }} style={styles.image} />
            <Animated.View style={[styles.overlayImage, fadeStyle]}>
              <Image source={{ uri: afterImage }} style={styles.image} />
            </Animated.View>
          </View>
        );

      case 'slide':
        return (
          <View style={styles.container}>
            <Image source={{ uri: beforeImage }} style={styles.image} />
            <Animated.View style={[styles.overlayImage, slideStyle]}>
              <Image source={{ uri: afterImage }} style={styles.image} />
            </Animated.View>
          </View>
        );

      case 'swipe':
        return (
          <View style={styles.container}>
            <Animated.View style={[styles.overlayImage, swipeStyle]}>
              <Image source={{ uri: beforeImage }} style={styles.image} />
            </Animated.View>
            <Image source={{ uri: afterImage }} style={styles.image} />
          </View>
        );

      case 'split':
        return (
          <View style={styles.container}>
            <View style={styles.splitContainer}>
              {/* Before image (left side) */}
              <View style={styles.beforeSplit}>
                <Image source={{ uri: beforeImage }} style={styles.image} />
              </View>
              
              {/* After image (right side, expanding) */}
              <Animated.View style={[styles.afterSplit, splitLeftStyle]}>
                <Image
                  source={{ uri: afterImage }}
                  style={[styles.image, { width: SCREEN_WIDTH }]}
                />
              </Animated.View>
            </View>
          </View>
        );

      default:
        return (
          <View style={styles.container}>
            <Image source={{ uri: beforeImage }} style={styles.image} />
          </View>
        );
    }
  };

  return renderTransition();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  beforeSplit: {
    flex: 1,
    overflow: 'hidden',
  },
  afterSplit: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
});
