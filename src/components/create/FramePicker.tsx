import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FrameStyle } from '../../types/transformation';
import { useEditorStore } from '../../store/editorStore';
import { FRAME_STYLES } from '../../constants/editor';

const { width: screenWidth } = Dimensions.get('window');

interface FramePickerProps {
  selectedFrame: FrameStyle | null;
}

const FramePicker: React.FC<FramePickerProps> = ({ selectedFrame }) => {
  const { setFrame } = useEditorStore();

  const handleFrameSelect = (frame: FrameStyle) => {
    if (selectedFrame?.id === frame.id) {
      // Deselect if already selected
      setFrame(null);
    } else {
      setFrame(frame);
    }
  };

  const renderFramePreview = (frame: FrameStyle) => {
    const isSelected = selectedFrame?.id === frame.id;
    
    return (
      <TouchableOpacity
        key={frame.id}
        style={[styles.frameOption, isSelected && styles.frameOptionSelected]}
        onPress={() => handleFrameSelect(frame)}
      >
        <View
          style={[
            styles.framePreview,
            {
              borderWidth: frame.borderWidth,
              borderColor: frame.borderColor,
              borderRadius: frame.borderRadius || 0,
              shadowColor: frame.shadowColor || 'transparent',
              shadowOffset: frame.shadowOffset || { width: 0, height: 0 },
              shadowOpacity: frame.shadowOpacity || 0,
              shadowRadius: frame.shadowRadius || 0,
              elevation: frame.shadowOpacity ? 3 : 0,
            },
          ]}
        >
          <View style={styles.previewContent}>
            <View style={styles.previewImagePlaceholder} />
          </View>
        </View>
        
        <Text style={styles.frameName}>{frame.name}</Text>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Ionicons name="checkmark-circle" size={20} color="#4A90E2" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Frame Style</Text>
        {selectedFrame && selectedFrame.id !== 'none' && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setFrame(FRAME_STYLES[0])} // Set to 'none'
          >
            <Text style={styles.clearButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedFrame && selectedFrame.id !== 'none' && (
        <View style={styles.selectedFrame}>
          <View style={styles.selectedFrameInfo}>
            <Ionicons name="image-outline" size={20} color="#4A90E2" />
            <Text style={styles.selectedFrameName}>{selectedFrame.name}</Text>
          </View>
          
          <View style={styles.frameDetails}>
            <View style={styles.frameDetail}>
              <Text style={styles.frameDetailLabel}>Border Width:</Text>
              <Text style={styles.frameDetailValue}>{selectedFrame.borderWidth}px</Text>
            </View>
            <View style={styles.frameDetail}>
              <Text style={styles.frameDetailLabel}>Color:</Text>
              <View style={[styles.colorSwatch, { backgroundColor: selectedFrame.borderColor }]} />
            </View>
            {selectedFrame.borderRadius && (
              <View style={styles.frameDetail}>
                <Text style={styles.frameDetailLabel}>Radius:</Text>
                <Text style={styles.frameDetailValue}>{selectedFrame.borderRadius}px</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <ScrollView
        style={styles.frameList}
        contentContainerStyle={styles.frameGrid}
        showsVerticalScrollIndicator={false}
      >
        {FRAME_STYLES.map(renderFramePreview)}
      </ScrollView>

      {FRAME_STYLES.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="image-outline" size={48} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>No frame styles available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FF4444',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedFrame: {
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedFrameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  selectedFrameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  frameDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  frameDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  frameDetailLabel: {
    fontSize: 12,
    color: '#666666',
  },
  frameDetailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  colorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  frameList: {
    flex: 1,
  },
  frameGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  frameOption: {
    width: (screenWidth - 64) / 2,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  frameOptionSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F7FF',
  },
  framePreview: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImagePlaceholder: {
    width: '70%',
    height: '70%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  frameName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
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
    textAlign: 'center',
  },
});

export default FramePicker;