import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { AnimationUtils } from '../../utils/animations';

const { width } = Dimensions.get('window');

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'medium',
  color = '#2196F3',
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    const pulseAnimation = AnimationUtils.pulse(pulseValue);
    const fadeAnimation = AnimationUtils.fadeIn(fadeValue, 500);

    spinAnimation.start();
    pulseAnimation.start();
    fadeAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small':
        return 24;
      case 'large':
        return 48;
      default:
        return 32;
    }
  };

  const spinnerSize = getSize();

  return (
    <Animated.View style={[styles.container, { opacity: fadeValue }]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: spinnerSize,
            height: spinnerSize,
            borderColor: `${color}20`,
            borderTopColor: color,
            transform: [
              { rotate: spin },
              { scale: pulseValue },
            ],
          },
        ]}
      />
      {message && (
        <Animated.Text
          style={[
            styles.message,
            {
              opacity: pulseValue,
              color: color,
            },
          ]}
        >
          {message}
        </Animated.Text>
      )}
    </Animated.View>
  );
};

export const ShimmerPlaceholder: React.FC<{
  width?: number;
  height?: number;
  borderRadius?: number;
}> = ({ width = 100, height = 20, borderRadius = 4 }) => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = AnimationUtils.shimmer(shimmerValue);
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, []);

  const translateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[
        styles.shimmerContainer,
        {
          width,
          height,
          borderRadius,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

export const PulsingDot: React.FC<{
  color?: string;
  size?: number;
  delay?: number;
}> = ({ color = '#2196F3', size = 8, delay = 0 }) => {
  const pulseValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.pulsingDot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: pulseValue,
          transform: [{ scale: pulseValue }],
        },
      ]}
    />
  );
};

export const LoadingDots: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = '#2196F3', size = 8 }) => {
  return (
    <View style={styles.dotsContainer}>
      <PulsingDot color={color} size={size} delay={0} />
      <PulsingDot color={color} size={size} delay={200} />
      <PulsingDot color={color} size={size} delay={400} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spinner: {
    borderWidth: 2,
    borderRadius: 50,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  shimmerContainer: {
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: '30%',
  },
  pulsingDot: {
    marginHorizontal: 2,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});