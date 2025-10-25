import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { FastImage } from '../common/FastImage';
import { Story, UserProfile } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STORY_SIZE = 70;
const STORY_MARGIN = 8;

interface StoriesRowProps {
  stories: Story[];
  currentUser?: UserProfile;
  onStoryPress: (story: Story, index: number) => void;
  onAddStoryPress: () => void;
  onUserPress: (userId: string) => void;
}

interface StoryItemProps {
  story?: Story;
  currentUser?: UserProfile;
  isAddStory?: boolean;
  onPress: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({
  story,
  currentUser,
  isAddStory = false,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  if (isAddStory) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={styles.storyContainer}
      >
        <Animated.View style={[styles.storyWrapper, animatedStyle]}>
          <View style={[styles.storyRing, styles.addStoryRing]}>
            <FastImage
              source={{ 
                uri: currentUser?.avatar_url || 'https://via.placeholder.com/70',
                priority: 'high'
              }}
              style={styles.storyImage}
            />
            <View style={styles.addStoryIcon}>
              <Text style={styles.addStoryIconText}>+</Text>
            </View>
          </View>
          <Text style={styles.storyLabel} numberOfLines={1}>
            Your Story
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  if (!story) return null;

  const hasNewContent = !story.is_viewed;
  const isExpired = new Date(story.expires_at) < new Date();

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={styles.storyContainer}
    >
      <Animated.View style={[styles.storyWrapper, animatedStyle]}>
        <View style={[
          styles.storyRing,
          hasNewContent && styles.newStoryRing,
          isExpired && styles.expiredStoryRing,
        ]}>
          <FastImage
            source={{ 
              uri: story.user.avatar_url || 'https://via.placeholder.com/70',
              priority: 'high'
            }}
            style={[
              styles.storyImage,
              isExpired && styles.expiredStoryImage,
            ]}
          />
          {story.user.is_verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          )}
        </View>
        <Text style={styles.storyLabel} numberOfLines={1}>
          {story.user.display_name || story.user.username}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const StoriesRow: React.FC<StoriesRowProps> = ({
  stories,
  currentUser,
  onStoryPress,
  onAddStoryPress,
  onUserPress,
}) => {
  const [showAll, setShowAll] = useState(false);

  // Filter out expired stories older than 24 hours
  const activeStories = stories.filter(story => {
    const expiryTime = new Date(story.expires_at);
    const now = new Date();
    return expiryTime > now;
  });

  // Sort stories: unviewed first, then by creation time
  const sortedStories = [...activeStories].sort((a, b) => {
    if (a.is_viewed !== b.is_viewed) {
      return a.is_viewed ? 1 : -1; // Unviewed first
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const displayStories = showAll ? sortedStories : sortedStories.slice(0, 10);

  const renderStoryItem = ({ item, index }: { item: Story; index: number }) => (
    <StoryItem
      story={item}
      onPress={() => onStoryPress(item, index)}
    />
  );

  const renderAddStory = () => (
    <StoryItem
      currentUser={currentUser}
      isAddStory={true}
      onPress={onAddStoryPress}
    />
  );

  if (activeStories.length === 0 && !currentUser) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
        data={displayStories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={currentUser ? renderAddStory : null}
        ListFooterComponent={
          !showAll && sortedStories.length > 10 ? (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAll(true)}
              activeOpacity={0.7}
            >
              <View style={styles.showMoreRing}>
                <Text style={styles.showMoreText}>+{sortedStories.length - 10}</Text>
              </View>
              <Text style={styles.showMoreLabel}>More</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  storiesContainer: {
    paddingHorizontal: 16,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: STORY_MARGIN,
    width: STORY_SIZE + 8,
  },
  storyWrapper: {
    alignItems: 'center',
  },
  storyRing: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    padding: 2,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 4,
    position: 'relative',
  },
  newStoryRing: {
    borderColor: '#FF3B30',
    borderWidth: 3,
  },
  addStoryRing: {
    borderColor: '#007AFF',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  expiredStoryRing: {
    borderColor: '#C0C0C0',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: (STORY_SIZE - 4) / 2,
  },
  expiredStoryImage: {
    opacity: 0.6,
  },
  addStoryIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addStoryIconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  verifiedIcon: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  storyLabel: {
    fontSize: 11,
    color: '#000',
    textAlign: 'center',
    maxWidth: STORY_SIZE + 8,
  },
  showMoreButton: {
    alignItems: 'center',
    marginLeft: STORY_MARGIN,
    width: STORY_SIZE + 8,
  },
  showMoreRing: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  showMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  showMoreLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});