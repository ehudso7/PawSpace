import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Story, UserProfile } from '@/types';

interface StoriesRowProps {
  stories: Story[];
  currentUser: UserProfile;
  onStoryPress: (story: Story) => void;
  onAddStory: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const STORY_SIZE = 70;

const StoriesRow: React.FC<StoriesRowProps> = ({
  stories,
  currentUser,
  onStoryPress,
  onAddStory,
}) => {
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set());

  const handleStoryPress = useCallback((story: Story) => {
    setViewedStories(prev => new Set([...prev, story.id]));
    onStoryPress(story);
  }, [onStoryPress]);

  const renderStory = (story: Story, index: number) => {
    const hasNewContent = !viewedStories.has(story.id) && !story.is_viewed;
    
    return (
      <TouchableOpacity
        key={story.id}
        style={styles.storyContainer}
        onPress={() => handleStoryPress(story)}
      >
        <View style={[styles.storyRing, hasNewContent && styles.newStoryRing]}>
          <FastImage
            source={{ uri: story.user.avatar_url }}
            style={styles.storyAvatar}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <Text style={styles.storyUsername} numberOfLines={1}>
          {story.user.username}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Add Story Button */}
        <TouchableOpacity style={styles.storyContainer} onPress={onAddStory}>
          <View style={styles.addStoryRing}>
            <FastImage
              source={{ uri: currentUser.avatar_url }}
              style={styles.storyAvatar}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.addIcon}>
              <Icon name="add" size={20} color="#fff" />
            </View>
          </View>
          <Text style={styles.storyUsername}>Your Story</Text>
        </TouchableOpacity>

        {/* Other Stories */}
        {stories.map((story, index) => renderStory(story, index))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: STORY_SIZE + 20,
  },
  storyRing: {
    width: STORY_SIZE + 4,
    height: STORY_SIZE + 4,
    borderRadius: (STORY_SIZE + 4) / 2,
    padding: 2,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
  },
  newStoryRing: {
    backgroundColor: '#007AFF',
  },
  addStoryRing: {
    width: STORY_SIZE + 4,
    height: STORY_SIZE + 4,
    borderRadius: (STORY_SIZE + 4) / 2,
    padding: 2,
    backgroundColor: '#e0e0e0',
    marginBottom: 8,
    position: 'relative',
  },
  storyAvatar: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyUsername: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    maxWidth: STORY_SIZE + 20,
  },
});

export default StoriesRow;