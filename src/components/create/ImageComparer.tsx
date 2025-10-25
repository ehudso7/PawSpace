import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { clamp, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';

interface Props {
  beforeUri: string;
  afterUri: string;
  mode?: 'side-by-side' | 'overlay';
}

const ImageComparer: React.FC<Props> = ({ beforeUri, afterUri, mode = 'overlay' }) => {
  const slider = useSharedValue(0.5); // 0..1 for overlay split
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startSlider = useSharedValue(0.5);
  const [containerWidth, setContainerWidth] = useState(0);

  const pinchHandler = useAnimatedGestureHandler<{ scale: number }>({
    onActive: (e) => {
      const next = Math.min(4, Math.max(1, e.scale));
      scale.value = next;
    },
    onEnd: () => {
      if (scale.value < 1) scale.value = withTiming(1);
    },
  });

  const panHandler = useAnimatedGestureHandler<{ translationX: number; translationY: number }>({
    onActive: (e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    },
    onEnd: () => {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    },
  });

  const imgStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  const beforeImage = useMemo(() => ({ uri: beforeUri }), [beforeUri]);
  const afterImage = useMemo(() => ({ uri: afterUri }), [afterUri]);

  const handlePan = useAnimatedGestureHandler<{ translationX: number; translationY: number }>({
    onStart: () => {
      startSlider.value = slider.value;
    },
    onActive: (e) => {
      if (containerWidth <= 0) return;
      const delta = e.translationX / containerWidth;
      slider.value = clamp(startSlider.value + delta, 0, 1);
    },
  });

  const handleStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: `${slider.value * 100}%`,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(255,255,255,0.8)',
  }));

  return (
    <PinchGestureHandler onGestureEvent={pinchHandler}>
      <Animated.View style={styles.container} onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        {mode === 'side-by-side' ? (
          <PanGestureHandler onGestureEvent={panHandler}>
            <Animated.View style={styles.row}>
              <Animated.Image source={beforeImage} style={[styles.half, imgStyle]} resizeMode="cover" />
              <Animated.Image source={afterImage} style={[styles.half, imgStyle]} resizeMode="cover" />
            </Animated.View>
          </PanGestureHandler>
        ) : (
          <PanGestureHandler onGestureEvent={panHandler}>
            <Animated.View style={styles.overlay}>
              <Animated.Image source={afterImage} style={[StyleSheet.absoluteFillObject as any, imgStyle]} resizeMode="cover" />
              <Animated.View style={[StyleSheet.absoluteFillObject]}>
                <Animated.View
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${slider.value * 100}%`,
                    overflow: 'hidden',
                  }}
                >
                  <Animated.Image source={beforeImage} style={[StyleSheet.absoluteFillObject as any, imgStyle]} resizeMode="cover" />
                </Animated.View>
              </Animated.View>

              <PanGestureHandler onGestureEvent={handlePan}>
                <Animated.View style={StyleSheet.absoluteFill}>
                  <Animated.View style={handleStyle} />
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </PanGestureHandler>
        )}
      </Animated.View>
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: { flex: 1, flexDirection: 'row' },
  half: { flex: 1 },
  overlay: { flex: 1 },
});

export default ImageComparer;
