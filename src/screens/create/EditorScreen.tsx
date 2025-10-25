import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEditorStore } from '../../store/editorStore';
import { EditorTab } from '../../types/transformation';
import ImageComparer from '../../components/create/ImageComparer';
import TextOverlayComponent, { TextEditorPanel } from '../../components/create/TextOverlay';
import StickerPicker, { StickerCanvas } from '../../components/create/StickerPicker';
import { TransitionPanel } from '../../components/create/TransitionPreview';
import MusicPicker from '../../components/create/MusicPicker';
import FramePicker from '../../components/create/FramePicker';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface EditorScreenProps {
  navigation: any;
}

const EditorScreen: React.FC<EditorScreenProps> = ({ navigation }) => {
  const {
    beforeImage,
    afterImage,
    activeTab,
    setActiveTab,
    isPreviewMode,
    setPreviewMode,
    textOverlays,
    stickers,
    selectedTextId,
    selectedStickerId,
    selectText,
    selectSticker,
    canvasSize,
    music,
    frame,
    canUndo,
    canRedo,
    undo,
    redo,
    transition,
  } = useEditorStore();

  const [isPlaying, setIsPlaying] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePreviewToggle = () => {
    setPreviewMode(!isPreviewMode);
    setIsPlaying(false);
  };

  const handleTabPress = (tab: EditorTab) => {
    setActiveTab(tab);
    setPreviewMode(false);
  };

  const handleCanvasPress = () => {
    // Deselect any selected items when tapping on empty canvas
    selectText(null);
    selectSticker(null);
  };

  const renderPreviewArea = () => {
    if (!beforeImage || !afterImage) {
      return (
        <View style={styles.emptyPreview}>
          <Ionicons name="images-outline" size={48} color="#CCCCCC" />
          <Text style={styles.emptyPreviewText}>Add images to start editing</Text>
        </View>
      );
    }

    return (
      <View style={styles.previewContainer}>
        <TouchableOpacity
          style={styles.canvas}
          activeOpacity={1}
          onPress={handleCanvasPress}
        >
          <ImageComparer
            beforeImage={beforeImage}
            afterImage={afterImage}
            mode={isPreviewMode ? 'slider' : 'side-by-side'}
          />
          
          {/* Text Overlays */}
          {textOverlays.map((overlay) => (
            <TextOverlayComponent
              key={overlay.id}
              overlay={overlay}
              isSelected={selectedTextId === overlay.id}
              onSelect={() => selectText(overlay.id)}
              canvasSize={canvasSize}
            />
          ))}
          
          {/* Stickers */}
          <StickerCanvas
            stickers={stickers}
            selectedStickerId={selectedStickerId}
            onStickerSelect={selectSticker}
            canvasSize={canvasSize}
          />
          
          {/* Frame Overlay */}
          {frame && frame.id !== 'none' && (
            <View
              style={[
                styles.frameOverlay,
                {
                  borderWidth: frame.borderWidth,
                  borderColor: frame.borderColor,
                  borderRadius: frame.borderRadius || 0,
                  shadowColor: frame.shadowColor || 'transparent',
                  shadowOffset: frame.shadowOffset || { width: 0, height: 0 },
                  shadowOpacity: frame.shadowOpacity || 0,
                  shadowRadius: frame.shadowRadius || 0,
                },
              ]}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderEditorPanel = () => {
    switch (activeTab) {
      case 'transition':
        return (
          <TransitionPanel
            beforeImage={beforeImage || ''}
            afterImage={afterImage || ''}
          />
        );
      case 'text':
        return <TextEditorPanel selectedTextId={selectedTextId} />;
      case 'stickers':
        return <StickerPicker selectedStickerId={selectedStickerId} />;
      case 'music':
        return <MusicPicker selectedMusic={music} />;
      case 'frame':
        return <FramePicker selectedFrame={frame} />;
      default:
        return null;
    }
  };

  const tabs: { id: EditorTab; name: string; icon: string }[] = [
    { id: 'transition', name: 'Transition', icon: 'swap-horizontal' },
    { id: 'text', name: 'Text', icon: 'text' },
    { id: 'stickers', name: 'Stickers', icon: 'happy' },
    { id: 'music', name: 'Music', icon: 'musical-notes' },
    { id: 'frame', name: 'Frame', icon: 'image' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBarButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.topBarCenter}>
          <TouchableOpacity
            style={[styles.topBarButton, !canUndo() && styles.topBarButtonDisabled]}
            onPress={undo}
            disabled={!canUndo()}
          >
            <Ionicons name="arrow-undo" size={20} color={canUndo() ? "#FFFFFF" : "#666666"} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.topBarButton, !canRedo() && styles.topBarButtonDisabled]}
            onPress={redo}
            disabled={!canRedo()}
          >
            <Ionicons name="arrow-redo" size={20} color={canRedo() ? "#FFFFFF" : "#666666"} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.previewButton, isPreviewMode && styles.previewButtonActive]}
          onPress={handlePreviewToggle}
        >
          <Ionicons
            name={isPreviewMode ? 'eye-off' : 'eye'}
            size={20}
            color={isPreviewMode ? "#4A90E2" : "#FFFFFF"}
          />
          <Text style={[styles.previewButtonText, isPreviewMode && styles.previewButtonTextActive]}>
            Preview
          </Text>
        </TouchableOpacity>
      </View>

      {/* Preview Area */}
      <View style={styles.previewArea}>
        {renderPreviewArea()}
      </View>

      {/* Editor Toolbar */}
      <View style={styles.editorToolbar}>
        {/* Tab Bar */}
        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive,
              ]}
              onPress={() => handleTabPress(tab.id)}
            >
              <Ionicons
                name={tab.icon as any}
                size={20}
                color={activeTab === tab.id ? '#4A90E2' : '#666666'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Editor Panel */}
        <View style={styles.editorPanel}>
          {renderEditorPanel()}
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Save Draft</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.bottomButton, styles.primaryButton]}
          onPress={() => navigation.navigate('Preview')}
        >
          <Text style={[styles.bottomButtonText, styles.primaryButtonText]}>
            Preview
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  
  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000000',
  },
  topBarButton: {
    padding: 8,
    borderRadius: 8,
  },
  topBarButtonDisabled: {
    opacity: 0.5,
  },
  topBarCenter: {
    flexDirection: 'row',
    gap: 8,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 4,
  },
  previewButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewButtonTextActive: {
    color: '#4A90E2',
  },
  
  // Preview Area
  previewArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  previewContainer: {
    flex: 1,
    position: 'relative',
  },
  canvas: {
    flex: 1,
  },
  frameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  emptyPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  emptyPreviewText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
  },
  
  // Editor Toolbar
  editorToolbar: {
    backgroundColor: '#FFFFFF',
    maxHeight: screenHeight * 0.4,
  },
  
  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666666',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#4A90E2',
  },
  
  // Editor Panel
  editorPanel: {
    flex: 1,
    minHeight: 200,
  },
  
  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 12,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    gap: 8,
  },
  bottomButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
});

export default EditorScreen;