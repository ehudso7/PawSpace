import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, RotationGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { TextOverlay as TextOverlayType } from '../../types/transformation';
import { useEditorStore } from '../../store/editorStore';
import { FONTS, COLOR_PRESETS } from '../../constants/editor';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TextOverlayProps {
  overlay: TextOverlayType;
  isSelected: boolean;
  onSelect: () => void;
  canvasSize: { width: number; height: number };
}

const TextOverlayComponent: React.FC<TextOverlayProps> = ({
  overlay,
  isSelected,
  onSelect,
  canvasSize,
}) => {
  const { updateTextOverlay, removeTextOverlay } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(overlay.text);
  
  const translateX = useSharedValue(overlay.position.x);
  const translateY = useSharedValue(overlay.position.y);
  const scale = useSharedValue(overlay.size / 24); // Base size is 24
  const rotation = useSharedValue(overlay.rotation || 0);

  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
      runOnJS(onSelect)();
    },
    onActive: (event, context) => {
      const newX = Math.max(0, Math.min(canvasSize.width, context.startX + event.translationX));
      const newY = Math.max(0, Math.min(canvasSize.height, context.startY + event.translationY));
      translateX.value = newX;
      translateY.value = newY;
    },
    onEnd: () => {
      runOnJS(updateTextOverlay)(overlay.id, {
        position: { x: translateX.value, y: translateY.value },
      });
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startScale = scale.value;
    },
    onActive: (event, context) => {
      const newScale = Math.max(0.5, Math.min(3, context.startScale * event.scale));
      scale.value = newScale;
    },
    onEnd: () => {
      runOnJS(updateTextOverlay)(overlay.id, {
        size: Math.round(scale.value * 24),
      });
    },
  });

  const rotationGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startRotation = rotation.value;
    },
    onActive: (event, context) => {
      rotation.value = context.startRotation + event.rotation;
    },
    onEnd: () => {
      runOnJS(updateTextOverlay)(overlay.id, {
        rotation: rotation.value,
      });
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

  const handleTextEdit = () => {
    setIsEditing(true);
  };

  const handleTextSave = () => {
    updateTextOverlay(overlay.id, { text: editText });
    setIsEditing(false);
  };

  const handleTextCancel = () => {
    setEditText(overlay.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    removeTextOverlay(overlay.id);
  };

  const selectedFont = FONTS.find(f => f.id === overlay.font) || FONTS[0];

  return (
    <>
      <RotationGestureHandler onGestureEvent={rotationGestureHandler}>
        <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
          <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View style={[styles.textContainer, animatedStyle]}>
              <TouchableOpacity
                onPress={onSelect}
                onLongPress={handleTextEdit}
                style={[
                  styles.textWrapper,
                  isSelected && styles.textWrapperSelected,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    {
                      fontFamily: selectedFont.family,
                      color: overlay.color,
                      fontSize: overlay.size,
                    },
                  ]}
                >
                  {overlay.text}
                </Text>
              </TouchableOpacity>
              
              {isSelected && (
                <View style={styles.controls}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={handleTextEdit}
                  >
                    <Ionicons name="pencil" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlButton, styles.deleteButton]}
                    onPress={handleDelete}
                  >
                    <Ionicons name="trash" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </PanGestureHandler>
        </PinchGestureHandler>
      </RotationGestureHandler>

      {/* Text Edit Modal */}
      <Modal
        visible={isEditing}
        transparent
        animationType="fade"
        onRequestClose={handleTextCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Text</Text>
            
            <TextInput
              style={styles.textInput}
              value={editText}
              onChangeText={setEditText}
              placeholder="Enter text..."
              multiline
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleTextCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleTextSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Text Editor Panel Component
interface TextEditorPanelProps {
  selectedTextId: string | null;
}

export const TextEditorPanel: React.FC<TextEditorPanelProps> = ({ selectedTextId }) => {
  const { textOverlays, updateTextOverlay, addTextOverlay } = useEditorStore();
  
  const selectedText = textOverlays.find(t => t.id === selectedTextId);

  const handleFontChange = (fontId: string) => {
    if (selectedText) {
      updateTextOverlay(selectedText.id, { font: fontId });
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedText) {
      updateTextOverlay(selectedText.id, { color });
    }
  };

  const handleSizeChange = (size: number) => {
    if (selectedText) {
      updateTextOverlay(selectedText.id, { size });
    }
  };

  const handleAddText = () => {
    addTextOverlay('Your text here');
  };

  return (
    <View style={styles.editorPanel}>
      <View style={styles.panelHeader}>
        <Text style={styles.panelTitle}>Text</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddText}>
          <Ionicons name="add" size={20} color="#4A90E2" />
          <Text style={styles.addButtonText}>Add Text</Text>
        </TouchableOpacity>
      </View>

      {selectedText && (
        <>
          {/* Font Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Font</Text>
            <View style={styles.fontGrid}>
              {FONTS.map((font) => (
                <TouchableOpacity
                  key={font.id}
                  style={[
                    styles.fontItem,
                    selectedText.font === font.id && styles.fontItemSelected,
                  ]}
                  onPress={() => handleFontChange(font.id)}
                >
                  <Text style={[styles.fontText, { fontFamily: font.family }]}>
                    Aa
                  </Text>
                  <Text style={styles.fontName}>{font.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorGrid}>
              {COLOR_PRESETS.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorItem,
                    { backgroundColor: color.hex },
                    selectedText.color === color.hex && styles.colorItemSelected,
                  ]}
                  onPress={() => handleColorChange(color.hex)}
                />
              ))}
            </View>
          </View>

          {/* Size Slider */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Size: {selectedText.size}px</Text>
            <View style={styles.sizeControls}>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => handleSizeChange(Math.max(12, selectedText.size - 2))}
              >
                <Ionicons name="remove" size={20} color="#666666" />
              </TouchableOpacity>
              <View style={styles.sizeDisplay}>
                <Text style={styles.sizeText}>{selectedText.size}</Text>
              </View>
              <TouchableOpacity
                style={styles.sizeButton}
                onPress={() => handleSizeChange(Math.min(72, selectedText.size + 2))}
              >
                <Ionicons name="add" size={20} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {!selectedText && textOverlays.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="text" size={48} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>No text added yet</Text>
          <Text style={styles.emptyStateSubtext}>Tap "Add Text" to get started</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
  },
  textWrapper: {
    padding: 8,
    borderRadius: 4,
  },
  textWrapperSelected: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderStyle: 'dashed',
  },
  text: {
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  controls: {
    position: 'absolute',
    top: -40,
    right: 0,
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 16,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.8)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: screenWidth - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  cancelButtonText: {
    color: '#666666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Editor Panel Styles
  editorPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  fontGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fontItem: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 60,
  },
  fontItemSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F7FF',
  },
  fontText: {
    fontSize: 20,
    marginBottom: 4,
  },
  fontName: {
    fontSize: 10,
    color: '#666666',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorItem: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorItemSelected: {
    borderColor: '#4A90E2',
  },
  sizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  sizeButton: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 20,
  },
  sizeDisplay: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TextOverlayComponent;