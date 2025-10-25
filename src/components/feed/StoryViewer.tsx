import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Story, UserProfile } from '@/types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  currentUser: UserProfile;
  onClose: () => void;
  onStoryComplete: (storyId: string) => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  currentUser,
  onClose,
  onStoryComplete,
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[currentStoryIndex];
  const currentMedia = currentStory?.media[currentMediaIndex];

  useEffect(() => {
    if (currentStory && !isPaused) {
      startProgress();
    } else {
      stopProgress();
    }

    return () => stopProgress();
  }, [currentStory, currentMediaIndex, isPaused]);

  const startProgress = useCallback(() => {
    const duration = currentMedia?.type === 'video' ? (currentMedia.duration || 5000) : 5000;
    
    progressAnim.setValue(0);
    setProgress(0);

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 100;
        if (newProgress >= duration) {
          nextMedia();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
  }, [currentMedia, progressAnim]);

  const stopProgress = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const nextMedia = useCallback(() => {
    if (currentMediaIndex < currentStory.media.length - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    } else {
      nextStory();
    }
  }, [currentMediaIndex, currentStory, currentStoryIndex]);

  const nextStory = useCallback(() => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentMediaIndex(0);
    } else {
      onClose();
    }
  }, [currentStoryIndex, stories.length, onClose]);

  const previousStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentMediaIndex(0);
    }
  }, [currentStoryIndex]);

  const handleTap = useCallback((event: any) => {
    const { locationX } = event.nativeEvent;
    const screenCenter = screenWidth / 2;

    if (locationX < screenCenter) {
      previousStory();
    } else {
      nextMedia();
    }
  }, [previousStory, nextMedia]);

  const handleLongPress = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleLongPressEnd = useCallback(() => {
    setIsPaused(false);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const renderProgressBars = () => (
    <View style={styles.progressContainer}>
      {currentStory.media.map((_, index) => (
        <View key={index} style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: index === currentMediaIndex
                  ? progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    })
                  : index < currentMediaIndex
                  ? '100%'
                  : '0%',
              },
            ]}
          />
        </View>
      ))}
    </View>
  );

  const renderMedia = () => {
    if (!currentMedia) return null;

    if (currentMedia.type === 'video') {
      return (
        <Video
          source={{ uri: currentMedia.url }}
          style={styles.media}
          resizeMode="cover"
          paused={isPaused || !isVideoPlaying}
          onLoad={() => setIsVideoPlaying(true)}
          onEnd={() => nextMedia()}
          repeat={false}
          muted
        />
      );
    }

    return (
      <FastImage
        source={{ uri: currentMedia.url }}
        style={styles.media}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <FastImage
          source={{ uri: currentStory.user.avatar_url }}
          style={styles.avatar}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.userDetails}>
          <Text style={styles.username}>{currentStory.user.display_name}</Text>
          <Text style={styles.timestamp}>{formatTimeAgo(currentStory.created_at)}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="close" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (!currentStory) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Story not found</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onClose}>
            <Text style={styles.retryButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {renderProgressBars()}
      {renderHeader()}
      
      <TouchableOpacity
        style={styles.mediaContainer}
        onPress={handleTap}
        onLongPress={handleLongPress}
        onPressOut={handleLongPressEnd}
        activeOpacity={1}
      >
        {renderMedia()}
      </TouchableOpacity>
      
      {/* Pause Indicator */}
      {isPaused && (
        <View style={styles.pauseIndicator}>
          <Icon name="pause" size={48} color="#fff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  progressContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    zIndex: 10,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 2,
    borderRadius: 1,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  header: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaContainer: {
    flex: 1,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  pauseIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -24,
    marginLeft: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StoryViewer;