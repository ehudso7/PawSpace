import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

interface Props {
  id: string;
  text: string;
  font: string;
  color: string;
  size: number;
  initialX: number; // 0..1
  initialY: number; // 0..1
  onMove?: (x: number, y: number) => void;
}

const TextOverlay: React.FC<Props> = ({ id, text, font, color, size, initialX, initialY, onMove }) => {
  const x = useSharedValue(initialX);
  const y = useSharedValue(initialY);

  const handler = useAnimatedGestureHandler<{ translationX: number; translationY: number }>({
    onActive: (e) => {
      // Use pixels during drag; consumer maps back to % when saving
    },
    onEnd: () => {},
  });

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: `${x.value * 100}%`,
    top: `${y.value * 100}%`,
  }));

  useMemo(() => {
    x.value = initialX;
    y.value = initialY;
  }, [initialX, initialY]);

  return (
    <PanGestureHandler onGestureEvent={handler}>
      <Animated.View style={style}>
        <Text style={[styles.text, { color, fontFamily: font, fontSize: size }]}>{text}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
  },
});

export default TextOverlay;
