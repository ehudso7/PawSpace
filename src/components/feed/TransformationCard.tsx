import React, { useState, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Share,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Transformation, UserProfile } from '@/types';
import { feedService } from '@/services/feed';
import { useNavigation } from '@react-navigation/native';

interface TransformationCardProps {
  transformation: Transformation;
  onLike?: (id: string, isLiked: boolean) => void;
  onSave?: (id: string, isSaved: boolean) => void;
  onComment?: (transformation: Transformation) => void;
  onUserPress?: (user: UserProfile) => void;
  onServicePress?: (serviceId: string) => void;
  onReport?: (transformation: Transformation) => void;
  onShare?: (transformation: Transformation) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 32;

const TransformationCard: React.FC<TransformationCardProps> = memo(({
  transformation,
  onLike,
  onSave,
  onComment,
  onUserPress,
  onServicePress,
  onReport,
  onShare,
}) => {
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(transformation.is_liked);
  const [likesCount, setLikesCount] = useState(transformation.likes_count);
  const [isSaved, setIsSaved] = useState(transformation.is_saved);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const translateX = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const doubleTapRef = useRef<any>(null);

  const mediaItems = [transformation.before_media, transformation.after_media];
  const currentMedia = mediaItems[currentMediaIndex];

  const handleLike = useCallback(async () => {
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    // Optimistic update
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);
    onLike?.(transformation.id, newIsLiked);

    // Animate heart
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      if (newIsLiked) {
        await feedService.likeTransformation(transformation.id);
      } else {
        await feedService.unlikeTransformation(transformation.id);
      }
    } catch (error) {
      // Revert on failure
      setIsLiked(!newIsLiked);
      setLikesCount(likesCount);
      onLike?.(transformation.id, !newIsLiked);
      Alert.alert('Error', 'Failed to update like status');
    }
  }, [isLiked, likesCount, transformation.id, onLike, heartScale]);

  const handleSave = useCallback(async () => {
    const newIsSaved = !isSaved;

    // Optimistic update
    setIsSaved(newIsSaved);
    onSave?.(transformation.id, newIsSaved);

    try {
      if (newIsSaved) {
        await feedService.saveTransformation(transformation.id);
      } else {
        await feedService.unsaveTransformation(transformation.id);
      }
    } catch (error) {
      // Revert on failure
      setIsSaved(!newIsSaved);
      onSave?.(transformation.id, !newIsSaved);
      Alert.alert('Error', 'Failed to update save status');
    }
  }, [isSaved, transformation.id, onSave]);

  const handleDoubleTap = useCallback(() => {
    if (doubleTapRef.current) {
      clearTimeout(doubleTapRef.current);
    }
    
    doubleTapRef.current = setTimeout(() => {
      handleLike();
    }, 300);
  }, [handleLike]);

  const handleSwipe = useCallback((event: any) => {
    const { translationX, state } = event.nativeEvent;
    
    if (state === State.END) {
      if (translationX > 50 && currentMediaIndex === 1) {
        // Swipe right to show before
        setCurrentMediaIndex(0);
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      } else if (translationX < -50 && currentMediaIndex === 0) {
        // Swipe left to show after
        setCurrentMediaIndex(1);
        Animated.spring(translateX, {
          toValue: -CARD_WIDTH,
          useNativeDriver: true,
        }).start();
      } else {
        // Return to current position
        Animated.spring(translateX, {
          toValue: currentMediaIndex === 0 ? 0 : -CARD_WIDTH,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [currentMediaIndex, translateX]);

  const handleMenuPress = useCallback(() => {
    Alert.alert(
      'Options',
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => onShare?.(transformation) },
        { text: 'Report', onPress: () => onReport?.(transformation), style: 'destructive' },
      ]
    );
  }, [transformation, onShare, onReport]);

  const handleFollow = useCallback(async () => {
    try {
      if (transformation.user.is_following) {
        await feedService.unfollowUser(transformation.user.id);
      } else {
        await feedService.followUser(transformation.user.id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update follow status');
    }
  }, [transformation.user]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 2592000)}mo`;
  };

  const renderMedia = () => {
    if (currentMedia.type === 'video') {
      return (
        <Video
          source={{ uri: currentMedia.url }}
          style={styles.media}
          resizeMode="cover"
          paused={!isVideoPlaying}
          onLoad={() => setIsVideoPlaying(true)}
          onError={(error) => console.log('Video error:', error)}
          repeat
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

  const renderCaption = () => {
    const lines = transformation.caption.split('\n');
    const shouldTruncate = lines.length > 2 && !isExpanded;

    return (
      <View style={styles.captionContainer}>
        <Text style={styles.captionText} numberOfLines={shouldTruncate ? 2 : undefined}>
          <Text style={styles.username}>@{transformation.user.username}</Text>
          {' '}
          {transformation.caption}
        </Text>
        {lines.length > 2 && (
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.expandText}>
              {isExpanded ? 'Show less' : 'Show more'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress?.(transformation.user)}
        >
          <FastImage
            source={{ uri: transformation.user.avatar_url }}
            style={styles.avatar}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.userDetails}>
            <Text style={styles.username}>{transformation.user.display_name}</Text>
            <View style={styles.serviceBadge}>
              <Text style={styles.serviceText}>{transformation.service.name}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {!transformation.user.is_following && (
            <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleMenuPress}>
            <Icon name="more-vert" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Media Content */}
      <PanGestureHandler onHandlerStateChange={handleSwipe}>
        <Animated.View style={styles.mediaContainer}>
          <Animated.View
            style={[
              styles.mediaWrapper,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            {mediaItems.map((media, index) => (
              <TouchableOpacity
                key={media.id}
                style={[styles.mediaItem, { left: index * CARD_WIDTH }]}
                onPress={handleDoubleTap}
                activeOpacity={1}
              >
                {renderMedia()}
                
                {/* Before/After Labels */}
                <View style={styles.mediaLabel}>
                  <Text style={styles.mediaLabelText}>
                    {index === 0 ? 'BEFORE' : 'AFTER'}
                  </Text>
                </View>

                {/* Heart Animation */}
                <Animated.View
                  style={[
                    styles.heartAnimation,
                    {
                      transform: [{ scale: heartScale }],
                    },
                  ]}
                >
                  <Icon name="favorite" size={80} color="#ff6b6b" />
                </Animated.View>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Swipe Indicator */}
          <View style={styles.swipeIndicator}>
            <View style={[styles.indicatorDot, currentMediaIndex === 0 && styles.activeDot]} />
            <View style={[styles.indicatorDot, currentMediaIndex === 1 && styles.activeDot]} />
          </View>
        </Animated.View>
      </PanGestureHandler>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Icon
              name={isLiked ? "favorite" : "favorite-border"}
              size={24}
              color={isLiked ? "#ff6b6b" : "#666"}
            />
            <Text style={styles.actionText}>{likesCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onComment?.(transformation)}
            style={styles.actionButton}
          >
            <Icon name="chat-bubble-outline" size={24} color="#666" />
            <Text style={styles.actionText}>{transformation.comments_count}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onShare?.(transformation)}
            style={styles.actionButton}
          >
            <Icon name="share" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
          <Icon
            name={isSaved ? "bookmark" : "bookmark-border"}
            size={24}
            color={isSaved ? "#ff6b6b" : "#666"}
          />
        </TouchableOpacity>
      </View>

      {/* Caption */}
      {renderCaption()}

      {/* Service Tag */}
      <TouchableOpacity
        style={styles.serviceTag}
        onPress={() => onServicePress?.(transformation.service.id)}
      >
        <Text style={styles.serviceTagText}>
          #{transformation.service.name.toLowerCase().replace(/\s+/g, '')}
        </Text>
      </TouchableOpacity>

      {/* Timestamp */}
      <Text style={styles.timestamp}>
        {formatTimeAgo(transformation.created_at)}
      </Text>

      {/* Bottom CTA */}
      <TouchableOpacity
        style={styles.ctaButton}
        onPress={() => onServicePress?.(transformation.service.id)}
      >
        <Text style={styles.ctaButtonText}>Book This Service</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
    color: '#000',
  },
  serviceBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 2,
  },
  serviceText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaContainer: {
    height: 400,
    position: 'relative',
  },
  mediaWrapper: {
    flexDirection: 'row',
    height: '100%',
  },
  mediaItem: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: '100%',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  mediaLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mediaLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  heartAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    opacity: 0.8,
  },
  swipeIndicator: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    flexDirection: 'row',
    marginLeft: -20,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  captionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  captionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
  },
  expandText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  serviceTag: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  serviceTagText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  timestamp: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    fontSize: 12,
    color: '#999',
  },
  ctaButton: {
    margin: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TransformationCard;