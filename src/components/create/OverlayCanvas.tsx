import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import type { Sticker, TextOverlay as TextOverlayType } from '../../types/editor';

interface Props {
  width: number;
  height: number;
  textOverlays: TextOverlayType[];
  stickers: Sticker[];
}

const OverlayCanvas: React.FC<Props> = ({ width, height, textOverlays, stickers }) => {
  return (
    <View style={{ width, height }}>
      {stickers.map((s) => (
        <Animated.Image
          key={s.id}
          source={{ uri: s.uri }}
          style={{ position: 'absolute', left: `${s.position.x * 100}%`, top: `${s.position.y * 100}%`, width: 80 * s.scale, height: 80 * s.scale, transform: [{ rotate: `${s.rotation}deg` }] }}
          resizeMode="contain"
        />
      ))}
      {textOverlays.map((t) => (
        <Animated.View key={t.id} style={{ position: 'absolute', left: `${t.position.x * 100}%`, top: `${t.position.y * 100}%` }}>
          <Text style={{ color: t.color, fontSize: t.size, fontFamily: t.font, fontWeight: '700' }}>{t.text}</Text>
        </Animated.View>
      ))}
    </View>
  );
};

export default OverlayCanvas;
