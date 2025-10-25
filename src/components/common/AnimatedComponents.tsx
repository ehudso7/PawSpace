import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

// Animated Heart for like animation
interface AnimatedHeartProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

export const AnimatedHeart: React.FC<AnimatedHeartProps> = ({
  isVisible,
  onAnimationComplete,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (isVisible) {
      scale.value = withSequence(
        withSpring(1.2, { duration: 200 }),
        withSpring(1, { duration: 200 })
      );
      
      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(300, withTiming(0, { duration: 300 }))
      );
      
      translateY.value = withSequence(
        withTiming(-20, { duration: 200 }),
        withTiming(-40, { duration: 300 }, () => {
          if (onAnimationComplete) {
            runOnJS(onAnimationComplete)();
          }
        })
      );
    } else {
      scale.value = 0;
      opacity.value = 0;
      translateY.value = 0;
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.heartContainer, animatedStyle]}>
      <Animated.Text style={styles.heartIcon}>❤️</Animated.Text>
    </Animated.View>
  );
};

// Animated Pull to Refresh Indicator
interface AnimatedPullToRefreshProps {
  pullDistance: number;
  isRefreshing: boolean;
  threshold: number;
}

export const AnimatedPullToRefresh: React.FC<AnimatedPullToRefreshProps> = ({
  pullDistance,
  isRefreshing,
  threshold,
}) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (isRefreshing) {
      rotation.value = withSequence(
        withTiming(360, { duration: 1000 }),
        withTiming(720, { duration: 1000 }),
        withTiming(1080, { duration: 1000 })
      );
    } else {
      rotation.value = withTiming(0, { duration: 300 });
    }
  }, [isRefreshing]);

  const animatedStyle = useAnimatedStyle(() => {
    const progress = Math.min(pullDistance / threshold, 1);
    const scaleValue = interpolate(progress, [0, 1], [0.5, 1], Extrapolate.CLAMP);
    
    return {
      transform: [
        { scale: isRefreshing ? scale.value : scaleValue },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: progress,
    };
  });

  return (
    <Animated.View style={[styles.refreshContainer, animatedStyle]}>
      <Animated.Text style={styles.refreshIcon}>🔄</Animated.Text>
    </Animated.View>
  );
};

// Animated Card Entrance
interface AnimatedCardEntranceProps {
  children: React.ReactNode;
  index: number;
  isVisible: boolean;
}

export const AnimatedCardEntrance: React.FC<AnimatedCardEntranceProps> = ({
  children,
  index,
  isVisible,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    if (isVisible) {
      const delay = index * 100; // Stagger animation
      
      opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
      translateY.value = withDelay(delay, withSpring(0, { damping: 15, stiffness: 150 }));
      scale.value = withDelay(delay, withSpring(1, { damping: 15, stiffness: 150 }));
    }
  }, [isVisible, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

// Animated Button Press
interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  activeOpacity?: number;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onPress,
  style,
  activeOpacity = 0.8,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
    opacity.value = withTiming(activeOpacity, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Animated.View
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        onTouchCancel={handlePressOut}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

// Animated Loading Skeleton
interface AnimatedSkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
}

export const AnimatedSkeleton: React.FC<AnimatedSkeletonProps> = ({
  width,
  height,
  borderRadius = 4,
}) => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withSequence(
      withTiming(0.7, { duration: 800 }),
      withTiming(0.3, { duration: 800 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
        },
        animatedStyle,
      ]}
    />
  );
};

// Animated Progress Bar
interface AnimatedProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  borderRadius?: number;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  height = 4,
  backgroundColor = '#E1E1E1',
  fillColor = '#007AFF',
  borderRadius = 2,
}) => {
  const width = useSharedValue(0);

  React.useEffect(() => {
    width.value = withSpring(progress * 100, {
      damping: 15,
      stiffness: 150,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
    };
  });

  return (
    <View
      style={[
        styles.progressBar,
        {
          height,
          backgroundColor,
          borderRadius,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.progressFill,
          {
            height,
            backgroundColor: fillColor,
            borderRadius,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

// Animated Floating Action Button
interface AnimatedFABProps {
  onPress: () => void;
  isVisible: boolean;
  icon: string;
  style?: any;
}

export const AnimatedFAB: React.FC<AnimatedFABProps> = ({
  onPress,
  isVisible,
  icon,
  style,
}) => {
  const scale = useSharedValue(0);
  const translateY = useSharedValue(100);

  React.useEffect(() => {
    if (isVisible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    } else {
      scale.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(100, { duration: 200 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <Animated.View style={[styles.fab, style, animatedStyle]}>
      <AnimatedButton onPress={onPress} style={styles.fabButton}>
        <Animated.Text style={styles.fabIcon}>{icon}</Animated.Text>
      </AnimatedButton>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  heartContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1000,
  },
  heartIcon: {
    fontSize: 60,
  },
  refreshContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  refreshIcon: {
    fontSize: 24,
  },
  skeleton: {
    backgroundColor: '#E1E1E1',
  },
  progressBar: {
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
  },
});