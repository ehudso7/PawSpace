import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, RotationGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Sticker as StickerType } from '../../types/editor';
import { useEditorStore } from '../../store/editorStore';

interface StickerOverlayProps {
  sticker: StickerType;
  isSelected: boolean;
  onSelect: () => void;
}

export const StickerOverlay: React.FC<StickerOverlayProps> = ({
  sticker,
  isSelected,
  onSelect,
}) => {
  const { updateSticker, removeSticker } = useEditorStore();

  const translateX = useSharedValue(sticker.position.x);
  const translateY = useSharedValue(sticker.position.y);
  const scale = useSharedValue(sticker.scale);
  const rotation = useSharedValue(sticker.rotation);
  const baseScale = useSharedValue(sticker.scale);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx: any) => {
      translateX.value = ctx.startX + event.translationX;
      translateY.value = ctx.startY + event.translationY;
    },
    onEnd: () => {
      runOnJS(updateSticker)(sticker.id, {
        position: { x: translateX.value, y: translateY.value },
      });
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx: any) => {
      scale.value = Math.max(0.5, Math.min(ctx.startScale * event.scale, 3));
    },
    onEnd: () => {
      baseScale.value = scale.value;
      runOnJS(updateSticker)(sticker.id, { scale: scale.value });
    },
  });

  const rotationGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startRotation = rotation.value;
    },
    onActive: (event, ctx: any) => {
      rotation.value = ctx.startRotation + event.rotation;
    },
    onEnd: () => {
      runOnJS(updateSticker)(sticker.id, { rotation: rotation.value });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}rad` },
      ],
    };
  });

  const handleDelete = () => {
    removeSticker(sticker.id);
  };

  // Icon name mapping (simplified - in real app would use actual images)
  const getIconName = (uri: string): any => {
    if (uri.includes('paw')) return 'paw';
    if (uri.includes('heart')) return 'heart';
    if (uri.includes('star')) return 'star';
    if (uri.includes('sparkles')) return 'sparkles';
    if (uri.includes('flash')) return 'flash';
    if (uri.includes('trophy')) return 'trophy';
    if (uri.includes('ribbon')) return 'ribbon';
    if (uri.includes('happy')) return 'happy';
    if (uri.includes('thumbs-up')) return 'thumbs-up';
    if (uri.includes('checkmark')) return 'checkmark-circle';
    if (uri.includes('shield')) return 'shield-checkmark';
    if (uri.includes('medal')) return 'medal';
    if (uri.includes('gift')) return 'gift';
    if (uri.includes('balloon')) return 'balloon';
    if (uri.includes('camera')) return 'camera';
    if (uri.includes('brush')) return 'brush';
    if (uri.includes('cut')) return 'cut';
    return 'image';
  };

  return (
    <RotationGestureHandler onGestureEvent={rotationGestureHandler}>
      <Animated.View>
        <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
          <Animated.View>
            <PanGestureHandler onGestureEvent={panGestureHandler}>
              <Animated.View style={[styles.container, animatedStyle]}>
                <TouchableOpacity
                  onPress={onSelect}
                  activeOpacity={0.9}
                  style={styles.stickerButton}
                >
                  <Ionicons
                    name={getIconName(sticker.uri)}
                    size={100}
                    color="#6B4EFF"
                  />
                  
                  {isSelected && (
                    <View style={styles.controls}>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                      >
                        <Ionicons name="close-circle" size={28} color="#FF3B30" />
                      </TouchableOpacity>
                      <View style={styles.handleCorner} />
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PinchGestureHandler>
      </Animated.View>
    </RotationGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  stickerButton: {
    width: 100,
    height: 100,
  },
  controls: {
    position: 'absolute',
    top: -12,
    right: -12,
  },
  deleteButton: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 4,
  },
  handleCorner: {
    width: 8,
    height: 8,
    backgroundColor: '#6B4EFF',
    borderRadius: 4,
  },
});
