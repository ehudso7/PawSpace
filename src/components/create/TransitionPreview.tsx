import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { TransitionType } from '../../types';

const { width } = Dimensions.get('window');
const PREVIEW_SIZE = width * 0.6;

interface TransitionPreviewProps {
  beforeImage: string;
  afterImage: string;
  transition: TransitionType;
  isPlaying: boolean;
  onPlayPause: () => void;
  duration?: number; // in milliseconds
}

const TransitionPreview: React.FC<TransitionPreviewProps> = ({
  beforeImage,
  afterImage,
  transition,
  isPlaying,
  onPlayPause,
  duration = 3000,
}) => {
  const progress = useSharedValue(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (isPlaying && !isAnimating.current) {
      isAnimating.current = true;
      progress.value = withRepeat(
        withSequence(
          withTiming(1, { duration: duration / 2 }),
          withTiming(0, { duration: duration / 2 })
        ),
        -1,
        false
      );
    } else if (!isPlaying) {
      progress.value = withTiming(0, { duration: 300 });
      isAnimating.current = false;
    }
  }, [isPlaying, duration]);

  const beforeImageStyle = useAnimatedStyle(() => {
    switch (transition) {
      case 'fade':
        const fadeOpacity = interpolate(
          progress.value,
          [0, 0.5, 1],
          [1, 0, 1],
          Extrapolate.CLAMP
        );
        return {
          opacity: fadeOpacity,
        };

      case 'slide':
        const slideTranslateX = interpolate(
          progress.value,
          [0, 0.5, 1],
          [0, -PREVIEW_SIZE, 0],
          Extrapolate.CLAMP
        );
        return {
          transform: [{ translateX: slideTranslateX }],
        };

      case 'swipe':
        const swipeTranslateX = interpolate(
          progress.value,
          [0, 0.5, 1],
          [0, PREVIEW_SIZE, 0],
          Extrapolate.CLAMP
        );
        return {
          transform: [{ translateX: swipeTranslateX }],
        };

      case 'split':
        const splitTranslateX = interpolate(
          progress.value,
          [0, 0.5, 1],
          [0, -PREVIEW_SIZE / 2, 0],
          Extrapolate.CLAMP
        );
        return {
          transform: [{ translateX: splitTranslateX }],
        };

      default:
        return {};
    }
  });

  const afterImageStyle = useAnimatedStyle(() => {
    switch (transition) {
      case 'fade':
        const fadeOpacity = interpolate(
          progress.value,
          [0, 0.5, 1],
          [0, 1, 0],
          Extrapolate.CLAMP
        );
        return {
          opacity: fadeOpacity,
        };

      case 'slide':
        const slideTranslateX = interpolate(
          progress.value,
          [0, 0.5, 1],
          [PREVIEW_SIZE, 0, PREVIEW_SIZE],
          Extrapolate.CLAMP
        );
        return {
          transform: [{ translateX: slideTranslateX }],
        };

      case 'swipe':
        const swipeTranslateX = interpolate(
          progress.value,
          [0, 0.5, 1],
          [-PREVIEW_SIZE, 0, -PREVIEW_SIZE],
          Extrapolate.CLAMP
        );
        return {
          transform: [{ translateX: swipeTranslateX }],
        };

      case 'split':
        const splitTranslateX = interpolate(
          progress.value,
          [0, 0.5, 1],
          [PREVIEW_SIZE / 2, 0, PREVIEW_SIZE / 2],
          Extrapolate.CLAMP
        );
        return {
          transform: [{ translateX: splitTranslateX }],
        };

      default:
        return {};
    }
  });

  const swipeIndicatorStyle = useAnimatedStyle(() => {
    if (transition !== 'swipe') return { opacity: 0 };
    
    const indicatorX = interpolate(
      progress.value,
      [0, 0.5, 1],
      [20, PREVIEW_SIZE - 40, 20],
      Extrapolate.CLAMP
    );
    
    return {
      opacity: 0.8,
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
      <View style={styles.previewContainer}>
        <Animated.Image
          source={{ uri: beforeImage }}
          style={[styles.previewImage, beforeImageStyle]}
          resizeMode="cover"
        />
        <Animated.Image
          source={{ uri: afterImage }}
          style={[styles.previewImage, afterImageStyle]}
          resizeMode="cover"
        />
        {renderTransitionOverlay()}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={onPlayPause}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        
        <Text style={styles.transitionName}>
          {transition.charAt(0).toUpperCase() + transition.slice(1)} Transition
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  previewContainer: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
    marginBottom: 20,
  },
  previewImage: {
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
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  transitionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
});

export default TransitionPreview;