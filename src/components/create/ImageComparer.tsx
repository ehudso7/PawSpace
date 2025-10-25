import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ImageComparerProps {
  beforeImage: string;
  afterImage: string;
  mode?: 'side-by-side' | 'overlay';
}

export const ImageComparer: React.FC<ImageComparerProps> = ({
  beforeImage,
  afterImage,
  mode = 'overlay',
}) => {
  const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH);
  const sliderPosition = useSharedValue(containerWidth / 2);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  // Pan gesture for slider
  const sliderGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = sliderPosition.value;
    },
    onActive: (event, ctx: any) => {
      const newPosition = ctx.startX + event.translationX;
      sliderPosition.value = Math.max(0, Math.min(containerWidth, newPosition));
    },
  });

  // Pinch gesture for zoom
  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.scale = scale.value;
    },
    onActive: (event, ctx: any) => {
      scale.value = Math.max(1, Math.min(ctx.scale * event.scale, 3));
    },
    onEnd: () => {
      if (scale.value < 1.1) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  // Pan gesture for image movement when zoomed
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      if (scale.value > 1) {
        translateX.value = ctx.startX + event.translationX;
        translateY.value = ctx.startY + event.translationY;
      }
    },
  });

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sliderPosition.value }],
    };
  });

  const animatedAfterImageStyle = useAnimatedStyle(() => {
    return {
      width: sliderPosition.value,
    };
  });

  const animatedImageTransform = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  if (mode === 'side-by-side') {
    return (
      <View style={styles.sideBySideContainer}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: beforeImage }} style={styles.sideBySideImage} />
        </View>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: afterImage }} style={styles.sideBySideImage} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
        <Animated.View style={styles.gestureContainer}>
          <PanGestureHandler
            onGestureEvent={panGestureHandler}
            minPointers={1}
            maxPointers={1}
          >
            <Animated.View style={[styles.imageContainer, animatedImageTransform]}>
              {/* Before Image */}
              <Image source={{ uri: beforeImage }} style={styles.image} />

              {/* After Image with clip */}
              <Animated.View style={[styles.afterImageContainer, animatedAfterImageStyle]}>
                <Image
                  source={{ uri: afterImage }}
                  style={[styles.image, { width: containerWidth }]}
                />
              </Animated.View>

              {/* Slider */}
              <PanGestureHandler onGestureEvent={sliderGestureHandler}>
                <Animated.View style={[styles.slider, animatedSliderStyle]}>
                  <View style={styles.sliderHandle}>
                    <View style={styles.sliderArrow} />
                    <View style={styles.sliderLine} />
                    <View style={styles.sliderArrow} />
                  </View>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  gestureContainer: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  afterImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FFF',
    marginLeft: -2,
  },
  sliderHandle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginLeft: -20,
    marginTop: -20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  sliderLine: {
    width: 2,
    height: 20,
    backgroundColor: '#666',
  },
  sliderArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#666',
  },
  sideBySideContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
  },
  imageWrapper: {
    flex: 1,
    padding: 2,
  },
  sideBySideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
