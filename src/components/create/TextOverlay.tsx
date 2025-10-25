import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { PanGestureHandler, RotationGestureHandler, State } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { TextOverlay as TextOverlayType, FONTS, PRESET_COLORS } from '../../types/editor';
import { useEditorStore } from '../../store/editorStore';

interface TextOverlayProps {
  overlay: TextOverlayType;
  isSelected: boolean;
  onSelect: () => void;
  containerWidth: number;
  containerHeight: number;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  overlay,
  isSelected,
  onSelect,
  containerWidth,
  containerHeight,
}) => {
  const { updateText, removeText } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(overlay.text);

  const translateX = useSharedValue(overlay.position.x);
  const translateY = useSharedValue(overlay.position.y);
  const rotation = useSharedValue(overlay.rotation);

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
      runOnJS(updateText)(overlay.id, {
        position: { x: translateX.value, y: translateY.value },
      });
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
      runOnJS(updateText)(overlay.id, { rotation: rotation.value });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}rad` },
      ],
    };
  });

  const handleTextSave = () => {
    updateText(overlay.id, { text: editedText });
    setIsEditing(false);
  };

  const handleDelete = () => {
    removeText(overlay.id);
  };

  return (
    <>
      <RotationGestureHandler onGestureEvent={rotationGestureHandler}>
        <Animated.View>
          <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View style={[styles.container, animatedStyle]}>
              <TouchableOpacity
                onPress={onSelect}
                onLongPress={() => setIsEditing(true)}
                activeOpacity={0.9}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      fontFamily: overlay.font,
                      color: overlay.color,
                      fontSize: overlay.size,
                    },
                  ]}
                >
                  {overlay.text}
                </Text>
                
                {isSelected && (
                  <View style={styles.handles}>
                    <View style={styles.handleCorner} />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={handleDelete}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => setIsEditing(true)}
                    >
                      <Ionicons name="create" size={20} color="#6B4EFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </RotationGestureHandler>

      {/* Edit Modal */}
      <Modal
        visible={isEditing}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Text</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.textInput}
              value={editedText}
              onChangeText={setEditedText}
              placeholder="Enter text..."
              multiline
              autoFocus
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Font</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {FONTS.map((font) => (
                  <TouchableOpacity
                    key={font}
                    style={[
                      styles.fontButton,
                      overlay.font === font && styles.fontButtonActive,
                    ]}
                    onPress={() => updateText(overlay.id, { font })}
                  >
                    <Text
                      style={[
                        styles.fontButtonText,
                        { fontFamily: font },
                        overlay.font === font && styles.fontButtonTextActive,
                      ]}
                    >
                      Aa
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.colorGrid}>
                {PRESET_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      overlay.color === color && styles.colorButtonActive,
                    ]}
                    onPress={() => updateText(overlay.id, { color })}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size: {overlay.size}px</Text>
              <View style={styles.sizeButtons}>
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() =>
                    updateText(overlay.id, { size: Math.max(12, overlay.size - 4) })
                  }
                >
                  <Ionicons name="remove" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sizeButton}
                  onPress={() =>
                    updateText(overlay.id, { size: Math.min(72, overlay.size + 4) })
                  }
                >
                  <Ionicons name="add" size={24} color="#000" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleTextSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  text: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  handles: {
    position: 'absolute',
    top: -12,
    right: -12,
    flexDirection: 'row',
  },
  handleCorner: {
    width: 8,
    height: 8,
    backgroundColor: '#6B4EFF',
    borderRadius: 4,
  },
  deleteButton: {
    marginLeft: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  editButton: {
    marginLeft: 4,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  fontButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    marginRight: 8,
  },
  fontButtonActive: {
    backgroundColor: '#6B4EFF',
  },
  fontButtonText: {
    fontSize: 20,
    color: '#000',
  },
  fontButtonTextActive: {
    color: '#FFF',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    margin: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: '#6B4EFF',
    borderWidth: 3,
  },
  sizeButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  sizeButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#6B4EFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
