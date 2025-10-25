import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useEditorStore } from '../../store/editorStore';
import { ImageComparer } from '../../components/create/ImageComparer';
import { TransitionPreview } from '../../components/create/TransitionPreview';
import { TextOverlay } from '../../components/create/TextOverlay';
import { StickerOverlay } from '../../components/create/StickerOverlay';
import { StickerPicker } from '../../components/create/StickerPicker';
import { MusicPicker } from '../../components/create/MusicPicker';
import { FramePicker } from '../../components/create/FramePicker';
import { TransitionType, TRANSITIONS } from '../../types/editor';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PREVIEW_HEIGHT = SCREEN_HEIGHT * 0.6;
const TOOLBAR_HEIGHT = SCREEN_HEIGHT * 0.4;

type EditorTab = 'transition' | 'text' | 'stickers' | 'music' | 'frame';

export const EditorScreen = () => {
  const navigation = useNavigation();
  const {
    beforeImage,
    afterImage,
    transition,
    setTransition,
    textOverlays,
    stickers,
    addText,
    undo,
    redo,
    history,
    historyIndex,
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<EditorTab>('transition');
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overlay' | 'side-by-side'>('overlay');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAddText = () => {
    const newText = {
      id: `text-${Date.now()}`,
      text: 'Double tap to edit',
      font: 'System',
      color: '#FFFFFF',
      size: 24,
      position: { x: SCREEN_WIDTH / 2 - 75, y: 100 },
      rotation: 0,
    };
    addText(newText);
    setSelectedTextId(newText.id);
  };

  const handlePreview = () => {
    setIsPreviewPlaying(true);
    setTimeout(() => setIsPreviewPlaying(false), 3000);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const renderPreviewArea = () => (
    <View style={styles.previewArea}>
      {isPreviewPlaying ? (
        <TransitionPreview
          beforeImage={beforeImage}
          afterImage={afterImage}
          transition={transition}
          isPlaying={isPreviewPlaying}
        />
      ) : (
        <View style={styles.canvasContainer}>
          <ImageComparer
            beforeImage={beforeImage}
            afterImage={afterImage}
            mode={viewMode}
          />

          {/* Render text overlays */}
          {textOverlays.map((overlay) => (
            <TextOverlay
              key={overlay.id}
              overlay={overlay}
              isSelected={selectedTextId === overlay.id}
              onSelect={() => setSelectedTextId(overlay.id)}
              containerWidth={SCREEN_WIDTH}
              containerHeight={PREVIEW_HEIGHT}
            />
          ))}

          {/* Render stickers */}
          {stickers.map((sticker) => (
            <StickerOverlay
              key={sticker.id}
              sticker={sticker}
              isSelected={selectedStickerId === sticker.id}
              onSelect={() => setSelectedStickerId(sticker.id)}
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderTransitionTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>Transition Effect</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.transitionList}
      >
        {TRANSITIONS.map((trans) => (
          <TouchableOpacity
            key={trans}
            style={[
              styles.transitionButton,
              transition === trans && styles.transitionButtonActive,
            ]}
            onPress={() => setTransition(trans)}
          >
            <Ionicons
              name={
                trans === 'fade'
                  ? 'contrast'
                  : trans === 'slide'
                  ? 'chevron-forward'
                  : trans === 'swipe'
                  ? 'swap-horizontal'
                  : 'resize'
              }
              size={24}
              color={transition === trans ? '#FFF' : '#6B4EFF'}
            />
            <Text
              style={[
                styles.transitionText,
                transition === trans && styles.transitionTextActive,
              ]}
            >
              {trans.charAt(0).toUpperCase() + trans.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.viewModeToggle}>
        <Text style={styles.tabSubtitle}>View Mode</Text>
        <View style={styles.toggleButtons}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'overlay' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('overlay')}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === 'overlay' && styles.toggleTextActive,
              ]}
            >
              Overlay
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'side-by-side' && styles.toggleButtonActive,
            ]}
            onPress={() => setViewMode('side-by-side')}
          >
            <Text
              style={[
                styles.toggleText,
                viewMode === 'side-by-side' && styles.toggleTextActive,
              ]}
            >
              Side by Side
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderTextTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Text Overlays</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddText}>
          <Ionicons name="add-circle" size={24} color="#6B4EFF" />
          <Text style={styles.addButtonText}>Add Text</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>
        Tap text on the preview to select, drag to move, pinch to rotate
      </Text>
    </View>
  );

  const renderToolbarContent = () => {
    switch (activeTab) {
      case 'transition':
        return renderTransitionTab();
      case 'text':
        return renderTextTab();
      case 'stickers':
        return (
          <StickerPicker
            containerWidth={SCREEN_WIDTH}
            containerHeight={PREVIEW_HEIGHT}
          />
        );
      case 'music':
        return <MusicPicker />;
      case 'frame':
        return <FramePicker />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.topActions}>
          <TouchableOpacity
            style={[styles.topButton, !canUndo && styles.topButtonDisabled]}
            onPress={undo}
            disabled={!canUndo}
          >
            <Ionicons
              name="arrow-undo"
              size={24}
              color={canUndo ? '#000' : '#CCC'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topButton, !canRedo && styles.topButtonDisabled]}
            onPress={redo}
            disabled={!canRedo}
          >
            <Ionicons
              name="arrow-redo"
              size={24}
              color={canRedo ? '#000' : '#CCC'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
            <Ionicons name="play" size={20} color="#FFF" />
            <Text style={styles.previewButtonText}>Preview</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preview Area */}
      {renderPreviewArea()}

      {/* Toolbar */}
      <View style={styles.toolbar}>
        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transition' && styles.tabActive]}
            onPress={() => setActiveTab('transition')}
          >
            <Ionicons
              name="film"
              size={20}
              color={activeTab === 'transition' ? '#6B4EFF' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'transition' && styles.tabTextActive,
              ]}
            >
              Transition
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'text' && styles.tabActive]}
            onPress={() => setActiveTab('text')}
          >
            <Ionicons
              name="text"
              size={20}
              color={activeTab === 'text' ? '#6B4EFF' : '#666'}
            />
            <Text
              style={[styles.tabText, activeTab === 'text' && styles.tabTextActive]}
            >
              Text
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'stickers' && styles.tabActive]}
            onPress={() => setActiveTab('stickers')}
          >
            <Ionicons
              name="happy"
              size={20}
              color={activeTab === 'stickers' ? '#6B4EFF' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'stickers' && styles.tabTextActive,
              ]}
            >
              Stickers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'music' && styles.tabActive]}
            onPress={() => setActiveTab('music')}
          >
            <Ionicons
              name="musical-notes"
              size={20}
              color={activeTab === 'music' ? '#6B4EFF' : '#666'}
            />
            <Text
              style={[styles.tabText, activeTab === 'music' && styles.tabTextActive]}
            >
              Music
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'frame' && styles.tabActive]}
            onPress={() => setActiveTab('frame')}
          >
            <Ionicons
              name="square-outline"
              size={20}
              color={activeTab === 'frame' ? '#6B4EFF' : '#666'}
            />
            <Text
              style={[styles.tabText, activeTab === 'frame' && styles.tabTextActive]}
            >
              Frame
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>{renderToolbarContent()}</View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.draftButton}>
          <Ionicons name="save-outline" size={20} color="#666" />
          <Text style={styles.draftButtonText}>Save Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handlePreview}>
          <Text style={styles.continueButtonText}>Preview & Export</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  topButton: {
    padding: 8,
  },
  topButtonDisabled: {
    opacity: 0.3,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  previewButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  previewArea: {
    height: PREVIEW_HEIGHT,
    backgroundColor: '#000',
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
  },
  toolbar: {
    height: TOOLBAR_HEIGHT,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  tabNavigation: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6B4EFF',
  },
  tabText: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#6B4EFF',
    fontWeight: '600',
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  tabSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: '#6B4EFF',
    fontWeight: '500',
    marginLeft: 4,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  transitionList: {
    paddingVertical: 8,
  },
  transitionButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  transitionButtonActive: {
    backgroundColor: '#6B4EFF',
  },
  transitionText: {
    fontSize: 14,
    color: '#000',
    marginTop: 8,
  },
  transitionTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  viewModeToggle: {
    marginTop: 16,
  },
  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFF',
  },
  toggleText: {
    fontSize: 14,
    color: '#666',
  },
  toggleTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  draftButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  draftButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginLeft: 6,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B4EFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 8,
  },
});
