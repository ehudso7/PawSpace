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
import { Sticker } from '../../types';
import { STICKERS } from '../../utils/constants';

interface StickerPickerProps {
  onStickerSelect: (sticker: Sticker) => void;
  onClose: () => void;
}


const StickerPicker: React.FC<StickerPickerProps> = ({ onStickerSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'animals', name: 'Animals', icon: 'paw-outline' },
    { id: 'hearts', name: 'Hearts', icon: 'heart-outline' },
    { id: 'stars', name: 'Stars', icon: 'star-outline' },
    { id: 'nature', name: 'Nature', icon: 'leaf-outline' },
  ];

  const filteredStickers = STICKERS.filter(sticker => {
    const matchesSearch = sticker.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'animals' && ['Dog', 'Cat', 'Bird', 'Butterfly'].includes(sticker.name)) ||
      (selectedCategory === 'hearts' && sticker.name === 'Heart') ||
      (selectedCategory === 'stars' && ['Star', 'Sparkles'].includes(sticker.name)) ||
      (selectedCategory === 'nature' && ['Flower', 'Leaf', 'Sun', 'Moon', 'Rainbow'].includes(sticker.name));
    
    return matchesSearch && matchesCategory;
  });

  const handleStickerPress = (sticker: typeof STICKERS[0]) => {
    const newSticker: Sticker = {
      id: Math.random().toString(36).substr(2, 9),
      uri: sticker.uri,
      position: { x: 100, y: 100 }, // Default position
      scale: 1,
      rotation: 0,
    };
    onStickerSelect(newSticker);
  };

  const renderSticker = ({ item }: { item: typeof STICKERS[0] }) => (
    <TouchableOpacity
      style={styles.stickerItem}
      onPress={() => handleStickerPress(item)}
    >
      <Image source={{ uri: item.uri }} style={styles.stickerImage} />
      <Text style={styles.stickerName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderCategory = (category: typeof categories[0]) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryButton,
        selectedCategory === category.id && styles.categoryButtonSelected,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Ionicons
        name={category.icon as any}
        size={20}
        color={selectedCategory === category.id ? '#FFFFFF' : '#8E8E93'}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category.id && styles.categoryTextSelected,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Add Sticker</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search stickers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategory)}
      </ScrollView>

      {/* Stickers Grid */}
      <FlatList
        data={filteredStickers}
        renderItem={renderSticker}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={styles.stickersGrid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1C1C1E',
    paddingVertical: 12,
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F2F2F7',
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginLeft: 6,
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  stickersGrid: {
    padding: 20,
  },
  stickerItem: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stickerImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  stickerName: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default StickerPicker;