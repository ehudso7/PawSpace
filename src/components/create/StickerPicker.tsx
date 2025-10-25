import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sticker } from '../../types/editor';
import { useEditorStore } from '../../store/editorStore';

const { width } = Dimensions.get('window');
const STICKER_SIZE = (width - 64) / 5; // 5 columns with padding

// Sample sticker data (in a real app, these would be actual image URIs)
const STICKERS = [
  { id: 's1', uri: 'paw-1', icon: 'paw', category: 'paws' },
  { id: 's2', uri: 'paw-2', icon: 'paw-outline', category: 'paws' },
  { id: 's3', uri: 'heart-1', icon: 'heart', category: 'hearts' },
  { id: 's4', uri: 'heart-2', icon: 'heart-outline', category: 'hearts' },
  { id: 's5', uri: 'star-1', icon: 'star', category: 'stars' },
  { id: 's6', uri: 'star-2', icon: 'star-outline', category: 'stars' },
  { id: 's7', uri: 'sparkles', icon: 'sparkles', category: 'effects' },
  { id: 's8', uri: 'flash', icon: 'flash', category: 'effects' },
  { id: 's9', uri: 'trophy', icon: 'trophy', category: 'achievements' },
  { id: 's10', uri: 'ribbon', icon: 'ribbon', category: 'achievements' },
  { id: 's11', uri: 'happy', icon: 'happy', category: 'emotions' },
  { id: 's12', uri: 'thumbs-up', icon: 'thumbs-up', category: 'emotions' },
  { id: 's13', uri: 'checkmark-circle', icon: 'checkmark-circle', category: 'badges' },
  { id: 's14', uri: 'shield-checkmark', icon: 'shield-checkmark', category: 'badges' },
  { id: 's15', uri: 'medal', icon: 'medal', category: 'achievements' },
  { id: 's16', uri: 'gift', icon: 'gift', category: 'misc' },
  { id: 's17', uri: 'balloon', icon: 'balloon', category: 'party' },
  { id: 's18', uri: 'camera', icon: 'camera', category: 'misc' },
  { id: 's19', uri: 'brush', icon: 'brush', category: 'grooming' },
  { id: 's20', uri: 'cut', icon: 'cut', category: 'grooming' },
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'paws', name: 'Paws' },
  { id: 'hearts', name: 'Hearts' },
  { id: 'stars', name: 'Stars' },
  { id: 'effects', name: 'Effects' },
  { id: 'achievements', name: 'Achievements' },
  { id: 'emotions', name: 'Emotions' },
  { id: 'grooming', name: 'Grooming' },
];

interface StickerPickerProps {
  containerWidth: number;
  containerHeight: number;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({
  containerWidth,
  containerHeight,
}) => {
  const { addSticker } = useEditorStore();
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const handleStickerSelect = (stickerData: typeof STICKERS[0]) => {
    // Generate a unique ID for this instance
    const instanceId = `${stickerData.id}-${Date.now()}`;
    
    const newSticker: Sticker = {
      id: instanceId,
      uri: stickerData.uri,
      position: {
        x: containerWidth / 2 - 50,
        y: containerHeight / 2 - 50,
      },
      scale: 1,
      rotation: 0,
    };

    addSticker(newSticker);
  };

  const filteredStickers =
    selectedCategory === 'all'
      ? STICKERS
      : STICKERS.filter((s) => s.category === selectedCategory);

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sticker Grid */}
      <ScrollView
        style={styles.stickerScroll}
        contentContainerStyle={styles.stickerGrid}
        showsVerticalScrollIndicator={false}
      >
        {filteredStickers.map((sticker) => (
          <TouchableOpacity
            key={sticker.id}
            style={styles.stickerButton}
            onPress={() => handleStickerSelect(sticker)}
            activeOpacity={0.7}
          >
            <View style={styles.stickerIconContainer}>
              <Ionicons
                name={sticker.icon as any}
                size={STICKER_SIZE * 0.6}
                color="#6B4EFF"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.hint}>
        <Ionicons name="information-circle-outline" size={16} color="#666" />
        <Text style={styles.hintText}>Tap a sticker to add it to your image</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  categoryScroll: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#6B4EFF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  stickerScroll: {
    flex: 1,
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  stickerButton: {
    width: STICKER_SIZE,
    height: STICKER_SIZE,
    margin: 4,
  },
  stickerIconContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
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
