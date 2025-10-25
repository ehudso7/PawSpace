import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { TransitionType } from '../../types';

const { width, height } = Dimensions.get('window');
const PREVIEW_HEIGHT = height * 0.6;

interface ImageComparerProps {
  beforeImage: string;
  afterImage: string;
  transition: TransitionType;
  onTransitionChange?: (progress: number) => void;
}

const ImageComparer: React.FC<ImageComparerProps> = ({
  beforeImage,
  afterImage,
  transition,
  onTransitionChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const lastScale = useSharedValue(1);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);

  const panRef = useRef<PanGestureHandler>(null);
  const pinchRef = useRef<PinchGestureHandler>(null);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      runOnJS(setIsDragging)(true);
    },
    onActive: (event) => {
      if (transition === 'swipe') {
        translateX.value = Math.max(0, Math.min(width, event.translationX + lastTranslateX.value));
        const progress = translateX.value / width;
        runOnJS(onTransitionChange || (() => {}))(progress);
      } else {
        translateX.value = event.translationX + lastTranslateX.value;
        translateY.value = event.translationY + lastTranslateY.value;
      }
    },
    onEnd: () => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
      runOnJS(setIsDragging)(false);
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = Math.max(0.5, Math.min(3, event.scale * lastScale.value));
    },
    onEnd: () => {
      lastScale.value = scale.value;
    },
  });

  const beforeImageStyle = useAnimatedStyle(() => {
    if (transition === 'fade') {
      const opacity = interpolate(
        translateX.value,
        [0, width],
        [1, 0],
        Extrapolate.CLAMP
      );
      return {
        opacity,
        transform: [
          { scale: scale.value },
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
      };
    } else if (transition === 'slide') {
      return {
        transform: [
          { scale: scale.value },
          { translateX: translateX.value - width },
          { translateY: translateY.value },
        ],
      };
    } else if (transition === 'swipe') {
      return {
        transform: [
          { scale: scale.value },
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
      };
    } else if (transition === 'split') {
      const splitX = interpolate(
        translateX.value,
        [0, width],
        [0, -width / 2],
        Extrapolate.CLAMP
      );
      return {
        transform: [
          { scale: scale.value },
          { translateX: splitX },
          { translateY: translateY.value },
        ],
      };
    }
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const afterImageStyle = useAnimatedStyle(() => {
    if (transition === 'fade') {
      const opacity = interpolate(
        translateX.value,
        [0, width],
        [0, 1],
        Extrapolate.CLAMP
      );
      return {
        opacity,
        transform: [
          { scale: scale.value },
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
      };
    } else if (transition === 'slide') {
      return {
        transform: [
          { scale: scale.value },
          { translateX: translateX.value },
          { translateY: translateY.value },
        ],
      };
    } else if (transition === 'swipe') {
      return {
        transform: [
          { scale: scale.value },
          { translateX: translateX.value - width },
          { translateY: translateY.value },
        ],
      };
    } else if (transition === 'split') {
      const splitX = interpolate(
        translateX.value,
        [0, width],
        [width / 2, 0],
        Extrapolate.CLAMP
      );
      return {
        transform: [
          { scale: scale.value },
          { translateX: splitX },
          { translateY: translateY.value },
        ],
      };
    }
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const swipeIndicatorStyle = useAnimatedStyle(() => {
    if (transition !== 'swipe') return { opacity: 0 };
    
    const indicatorX = interpolate(
      translateX.value,
      [0, width],
      [20, width - 40],
      Extrapolate.CLAMP
    );
    
    return {
      opacity: isDragging ? 1 : 0.7,
      transform: [{ translateX: indicatorX }],
    };
  });

  const renderTransitionOverlay = () => {
    if (transition === 'swipe') {
      return (
        <Animated.View style={[styles.swipeIndicator, swipeIndicatorStyle]}>
          <View style={styles.swipeHandle} />
        </Animated.View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <PinchGestureHandler ref={pinchRef}>
        <Animated.View style={styles.gestureContainer}>
          <PanGestureHandler
            ref={panRef}
            onGestureEvent={panGestureHandler}
            simultaneousHandlers={pinchRef}
          >
            <Animated.View style={styles.imageContainer}>
              <Animated.Image
                source={{ uri: beforeImage }}
                style={[styles.image, beforeImageStyle]}
                resizeMode="cover"
              />
              <Animated.Image
                source={{ uri: afterImage }}
                style={[styles.image, afterImageStyle]}
                resizeMode="cover"
              />
              {renderTransitionOverlay()}
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PREVIEW_HEIGHT,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 20,
  },
  gestureContainer: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  swipeIndicator: {
    position: 'absolute',
    top: '50%',
    width: 4,
    height: 60,
    backgroundColor: '#007AFF',
    borderRadius: 2,
    marginTop: -30,
  },
  swipeHandle: {
    position: 'absolute',
    top: -10,
    left: -8,
    width: 20,
    height: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default ImageComparer;