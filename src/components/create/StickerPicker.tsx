import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler, PinchGestureHandler, RotationGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Sticker as StickerType } from '../../types/transformation';
import { useEditorStore } from '../../store/editorStore';
import { STICKER_CATEGORIES } from '../../constants/editor';

interface StickerProps {
  sticker: StickerType;
  isSelected: boolean;
  onSelect: () => void;
  canvasSize: { width: number; height: number };
}

const StickerComponent: React.FC<StickerProps> = ({
  sticker,
  isSelected,
  onSelect,
  canvasSize,
}) => {
  const { updateSticker, removeSticker } = useEditorStore();
  
  const translateX = useSharedValue(sticker.position.x);
  const translateY = useSharedValue(sticker.position.y);
  const scale = useSharedValue(sticker.scale);
  const rotation = useSharedValue(sticker.rotation);

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
      runOnJS(updateSticker)(sticker.id, {
        position: { x: translateX.value, y: translateY.value },
      });
    },
  });

  const pinchGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startScale = scale.value;
    },
    onActive: (event, context) => {
      const newScale = Math.max(0.3, Math.min(3, context.startScale * event.scale));
      scale.value = newScale;
    },
    onEnd: () => {
      runOnJS(updateSticker)(sticker.id, {
        scale: scale.value,
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
      runOnJS(updateSticker)(sticker.id, {
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

  const handleDelete = () => {
    removeSticker(sticker.id);
  };

  return (
    <RotationGestureHandler onGestureEvent={rotationGestureHandler}>
      <PinchGestureHandler onGestureEvent={pinchGestureHandler}>
        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Animated.View style={[styles.stickerContainer, animatedStyle]}>
            <TouchableOpacity onPress={onSelect} style={styles.stickerWrapper}>
              <Image
                source={{ uri: sticker.uri }}
                style={[
                  styles.stickerImage,
                  isSelected && styles.stickerImageSelected,
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            {isSelected && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Ionicons name="close-circle" size={24} color="#FF4444" />
              </TouchableOpacity>
            )}
          </Animated.View>
        </PanGestureHandler>
      </PinchGestureHandler>
    </RotationGestureHandler>
  );
};

interface StickerPickerProps {
  selectedStickerId: string | null;
}

const StickerPicker: React.FC<StickerPickerProps> = ({ selectedStickerId }) => {
  const { addSticker } = useEditorStore();
  const [activeCategory, setActiveCategory] = useState(STICKER_CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const activeStickers = STICKER_CATEGORIES.find(cat => cat.id === activeCategory)?.stickers || [];
  
  const filteredStickers = searchQuery
    ? activeStickers.filter(sticker =>
        sticker.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeStickers;

  const handleStickerSelect = (stickerUri: string) => {
    addSticker(stickerUri);
  };

  const renderStickerItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.stickerPickerItem}
      onPress={() => handleStickerSelect(item.uri)}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.stickerPickerImage}
        resizeMode="contain"
      />
      <Text style={styles.stickerPickerName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.pickerContainer}>
      <View style={styles.pickerHeader}>
        <Text style={styles.pickerTitle}>Stickers</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stickers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={16} color="#999999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryTabs}
        contentContainerStyle={styles.categoryTabsContent}
      >
        {STICKER_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              activeCategory === category.id && styles.categoryTabActive,
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryTabText,
                activeCategory === category.id && styles.categoryTabTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stickers Grid */}
      <FlatList
        data={filteredStickers}
        renderItem={renderStickerItem}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={styles.stickerGrid}
        showsVerticalScrollIndicator={false}
      />

      {filteredStickers.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="happy-outline" size={48} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No stickers found' : 'No stickers in this category'}
          </Text>
          {searchQuery && (
            <Text style={styles.emptyStateSubtext}>
              Try a different search term
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

// Sticker Canvas Component (for rendering stickers on the canvas)
interface StickerCanvasProps {
  stickers: StickerType[];
  selectedStickerId: string | null;
  onStickerSelect: (id: string | null) => void;
  canvasSize: { width: number; height: number };
}

export const StickerCanvas: React.FC<StickerCanvasProps> = ({
  stickers,
  selectedStickerId,
  onStickerSelect,
  canvasSize,
}) => {
  return (
    <View style={styles.canvas}>
      {stickers.map((sticker) => (
        <StickerComponent
          key={sticker.id}
          sticker={sticker}
          isSelected={selectedStickerId === sticker.id}
          onSelect={() => onStickerSelect(sticker.id)}
          canvasSize={canvasSize}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  // Sticker Component Styles
  stickerContainer: {
    position: 'absolute',
  },
  stickerWrapper: {
    position: 'relative',
  },
  stickerImage: {
    width: 60,
    height: 60,
  },
  stickerImageSelected: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 4,
  },
  deleteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  
  // Picker Styles
  pickerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  pickerHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
  
  // Category Tabs
  categoryTabs: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  categoryTabActive: {
    backgroundColor: '#4A90E2',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  
  // Sticker Grid
  stickerGrid: {
    padding: 16,
  },
  stickerPickerItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerPickerImage: {
    width: '70%',
    height: '70%',
  },
  stickerPickerName: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Canvas
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Empty State
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
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default StickerPicker;