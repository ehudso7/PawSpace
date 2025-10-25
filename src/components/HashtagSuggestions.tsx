import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { HashtagSuggestion } from '../types/video';

interface HashtagSuggestionsProps {
  selectedHashtags: string[];
  onHashtagToggle: (tag: string) => void;
}

const defaultSuggestions: HashtagSuggestion[] = [
  { tag: '#petgrooming', category: 'grooming', popularity: 95 },
  { tag: '#doggrooming', category: 'grooming', popularity: 90 },
  { tag: '#catgrooming', category: 'grooming', popularity: 85 },
  { tag: '#pettransformation', category: 'transformation', popularity: 88 },
  { tag: '#beforeandafter', category: 'before_after', popularity: 92 },
  { tag: '#petcare', category: 'pet', popularity: 80 },
  { tag: '#petlove', category: 'pet', popularity: 85 },
  { tag: '#grooming', category: 'grooming', popularity: 75 },
  { tag: '#pets', category: 'pet', popularity: 70 },
  { tag: '#dogsofinstagram', category: 'pet', popularity: 88 },
  { tag: '#catsofinstagram', category: 'pet', popularity: 82 },
  { tag: '#petstagram', category: 'pet', popularity: 78 },
  { tag: '#petlife', category: 'pet', popularity: 72 },
  { tag: '#petphotography', category: 'pet', popularity: 68 },
  { tag: '#petvibes', category: 'trending', popularity: 65 },
];

const HashtagSuggestions: React.FC<HashtagSuggestionsProps> = ({
  selectedHashtags,
  onHashtagToggle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customHashtag, setCustomHashtag] = useState('');

  const filteredSuggestions = defaultSuggestions.filter(suggestion =>
    suggestion.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addCustomHashtag = () => {
    if (customHashtag.trim()) {
      const tag = customHashtag.startsWith('#') ? customHashtag : `#${customHashtag}`;
      onHashtagToggle(tag);
      setCustomHashtag('');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'grooming':
        return '#4CAF50';
      case 'transformation':
        return '#FF9800';
      case 'before_after':
        return '#9C27B0';
      case 'pet':
        return '#2196F3';
      case 'trending':
        return '#F44336';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hashtags</Text>
      
      {/* Selected Hashtags */}
      {selectedHashtags.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedLabel}>Selected:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedHashtags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.selectedTag}
                onPress={() => onHashtagToggle(tag)}
              >
                <Text style={styles.selectedTagText}>{tag}</Text>
                <Text style={styles.removeIcon}>×</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Custom Hashtag Input */}
      <View style={styles.customContainer}>
        <TextInput
          style={styles.customInput}
          value={customHashtag}
          onChangeText={setCustomHashtag}
          placeholder="Add custom hashtag..."
          placeholderTextColor="#999"
          onSubmitEditing={addCustomHashtag}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addCustomHashtag}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search hashtags..."
        placeholderTextColor="#999"
      />

      {/* Suggestions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestionsContainer}
      >
        {filteredSuggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.suggestionTag,
              { borderColor: getCategoryColor(suggestion.category) }
            ]}
            onPress={() => onHashtagToggle(suggestion.tag)}
          >
            <Text style={styles.suggestionText}>{suggestion.tag}</Text>
            <View style={[
              styles.popularityBar,
              { 
                width: `${suggestion.popularity}%`,
                backgroundColor: getCategoryColor(suggestion.category)
              }
            ]} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectedContainer: {
    marginBottom: 12,
  },
  selectedLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedTagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  removeIcon: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  customContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  suggestionsContainer: {
    marginBottom: 8,
  },
  suggestionTag: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: '#f9f9f9',
    position: 'relative',
    overflow: 'hidden',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  popularityBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    opacity: 0.3,
  },
});

export default HashtagSuggestions;