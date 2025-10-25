import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FrameStyle, PRESET_COLORS } from '../../types/editor';
import { useEditorStore } from '../../store/editorStore';

const FRAME_TYPES = [
  { id: 'border', name: 'Border', icon: 'square-outline' },
  { id: 'rounded', name: 'Rounded', icon: 'stop-outline' },
  { id: 'shadow', name: 'Shadow', icon: 'square' },
] as const;

const FRAME_WIDTHS = [2, 4, 6, 8, 10, 12];

interface FramePickerProps {
  onClose?: () => void;
}

export const FramePicker: React.FC<FramePickerProps> = ({ onClose }) => {
  const { frame, setFrame } = useEditorStore();

  const handleTypeSelect = (type: 'border' | 'rounded' | 'shadow') => {
    const newFrame: FrameStyle = {
      id: `frame-${type}-${Date.now()}`,
      type,
      color: frame?.color || '#FFFFFF',
      width: frame?.width || 4,
    };
    setFrame(newFrame);
  };

  const handleColorSelect = (color: string) => {
    if (frame) {
      setFrame({ ...frame, color });
    }
  };

  const handleWidthSelect = (width: number) => {
    if (frame) {
      setFrame({ ...frame, width });
    }
  };

  const handleRemoveFrame = () => {
    setFrame(undefined);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Frame Style</Text>
        {frame && (
          <TouchableOpacity onPress={handleRemoveFrame}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Frame Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type</Text>
          <View style={styles.typeGrid}>
            {FRAME_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  frame?.type === type.id && styles.typeButtonActive,
                ]}
                onPress={() => handleTypeSelect(type.id)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={32}
                  color={frame?.type === type.id ? '#FFF' : '#6B4EFF'}
                />
                <Text
                  style={[
                    styles.typeName,
                    frame?.type === type.id && styles.typeNameActive,
                  ]}
                >
                  {type.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frame Color */}
        {frame && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color</Text>
            <View style={styles.colorGrid}>
              {PRESET_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    frame.color === color && styles.colorButtonActive,
                  ]}
                  onPress={() => handleColorSelect(color)}
                >
                  {frame.color === color && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={color === '#FFFFFF' ? '#000' : '#FFF'}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Frame Width */}
        {frame && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Width: {frame.width}px</Text>
            <View style={styles.widthGrid}>
              {FRAME_WIDTHS.map((width) => (
                <TouchableOpacity
                  key={width}
                  style={[
                    styles.widthButton,
                    frame.width === width && styles.widthButtonActive,
                  ]}
                  onPress={() => handleWidthSelect(width)}
                >
                  <Text
                    style={[
                      styles.widthText,
                      frame.width === width && styles.widthTextActive,
                    ]}
                  >
                    {width}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Preview */}
        {frame && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewContainer}>
              <View
                style={[
                  styles.preview,
                  frame.type === 'border' && {
                    borderWidth: frame.width,
                    borderColor: frame.color,
                  },
                  frame.type === 'rounded' && {
                    borderWidth: frame.width,
                    borderColor: frame.color,
                    borderRadius: 20,
                  },
                  frame.type === 'shadow' && {
                    borderWidth: frame.width,
                    borderColor: frame.color,
                    shadowColor: frame.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    elevation: 8,
                  },
                ]}
              >
                <View style={styles.previewContent}>
                  <Ionicons name="image" size={32} color="#999" />
                  <Text style={styles.previewText}>Your image here</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.hint}>
        <Ionicons name="information-circle-outline" size={16} color="#666" />
        <Text style={styles.hintText}>
          Select a frame style to add borders to your transformation
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  removeText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
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
  typeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    backgroundColor: '#6B4EFF',
    borderColor: '#6B4EFF',
  },
  typeName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    marginTop: 8,
  },
  typeNameActive: {
    color: '#FFF',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  colorButtonActive: {
    borderColor: '#6B4EFF',
    borderWidth: 3,
  },
  widthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  widthButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    margin: 4,
  },
  widthButtonActive: {
    backgroundColor: '#6B4EFF',
  },
  widthText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  widthTextActive: {
    color: '#FFF',
  },
  previewContainer: {
    alignItems: 'center',
    padding: 16,
  },
  preview: {
    width: 200,
    height: 200,
    backgroundColor: '#F8F9FA',
  },
  previewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
});
