import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Alert,
  Share as RNShare,
} from 'react-native';
import { Video } from 'expo-av';
import FastImage from 'react-native-fast-image';
import { Ionicons } from '@expo/vector-icons';
import { feedService } from '../../services/feed';
import { Transformation } from '../../types/feed';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TransformationCardProps {
  transformation: Transformation;
  onPress?: () => void;
  onUserPress?: (userId: string) => void;
  onServicePress?: (serviceId: string) => void;
  onBookPress?: (transformation: Transformation) => void;
  isVisible?: boolean;
}

export const TransformationCard = React.memo<TransformationCardProps>(
  ({
    transformation,
    onPress,
    onUserPress,
    onServicePress,
    onBookPress,
    isVisible = true,
  }) => {
    const [showingAfter, setShowingAfter] = useState(false);
    const [isLiked, setIsLiked] = useState(transformation.is_liked);
    const [likesCount, setLikesCount] = useState(transformation.likes_count);
    const [isSaved, setIsSaved] = useState(transformation.is_saved);
    const [isFollowing, setIsFollowing] = useState(transformation.is_following_user);
    const [captionExpanded, setCaptionExpanded] = useState(false);
    const [lastTap, setLastTap] = useState<number | null>(null);

    const likeAnimation = useRef(new Animated.Value(0)).current;
    const panX = useRef(new Animated.Value(0)).current;
    const videoRef = useRef<Video>(null);

    // Handle double tap to like
    const handleDoubleTap = useCallback(() => {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;

      if (lastTap && now - lastTap < DOUBLE_TAP_DELAY) {
        handleLike();
      } else {
        setLastTap(now);
      }
    }, [lastTap]);

    // Pan responder for swipe gesture
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > 10;
        },
        onPanResponderMove: (_, gestureState) => {
          panX.setValue(gestureState.dx);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (Math.abs(gestureState.dx) > 50) {
            // Swipe threshold
            setShowingAfter(!showingAfter);
          }
          Animated.spring(panX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      })
    ).current;

    // Like with optimistic update
    const handleLike = async () => {
      const wasLiked = isLiked;
      const prevCount = likesCount;

      // Optimistic update
      setIsLiked(!wasLiked);
      setLikesCount(wasLiked ? prevCount - 1 : prevCount + 1);

      if (!wasLiked) {
        // Animate heart
        Animated.sequence([
          Animated.timing(likeAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(likeAnimation, {
            toValue: 0,
            duration: 200,
            delay: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }

      try {
        if (wasLiked) {
          await feedService.unlikeTransformation(transformation.id);
        } else {
          await feedService.likeTransformation(transformation.id);
        }
      } catch (error) {
        // Revert on error
        setIsLiked(wasLiked);
        setLikesCount(prevCount);
        Alert.alert('Error', 'Failed to update like. Please try again.');
      }
    };

    // Save/bookmark transformation
    const handleSave = async () => {
      const wasSaved = isSaved;
      setIsSaved(!wasSaved);

      try {
        if (wasSaved) {
          await feedService.unsaveTransformation(transformation.id);
        } else {
          await feedService.saveTransformation(transformation.id);
        }
      } catch (error) {
        setIsSaved(wasSaved);
        Alert.alert('Error', 'Failed to save. Please try again.');
      }
    };

    // Follow user
    const handleFollow = async () => {
      const wasFollowing = isFollowing;
      setIsFollowing(!wasFollowing);

      try {
        if (wasFollowing) {
          await feedService.unfollowUser(transformation.user_id);
        } else {
          await feedService.followUser(transformation.user_id);
        }
      } catch (error) {
        setIsFollowing(wasFollowing);
        Alert.alert('Error', 'Failed to follow. Please try again.');
      }
    };

    // Share transformation
    const handleShare = async () => {
      try {
        await RNShare.share({
          message: `Check out this transformation: ${transformation.caption}`,
          url: transformation.after_image_url,
        });
        await feedService.shareTransformation(transformation.id);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    };

    // Show menu options
    const handleMenu = () => {
      Alert.alert('Options', '', [
        { text: 'Report', onPress: () => handleReport(), style: 'destructive' },
        { text: 'Share', onPress: handleShare },
        { text: 'Save', onPress: handleSave },
        { text: 'Cancel', style: 'cancel' },
      ]);
    };

    const handleReport = () => {
      // Navigate to report screen or show report modal
      Alert.alert(
        'Report Content',
        'Why are you reporting this?',
        [
          { text: 'Spam', onPress: () => submitReport('spam') },
          { text: 'Inappropriate', onPress: () => submitReport('inappropriate') },
          { text: 'Misleading', onPress: () => submitReport('misleading') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    };

    const submitReport = async (reason: string) => {
      try {
        await feedService.reportTransformation(transformation.id, reason);
        Alert.alert('Thank you', 'Your report has been submitted.');
      } catch (error) {
        Alert.alert('Error', 'Failed to submit report.');
      }
    };

    const likeScale = likeAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const likeOpacity = likeAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    });

    const currentImageUrl = showingAfter
      ? transformation.after_image_url
      : transformation.before_image_url;
    const currentVideoUrl = showingAfter
      ? transformation.after_video_url
      : transformation.before_video_url;

    const hasVideo = !!currentVideoUrl;

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => onUserPress?.(transformation.user_id)}
          >
            <FastImage
              source={{ uri: transformation.user.avatar_url }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.username}>
                {transformation.user.is_provider
                  ? transformation.user.provider_info?.business_name
                  : transformation.user.name}
              </Text>
              <View style={styles.serviceRow}>
                <TouchableOpacity
                  onPress={() => onServicePress?.(transformation.service_type.id)}
                >
                  <Text style={styles.serviceBadge}>
                    {transformation.service_type.name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.headerRight}>
            {!isFollowing && transformation.user.is_provider && (
              <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleMenu}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Media Content */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleDoubleTap}
          {...panResponder.panHandlers}
        >
          <View style={styles.mediaContainer}>
            {hasVideo && isVisible ? (
              <Video
                ref={videoRef}
                source={{ uri: currentVideoUrl }}
                style={styles.media}
                resizeMode="cover"
                shouldPlay={isVisible}
                isLooping
                isMuted={false}
              />
            ) : (
              <FastImage
                source={{ uri: currentImageUrl }}
                style={styles.media}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}

            {/* Before/After Indicator */}
            <View style={styles.beforeAfterIndicator}>
              <Text style={styles.beforeAfterText}>
                {showingAfter ? 'After' : 'Before'}
              </Text>
            </View>

            {/* Like Animation Overlay */}
            <Animated.View
              style={[
                styles.likeAnimationContainer,
                {
                  opacity: likeOpacity,
                  transform: [{ scale: likeScale }],
                },
              ]}
              pointerEvents="none"
            >
              <Ionicons name="heart" size={100} color="#FF6B6B" />
            </Animated.View>

            {/* Swipe Hint */}
            <View style={styles.swipeHint}>
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text style={styles.swipeHintText}>Swipe to compare</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actions}>
          <View style={styles.actionsLeft}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={28}
                color={isLiked ? '#FF6B6B' : '#333'}
              />
              <Text style={styles.actionCount}>{likesCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={onPress}>
              <Ionicons name="chatbubble-outline" size={26} color="#333" />
              <Text style={styles.actionCount}>{transformation.comments_count}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="arrow-redo-outline" size={26} color="#333" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleSave}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={26}
              color={isSaved ? '#4A90E2' : '#333'}
            />
          </TouchableOpacity>
        </View>

        {/* Caption */}
        <View style={styles.captionContainer}>
          <Text style={styles.caption} numberOfLines={captionExpanded ? undefined : 2}>
            <Text style={styles.captionUsername}>
              {transformation.user.is_provider
                ? transformation.user.provider_info?.business_name
                : transformation.user.name}
            </Text>{' '}
            {transformation.caption}
          </Text>
          {transformation.caption.length > 100 && (
            <TouchableOpacity onPress={() => setCaptionExpanded(!captionExpanded)}>
              <Text style={styles.moreText}>
                {captionExpanded ? 'less' : 'more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Timestamp */}
        <Text style={styles.timestamp}>{getTimeAgo(transformation.created_at)}</Text>

        {/* Book Service CTA */}
        {transformation.user.is_provider && (
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => onBookPress?.(transformation)}
          >
            <Text style={styles.bookButtonText}>Book This Service</Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

TransformationCard.displayName = 'TransformationCard';

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
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
    padding: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  serviceBadge: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  followButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  beforeAfterIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  beforeAfterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  likeAnimationContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -50,
    marginTop: -50,
  },
  swipeHint: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 6,
  },
  swipeHintText: {
    color: 'white',
    fontSize: 12,
    marginHorizontal: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  captionContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  caption: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  captionUsername: {
    fontWeight: '600',
  },
  moreText: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  bookButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    margin: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TransformationCard;
