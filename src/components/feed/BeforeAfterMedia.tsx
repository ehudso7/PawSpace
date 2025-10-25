import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  PanGestureHandler,
  TapGestureHandler,
  State,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { FastImage } from '../common/FastImage';
import { VideoPlayer } from '../common/VideoPlayer';
import { MediaItem } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface BeforeAfterMediaProps {
  beforeMedia: MediaItem[];
  afterMedia: MediaItem[];
  style?: any;
  isVisible?: boolean;
  onDoubleTap?: () => void;
}

export const BeforeAfterMedia: React.FC<BeforeAfterMediaProps> = ({
  beforeMedia,
  afterMedia,
  style,
  isVisible = true,
  onDoubleTap,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingAfter, setShowingAfter] = useState(false);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const doubleTapRef = useRef<any>();
  const singleTapRef = useRef<any>();

  const currentBeforeMedia = beforeMedia[currentIndex];
  const currentAfterMedia = afterMedia[currentIndex];
  const hasMultipleMedia = Math.max(beforeMedia.length, afterMedia.length) > 1;

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      const shouldSwitch = Math.abs(event.translationX) > SCREEN_WIDTH * 0.3;
      
      if (shouldSwitch) {
        if (event.translationX > 0) {
          // Swiped right - show before
          translateX.value = withSpring(0);
          runOnJS(setShowingAfter)(false);
        } else {
          // Swiped left - show after
          translateX.value = withSpring(-SCREEN_WIDTH);
          runOnJS(setShowingAfter)(true);
        }
      } else {
        // Snap back
        translateX.value = withSpring(showingAfter ? -SCREEN_WIDTH : 0);
      }
    },
  });

  const singleTapHandler = () => {
    // Toggle between before/after
    const newShowingAfter = !showingAfter;
    setShowingAfter(newShowingAfter);
    translateX.value = withSpring(newShowingAfter ? -SCREEN_WIDTH : 0);
  };

  const doubleTapHandler = () => {
    // Trigger like animation
    scale.value = withSpring(1.2, { duration: 150 }, () => {
      scale.value = withSpring(1, { duration: 150 });
    });
    onDoubleTap?.();
  };

  const nextMedia = () => {
    if (currentIndex < Math.max(beforeMedia.length, afterMedia.length) - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevMedia = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const beforeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { scale: scale.value },
      ],
    };
  });

  const afterAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value + SCREEN_WIDTH },
        { scale: scale.value },
      ],
    };
  });

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0],
      [1, 0],
      'clamp'
    );
    
    return {
      transform: [{ translateX: progress * 100 }],
    };
  });

  const renderMedia = (media: MediaItem, isAfter: boolean = false) => {
    if (!media) return null;

    if (media.type === 'video') {
      return (
        <VideoPlayer
          media={media}
          isVisible={isVisible && (isAfter ? showingAfter : !showingAfter)}
          autoPlay={false}
          muted={true}
          style={styles.media}
        />
      );
    }

    return (
      <FastImage
        source={{ uri: media.url, priority: 'high' }}
        style={styles.media}
        resizeMode="cover"
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View style={styles.mediaContainer}>
          <TapGestureHandler
            ref={singleTapRef}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.ACTIVE) {
                singleTapHandler();
              }
            }}
            waitFor={doubleTapRef}
          >
            <TapGestureHandler
              ref={doubleTapRef}
              numberOfTaps={2}
              onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                  doubleTapHandler();
                }
              }}
            >
              <Animated.View style={styles.gestureContainer}>
                {/* Before Media */}
                <Animated.View style={[styles.mediaWrapper, beforeAnimatedStyle]}>
                  {renderMedia(currentBeforeMedia)}
                  <View style={styles.labelContainer}>
                    <View style={[styles.label, styles.beforeLabel]}>
                      <Text style={styles.labelText}>BEFORE</Text>
                    </View>
                  </View>
                </Animated.View>

                {/* After Media */}
                <Animated.View style={[styles.mediaWrapper, afterAnimatedStyle]}>
                  {renderMedia(currentAfterMedia, true)}
                  <View style={styles.labelContainer}>
                    <View style={[styles.label, styles.afterLabel]}>
                      <Text style={styles.labelText}>AFTER</Text>
                    </View>
                  </View>
                </Animated.View>
              </Animated.View>
            </TapGestureHandler>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      {/* Before/After Indicator */}
      <View style={styles.indicatorContainer}>
        <View style={styles.indicatorTrack}>
          <Animated.View style={[styles.indicatorThumb, indicatorAnimatedStyle]} />
        </View>
        <View style={styles.indicatorLabels}>
          <Text style={[styles.indicatorLabel, !showingAfter && styles.activeIndicatorLabel]}>
            BEFORE
          </Text>
          <Text style={[styles.indicatorLabel, showingAfter && styles.activeIndicatorLabel]}>
            AFTER
          </Text>
        </View>
      </View>

      {/* Media Navigation */}
      {hasMultipleMedia && (
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
            onPress={prevMedia}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <View style={styles.mediaIndicators}>
            {Array.from({ length: Math.max(beforeMedia.length, afterMedia.length) }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.mediaIndicator,
                  index === currentIndex && styles.activeMediaIndicator,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.navButton,
              currentIndex === Math.max(beforeMedia.length, afterMedia.length) - 1 && styles.navButtonDisabled
            ]}
            onPress={nextMedia}
            disabled={currentIndex === Math.max(beforeMedia.length, afterMedia.length) - 1}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Swipe Hint */}
      <View style={styles.swipeHint}>
        <Text style={styles.swipeHintText}>Swipe or tap to compare</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    aspectRatio: 1,
    backgroundColor: '#000',
  },
  mediaContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  gestureContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mediaWrapper: {
    width: SCREEN_WIDTH,
    height: '100%',
    position: 'absolute',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  labelContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  beforeLabel: {
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
  },
  afterLabel: {
    backgroundColor: 'rgba(52, 199, 89, 0.9)',
  },
  labelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    right: 20,
  },
  indicatorTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  indicatorThumb: {
    width: '50%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  indicatorLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicatorLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  activeIndicatorLabel: {
    color: '#fff',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  mediaIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 3,
  },
  activeMediaIndicator: {
    backgroundColor: '#fff',
  },
  swipeHint: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    opacity: 0.8,
  },
  swipeHintText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});