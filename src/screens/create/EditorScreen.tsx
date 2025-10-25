import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  SafeAreaView,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEditorStore } from '../../store/editorStore';
import ImageComparer from '../../components/create/ImageComparer';
import TextOverlayComponent from '../../components/create/TextOverlay';
import StickerPicker from '../../components/create/StickerPicker';
import TransitionPreview from '../../components/create/TransitionPreview';
import { TransitionType, TextOverlay, Sticker, FontOption, ColorOption } from '../../types';
import { FONTS, COLORS, TRANSITIONS } from '../../utils/constants';

const { width, height } = Dimensions.get('window');
const PREVIEW_HEIGHT = height * 0.6;

type TabType = 'transition' | 'text' | 'stickers' | 'music' | 'frame';


const EditorScreen: React.FC = () => {
  const {
    beforeImage,
    afterImage,
    transition,
    textOverlays,
    stickers,
    music,
    frame,
    setTransition,
    addTextOverlay,
    updateTextOverlay,
    removeTextOverlay,
    addSticker,
    updateSticker,
    removeSticker,
    undo,
    redo,
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<TabType>('transition');
  const [selectedTextOverlay, setSelectedTextOverlay] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [selectedFont, setSelectedFont] = useState('system');
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [textSize, setTextSize] = useState(24);

  if (!beforeImage || !afterImage) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>No images selected</Text>
          <Text style={styles.errorSubtext}>Please go back and select before/after images</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddText = () => {
    if (textInput.trim()) {
      const newTextOverlay: TextOverlay = {
        id: Math.random().toString(36).substr(2, 9),
        text: textInput.trim(),
        font: selectedFont,
        color: selectedColor,
        size: textSize,
        position: { x: 100, y: 100 },
        rotation: 0,
      };
      addTextOverlay(newTextOverlay);
      setTextInput('');
    }
  };

  const handleStickerSelect = (sticker: Sticker) => {
    addSticker(sticker);
    setShowStickerPicker(false);
  };

  const renderTransitionTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Choose Transition</Text>
      <View style={styles.transitionGrid}>
        {TRANSITIONS.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[
              styles.transitionOption,
              transition === t.id && styles.transitionOptionSelected,
            ]}
            onPress={() => setTransition(t.id)}
          >
            <Ionicons
              name={t.icon as any}
              size={32}
              color={transition === t.id ? '#007AFF' : '#8E8E93'}
            />
            <Text
              style={[
                styles.transitionText,
                transition === t.id && styles.transitionTextSelected,
              ]}
            >
              {t.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TransitionPreview
        beforeImage={beforeImage}
        afterImage={afterImage}
        transition={transition}
        isPlaying={isPreviewPlaying}
        onPlayPause={() => setIsPreviewPlaying(!isPreviewPlaying)}
      />
    </View>
  );

  const renderTextTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Add Text Overlay</Text>
      
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter text..."
          value={textInput}
          onChangeText={setTextInput}
          placeholderTextColor="#8E8E93"
        />
        <TouchableOpacity
          style={[styles.addButton, !textInput.trim() && styles.addButtonDisabled]}
          onPress={handleAddText}
          disabled={!textInput.trim()}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.fontSelector}>
        <Text style={styles.selectorTitle}>Font</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FONTS.map((font) => (
            <TouchableOpacity
              key={font.id}
              style={[
                styles.fontOption,
                selectedFont === font.id && styles.fontOptionSelected,
              ]}
              onPress={() => setSelectedFont(font.id)}
            >
              <Text style={[styles.fontText, { fontFamily: font.fontFamily }]}>
                Aa
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.colorSelector}>
        <Text style={styles.selectorTitle}>Color</Text>
        <View style={styles.colorGrid}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorOption,
                { backgroundColor: color.color },
                selectedColor === color.color && styles.colorOptionSelected,
              ]}
              onPress={() => setSelectedColor(color.color)}
            />
          ))}
        </View>
      </View>

      <View style={styles.sizeSelector}>
        <Text style={styles.selectorTitle}>Size: {textSize}px</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>12</Text>
          <View style={styles.slider}>
            <TouchableOpacity
              style={[
                styles.sliderThumb,
                { left: `${((textSize - 12) / (48 - 12)) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.sliderLabel}>48</Text>
        </View>
      </View>
    </View>
  );

  const renderStickersTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Add Stickers</Text>
      <TouchableOpacity
        style={styles.stickerButton}
        onPress={() => setShowStickerPicker(true)}
      >
        <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        <Text style={styles.stickerButtonText}>Choose Stickers</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMusicTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Background Music</Text>
      <Text style={styles.comingSoonText}>Music feature coming soon!</Text>
    </View>
  );

  const renderFrameTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Frame Style</Text>
      <Text style={styles.comingSoonText}>Frame feature coming soon!</Text>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'transition':
        return renderTransitionTab();
      case 'text':
        return renderTextTab();
      case 'stickers':
        return renderStickersTab();
      case 'music':
        return renderMusicTab();
      case 'frame':
        return renderFrameTab();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topButton} onPress={() => {}}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        
        <View style={styles.topButtonGroup}>
          <TouchableOpacity style={styles.topButton} onPress={undo}>
            <Ionicons name="arrow-undo" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topButton} onPress={redo}>
            <Ionicons name="arrow-redo" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => setIsPreviewPlaying(!isPreviewPlaying)}
          >
            <Ionicons
              name={isPreviewPlaying ? 'pause' : 'play'}
              size={24}
              color="#007AFF"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Preview Area */}
      <View style={styles.previewArea}>
        <ImageComparer
          beforeImage={beforeImage}
          afterImage={afterImage}
          transition={transition}
        />
        
        {/* Text Overlays */}
        {textOverlays.map((overlay) => (
          <TextOverlayComponent
            key={overlay.id}
            overlay={overlay}
            onUpdate={updateTextOverlay}
            onDelete={removeTextOverlay}
            isSelected={selectedTextOverlay === overlay.id}
            onSelect={setSelectedTextOverlay}
          />
        ))}
        
        {/* Stickers */}
        {stickers.map((sticker) => (
          <View key={sticker.id} style={styles.stickerContainer}>
            <TouchableOpacity
              style={styles.sticker}
              onPress={() => setSelectedTextOverlay(sticker.id)}
            >
              {/* Sticker implementation would go here */}
            </TouchableOpacity>
            {selectedTextOverlay === sticker.id && (
              <TouchableOpacity
                style={styles.stickerDeleteButton}
                onPress={() => removeSticker(sticker.id)}
              >
                <Ionicons name="close" size={16} color="#FF3B30" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {[
            { id: 'transition', name: 'Transition', icon: 'swap-horizontal-outline' },
            { id: 'text', name: 'Text', icon: 'text-outline' },
            { id: 'stickers', name: 'Stickers', icon: 'happy-outline' },
            { id: 'music', name: 'Music', icon: 'musical-notes-outline' },
            { id: 'frame', name: 'Frame', icon: 'square-outline' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.id as TabType)}
            >
              <Ionicons
                name={tab.icon as any}
                size={20}
                color={activeTab === tab.id ? '#007AFF' : '#8E8E93'}
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
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View style={styles.tabContentContainer}>
        {renderTabContent()}
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, styles.bottomButtonPrimary]}>
          <Text style={[styles.bottomButtonText, styles.bottomButtonTextPrimary]}>
            Preview
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sticker Picker Modal */}
      <Modal
        visible={showStickerPicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <StickerPicker
          onStickerSelect={handleStickerSelect}
          onClose={() => setShowStickerPicker(false)}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  topButton: {
    padding: 8,
  },
  topButtonGroup: {
    flexDirection: 'row',
  },
  previewArea: {
    height: PREVIEW_HEIGHT,
    position: 'relative',
  },
  stickerContainer: {
    position: 'absolute',
  },
  sticker: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  stickerDeleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabContainer: {
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#007AFF',
  },
  tabContentContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  tabContent: {
    padding: 20,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  transitionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  transitionOption: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
  },
  transitionOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  transitionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 8,
  },
  transitionTextSelected: {
    color: '#007AFF',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
  },
  addButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  fontSelector: {
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  fontOption: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fontOptionSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  fontText: {
    fontSize: 18,
    fontWeight: '600',
  },
  colorSelector: {
    marginBottom: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#007AFF',
  },
  sizeSelector: {
    marginBottom: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 14,
    color: '#8E8E93',
    width: 30,
  },
  slider: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginHorizontal: 12,
    position: 'relative',
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  stickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  stickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 8,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#F2F2F7',
  },
  bottomButtonPrimary: {
    backgroundColor: '#007AFF',
  },
  bottomButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  bottomButtonTextPrimary: {
    color: '#FFFFFF',
  },
});

export default EditorScreen;