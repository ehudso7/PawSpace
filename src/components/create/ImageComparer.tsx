import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import { PinchGestureHandler, PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated as ReanimatedView, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

interface ImageComparerProps {
  beforeImage: string;
  afterImage: string;
  mode?: 'side-by-side' | 'overlay' | 'slider';
  onModeChange?: (mode: 'side-by-side' | 'overlay' | 'slider') => void;
}

const ImageComparer: React.FC<ImageComparerProps> = ({
  beforeImage,
  afterImage,
  mode = 'side-by-side',
  onModeChange,
}) => {
  const [sliderPosition, setSliderPosition] = useState(0.5);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const sliderX = useSharedValue(screenWidth * 0.5);

  const pinchHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startScale = scale.value;
    },
    onActive: (event, context) => {
      scale.value = Math.max(0.5, Math.min(3, context.startScale * event.scale));
    },
    onEnd: () => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
      }
    },
  });

  const panHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      // Reset to center if zoomed out
      if (scale.value <= 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const sliderPanHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = sliderX.value;
    },
    onActive: (event, context) => {
      const newX = Math.max(0, Math.min(screenWidth, context.startX + event.translationX));
      sliderX.value = newX;
      runOnJS(setSliderPosition)(newX / screenWidth);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const sliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sliderX.value - 2 }],
    };
  });

  const beforeImageStyle = useAnimatedStyle(() => {
    if (mode === 'slider') {
      return {
        width: sliderX.value,
      };
    }
    return {};
  });

  const renderSideBySide = () => (
    <View style={styles.sideBySideContainer}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <PanGestureHandler onGestureEvent={panHandler}>
          <ReanimatedView style={[styles.imageContainer, animatedStyle]}>
            <View style={styles.sideBySideImages}>
              <Image source={{ uri: beforeImage }} style={styles.sideBySideImage} />
              <Image source={{ uri: afterImage }} style={styles.sideBySideImage} />
            </View>
          </ReanimatedView>
        </PanGestureHandler>
      </PinchGestureHandler>
    </View>
  );

  const renderOverlay = () => (
    <View style={styles.overlayContainer}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <PanGestureHandler onGestureEvent={panHandler}>
          <ReanimatedView style={[styles.imageContainer, animatedStyle]}>
            <Image source={{ uri: beforeImage }} style={styles.overlayImage} />
            <View style={[styles.overlayImage, { opacity: 0.7 }]}>
              <Image source={{ uri: afterImage }} style={styles.overlayImage} />
            </View>
          </ReanimatedView>
        </PanGestureHandler>
      </PinchGestureHandler>
    </View>
  );

  const renderSlider = () => (
    <View style={styles.sliderContainer}>
      <PinchGestureHandler onGestureEvent={pinchHandler}>
        <PanGestureHandler onGestureEvent={panHandler}>
          <ReanimatedView style={[styles.imageContainer, animatedStyle]}>
            <Image source={{ uri: afterImage }} style={styles.sliderBaseImage} />
            <ReanimatedView style={[styles.sliderOverlay, beforeImageStyle]}>
              <Image source={{ uri: beforeImage }} style={styles.sliderOverlayImage} />
            </ReanimatedView>
          </ReanimatedView>
        </PanGestureHandler>
      </PinchGestureHandler>
      
      <PanGestureHandler onGestureEvent={sliderPanHandler}>
        <ReanimatedView style={[styles.sliderHandle, sliderStyle]}>
          <View style={styles.sliderLine} />
          <View style={styles.sliderKnob} />
        </ReanimatedView>
      </PanGestureHandler>
    </View>
  );

  const renderContent = () => {
    switch (mode) {
      case 'side-by-side':
        return renderSideBySide();
      case 'overlay':
        return renderOverlay();
      case 'slider':
        return renderSlider();
      default:
        return renderSideBySide();
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Side by side styles
  sideBySideContainer: {
    flex: 1,
  },
  sideBySideImages: {
    flexDirection: 'row',
    width: screenWidth,
    height: '100%',
  },
  sideBySideImage: {
    width: screenWidth / 2,
    height: '100%',
    resizeMode: 'cover',
  },
  // Overlay styles
  overlayContainer: {
    flex: 1,
  },
  overlayImage: {
    position: 'absolute',
    width: screenWidth,
    height: '100%',
    resizeMode: 'cover',
  },
  // Slider styles
  sliderContainer: {
    flex: 1,
    position: 'relative',
  },
  sliderBaseImage: {
    width: screenWidth,
    height: '100%',
    resizeMode: 'cover',
  },
  sliderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  sliderOverlayImage: {
    width: screenWidth,
    height: '100%',
    resizeMode: 'cover',
  },
  sliderHandle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderLine: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  sliderKnob: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default ImageComparer;