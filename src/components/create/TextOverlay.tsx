import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { TextOverlay as TextOverlayType } from '../../types';

interface TextOverlayProps {
  overlay: TextOverlayType;
  onUpdate: (id: string, updates: Partial<TextOverlayType>) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const TextOverlayComponent: React.FC<TextOverlayProps> = ({
  overlay,
  onUpdate,
  onDelete,
  isSelected,
  onSelect,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(overlay.text);
  
  const translateX = useSharedValue(overlay.position.x);
  const translateY = useSharedValue(overlay.position.y);
  const scale = useSharedValue(overlay.size / 16); // Convert size to scale
  const rotation = useSharedValue(overlay.rotation);
  
  const lastTranslateX = useSharedValue(overlay.position.x);
  const lastTranslateY = useSharedValue(overlay.position.y);
  const lastScale = useSharedValue(overlay.size / 16);
  const lastRotation = useSharedValue(overlay.rotation);

  const panRef = useRef<PanGestureHandler>(null);
  const pinchRef = useRef<PinchGestureHandler>(null);
  const rotationRef = useRef<RotationGestureHandler>(null);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      runOnJS(onSelect)(overlay.id);
    },
    onActive: (event) => {
      translateX.value = event.translationX + lastTranslateX.value;
      translateY.value = event.translationY + lastTranslateY.value;
    },
    onEnd: () => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
      runOnJS(onUpdate)(overlay.id, {
        position: { x: translateX.value, y: translateY.value },
      });
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      scale.value = Math.max(0.5, Math.min(3, event.scale * lastScale.value));
    },
    onEnd: () => {
      lastScale.value = scale.value;
      const newSize = scale.value * 16;
      runOnJS(onUpdate)(overlay.id, { size: newSize });
    },
  });

  const rotationGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      rotation.value = event.rotation + lastRotation.value;
    },
    onEnd: () => {
      lastRotation.value = rotation.value;
      runOnJS(onUpdate)(overlay.id, { rotation: rotation.value });
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

  const handleTextPress = () => {
    if (!isSelected) {
      onSelect(overlay.id);
    } else {
      setIsEditing(true);
    }
  };

  const handleTextSubmit = () => {
    if (editText.trim()) {
      onUpdate(overlay.id, { text: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleTextCancel = () => {
    setEditText(overlay.text);
    setIsEditing(false);
  };

  const getFontFamily = (font: string) => {
    const fontMap: { [key: string]: string } = {
      'system': 'System',
      'helvetica': 'Helvetica',
      'times': 'Times New Roman',
      'courier': 'Courier New',
      'arial': 'Arial',
    };
    return fontMap[font] || 'System';
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler ref={panRef}>
        <Animated.View style={[styles.textContainer, animatedStyle]}>
          <PinchGestureHandler ref={pinchRef}>
            <Animated.View>
              <RotationGestureHandler ref={rotationRef}>
                <Animated.View>
                  {isEditing ? (
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          fontFamily: getFontFamily(overlay.font),
                          color: overlay.color,
                          fontSize: 16,
                        },
                      ]}
                      value={editText}
                      onChangeText={setEditText}
                      onSubmitEditing={handleTextSubmit}
                      onBlur={handleTextCancel}
                      autoFocus
                      multiline
                    />
                  ) : (
                    <TouchableOpacity onPress={handleTextPress}>
                      <Text
                        style={[
                          styles.text,
                          {
                            fontFamily: getFontFamily(overlay.font),
                            color: overlay.color,
                            fontSize: overlay.size,
                          },
                        ]}
                      >
                        {overlay.text}
                      </Text>
                    </TouchableOpacity>
                  )}
                </Animated.View>
              </RotationGestureHandler>
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      {isSelected && !isEditing && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(overlay.id)}
          >
            <Ionicons name="trash-outline" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  textContainer: {
    padding: 8,
    minWidth: 50,
    minHeight: 30,
  },
  text: {
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  textInput: {
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    padding: 4,
    minWidth: 100,
  },
  controls: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default TextOverlayComponent;