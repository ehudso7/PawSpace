import { Animated, Easing } from 'react-native';

export class AnimationUtils {
  /**
   * Create a fade in animation
   */
  static fadeIn(
    animatedValue: Animated.Value,
    duration: number = 300,
    delay: number = 0
  ): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
  }

  /**
   * Create a fade out animation
   */
  static fadeOut(
    animatedValue: Animated.Value,
    duration: number = 300,
    delay: number = 0
  ): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      delay,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    });
  }

  /**
   * Create a slide up animation
   */
  static slideUp(
    animatedValue: Animated.Value,
    duration: number = 400,
    delay: number = 0
  ): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration,
      delay,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    });
  }

  /**
   * Create a slide down animation
   */
  static slideDown(
    animatedValue: Animated.Value,
    toValue: number,
    duration: number = 400,
    delay: number = 0
  ): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay,
      easing: Easing.in(Easing.back(1.2)),
      useNativeDriver: true,
    });
  }

  /**
   * Create a scale animation
   */
  static scale(
    animatedValue: Animated.Value,
    toValue: number = 1,
    duration: number = 300,
    delay: number = 0
  ): Animated.CompositeAnimation {
    return Animated.timing(animatedValue, {
      toValue,
      duration,
      delay,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    });
  }

  /**
   * Create a spring animation
   */
  static spring(
    animatedValue: Animated.Value,
    toValue: number,
    tension: number = 100,
    friction: number = 8
  ): Animated.CompositeAnimation {
    return Animated.spring(animatedValue, {
      toValue,
      tension,
      friction,
      useNativeDriver: true,
    });
  }

  /**
   * Create a staggered animation for multiple items
   */
  static stagger(
    animations: Animated.CompositeAnimation[],
    delay: number = 100
  ): Animated.CompositeAnimation {
    return Animated.stagger(delay, animations);
  }

  /**
   * Create a parallax scroll effect
   */
  static parallax(
    scrollY: Animated.Value,
    inputRange: number[],
    outputRange: number[]
  ): Animated.AnimatedInterpolation {
    return scrollY.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    });
  }

  /**
   * Create a loading pulse animation
   */
  static pulse(animatedValue: Animated.Value): Animated.CompositeAnimation {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.5,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
  }

  /**
   * Create a shimmer loading effect
   */
  static shimmer(animatedValue: Animated.Value): Animated.CompositeAnimation {
    return Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
  }
}

/**
 * Predefined animation configurations
 */
export const AnimationPresets = {
  fadeIn: { duration: 300, easing: Easing.out(Easing.cubic) },
  fadeOut: { duration: 300, easing: Easing.in(Easing.cubic) },
  slideUp: { duration: 400, easing: Easing.out(Easing.back(1.2)) },
  slideDown: { duration: 400, easing: Easing.in(Easing.back(1.2)) },
  bounce: { duration: 600, easing: Easing.bounce },
  elastic: { duration: 800, easing: Easing.elastic(2) },
};