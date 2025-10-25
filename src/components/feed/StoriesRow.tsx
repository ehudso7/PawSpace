import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StoryGroup } from '../../types/feed';

interface StoriesRowProps {
  stories: StoryGroup[];
  onStoryPress: (storyGroup: StoryGroup) => void;
  onCreateStory: () => void;
}

export const StoriesRow: React.FC<StoriesRowProps> = ({
  stories,
  onStoryPress,
  onCreateStory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {/* Create Story */}
      <TouchableOpacity style={styles.storyItem} onPress={onCreateStory}>
        <View style={styles.createStoryContainer}>
          <View style={styles.createStoryIconContainer}>
            <Ionicons name="add" size={24} color="white" />
          </View>
        </View>
        <Text style={styles.storyLabel}>Your Story</Text>
      </TouchableOpacity>

      {/* User Stories */}
      {stories.map((storyGroup) => (
        <TouchableOpacity
          key={storyGroup.user.id}
          style={styles.storyItem}
          onPress={() => onStoryPress(storyGroup)}
        >
          <View
            style={[
              styles.storyRing,
              storyGroup.has_unviewed ? styles.storyRingUnviewed : styles.storyRingViewed,
            ]}
          >
            <FastImage
              source={{ uri: storyGroup.user.avatar_url }}
              style={styles.storyAvatar}
            />
          </View>
          <Text style={styles.storyLabel} numberOfLines={1}>
            {storyGroup.user.is_provider
              ? storyGroup.user.provider_info?.business_name
              : storyGroup.user.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  container: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    width: 72,
  },
  createStoryContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  createStoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyRingUnviewed: {
    backgroundColor: '#4A90E2',
  },
  storyRingViewed: {
    backgroundColor: '#E0E0E0',
  },
  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: 'white',
  },
  storyLabel: {
    marginTop: 4,
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});

export default StoriesRow;
