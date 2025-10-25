import {
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  interpolate,
  Extrapolate,
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withDecay,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Spring configurations
export const springConfigs = {
  gentle: {
    damping: 20,
    stiffness: 300,
    mass: 0.8,
  },
  wobbly: {
    damping: 15,
    stiffness: 200,
    mass: 1,
  },
  stiff: {
    damping: 30,
    stiffness: 500,
    mass: 0.5,
  },
  slow: {
    damping: 25,
    stiffness: 100,
    mass: 1.2,
  },
};

// Timing configurations
export const timingConfigs = {
  fast: { duration: 200 },
  normal: { duration: 300 },
  slow: { duration: 500 },
  verySlow: { duration: 800 },
};

// Heart animation for likes
export const createHeartAnimation = () => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const triggerHeart = () => {
    scale.value = withSequence(
      withTiming(1.5, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { triggerHeart, animatedStyle };
};

// Pull to refresh animation
export const createPullToRefreshAnimation = () => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const onScroll = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      const newTranslateY = context.startY + event.translationY;
      if (newTranslateY > 0) {
        translateY.value = newTranslateY;
        scale.value = interpolate(
          newTranslateY,
          [0, 100],
          [1, 1.2],
          Extrapolate.CLAMP
        );
        rotation.value = interpolate(
          newTranslateY,
          [0, 100],
          [0, 360],
          Extrapolate.CLAMP
        );
      }
    },
    onEnd: () => {
      if (translateY.value > 80) {
        // Trigger refresh
        translateY.value = withSpring(60, springConfigs.gentle);
        rotation.value = withRepeat(
          withTiming(360, { duration: 1000 }),
          -1,
          false
        );
      } else {
        // Snap back
        translateY.value = withSpring(0, springConfigs.gentle);
        scale.value = withSpring(1, springConfigs.gentle);
        rotation.value = withSpring(0, springConfigs.gentle);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  const reset = () => {
    translateY.value = withSpring(0, springConfigs.gentle);
    scale.value = withSpring(1, springConfigs.gentle);
    rotation.value = withSpring(0, springConfigs.gentle);
  };

  return { onScroll, animatedStyle, reset };
};

// Card entrance animation
export const createCardEntranceAnimation = (index: number) => {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  const animateIn = () => {
    translateY.value = withDelay(
      index * 100,
      withSpring(0, springConfigs.gentle)
    );
    opacity.value = withDelay(
      index * 100,
      withTiming(1, timingConfigs.normal)
    );
    scale.value = withDelay(
      index * 100,
      withSpring(1, springConfigs.gentle)
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return { animateIn, animatedStyle };
};

// Swipe animation for before/after
export const createSwipeAnimation = () => {
  const translateX = useSharedValue(0);
  const currentIndex = useSharedValue(0);

  const swipeToIndex = (index: number) => {
    currentIndex.value = index;
    translateX.value = withSpring(-index * screenWidth, springConfigs.gentle);
  };

  const onSwipeGesture = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      const newTranslateX = context.startX + event.translationX;
      const maxTranslate = 0;
      const minTranslate = -screenWidth;
      
      if (newTranslateX <= maxTranslate && newTranslateX >= minTranslate) {
        translateX.value = newTranslateX;
      }
    },
    onEnd: (event) => {
      const threshold = screenWidth * 0.3;
      const velocity = event.velocityX;
      
      if (Math.abs(velocity) > 500) {
        // Fast swipe
        if (velocity > 0 && currentIndex.value > 0) {
          // Swipe right - go to previous
          currentIndex.value -= 1;
          translateX.value = withSpring(-currentIndex.value * screenWidth, springConfigs.gentle);
        } else if (velocity < 0 && currentIndex.value < 1) {
          // Swipe left - go to next
          currentIndex.value += 1;
          translateX.value = withSpring(-currentIndex.value * screenWidth, springConfigs.gentle);
        } else {
          // Snap back
          translateX.value = withSpring(-currentIndex.value * screenWidth, springConfigs.gentle);
        }
      } else {
        // Slow swipe
        if (event.translationX > threshold && currentIndex.value > 0) {
          // Swipe right - go to previous
          currentIndex.value -= 1;
          translateX.value = withSpring(-currentIndex.value * screenWidth, springConfigs.gentle);
        } else if (event.translationX < -threshold && currentIndex.value < 1) {
          // Swipe left - go to next
          currentIndex.value += 1;
          translateX.value = withSpring(-currentIndex.value * screenWidth, springConfigs.gentle);
        } else {
          // Snap back
          translateX.value = withSpring(-currentIndex.value * screenWidth, springConfigs.gentle);
        }
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { swipeToIndex, onSwipeGesture, animatedStyle, currentIndex };
};

// Floating action button animation
export const createFABAnimation = () => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const pressIn = () => {
    scale.value = withSpring(0.9, springConfigs.stiff);
  };

  const pressOut = () => {
    scale.value = withSpring(1, springConfigs.gentle);
  };

  const toggle = () => {
    rotate.value = withSpring(rotate.value + 45, springConfigs.gentle);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return { pressIn, pressOut, toggle, animatedStyle };
};

// Story progress animation
export const createStoryProgressAnimation = (duration: number) => {
  const progress = useSharedValue(0);
  const isPaused = useSharedValue(false);

  const start = () => {
    isPaused.value = false;
    progress.value = withTiming(1, { duration }, (finished) => {
      if (finished) {
        runOnJS(() => {})(); // Callback when animation completes
      }
    });
  };

  const pause = () => {
    isPaused.value = true;
    progress.value = withTiming(progress.value, { duration: 0 });
  };

  const resume = () => {
    if (isPaused.value) {
      isPaused.value = false;
      const remainingDuration = (1 - progress.value) * duration;
      progress.value = withTiming(1, { duration: remainingDuration });
    }
  };

  const reset = () => {
    progress.value = 0;
    isPaused.value = false;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return { start, pause, resume, reset, animatedStyle };
};

// Modal animation
export const createModalAnimation = () => {
  const translateY = useSharedValue(screenHeight);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const show = () => {
    translateY.value = withSpring(0, springConfigs.gentle);
    opacity.value = withTiming(1, timingConfigs.normal);
    backdropOpacity.value = withTiming(0.5, timingConfigs.normal);
  };

  const hide = (onComplete?: () => void) => {
    translateY.value = withSpring(screenHeight, springConfigs.gentle);
    opacity.value = withTiming(0, timingConfigs.normal);
    backdropOpacity.value = withTiming(0, timingConfigs.normal, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });
  };

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return { show, hide, modalAnimatedStyle, backdropAnimatedStyle };
};

// Shake animation for errors
export const createShakeAnimation = () => {
  const translateX = useSharedValue(0);

  const shake = () => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return { shake, animatedStyle };
};

// Bounce animation for success
export const createBounceAnimation = () => {
  const scale = useSharedValue(1);

  const bounce = () => {
    scale.value = withSequence(
      withSpring(1.2, springConfigs.wobbly),
      withSpring(1, springConfigs.gentle)
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { bounce, animatedStyle };
};

// Parallax scroll animation
export const createParallaxAnimation = (scrollY: any, parallaxFactor: number = 0.5) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, screenHeight],
          [0, -screenHeight * parallaxFactor],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  return { animatedStyle };
};

// Stagger animation for lists
export const createStaggerAnimation = (itemCount: number, staggerDelay: number = 100) => {
  const createItemAnimation = (index: number) => {
    const translateY = useSharedValue(30);
    const opacity = useSharedValue(0);

    const animateIn = () => {
      translateY.value = withDelay(
        index * staggerDelay,
        withSpring(0, springConfigs.gentle)
      );
      opacity.value = withDelay(
        index * staggerDelay,
        withTiming(1, timingConfigs.normal)
      );
    };

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    }));

    return { animateIn, animatedStyle };
  };

  return { createItemAnimation };
};