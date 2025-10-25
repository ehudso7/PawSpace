import React, { useState, useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Share,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { FastImage } from '../common/FastImage';
import { BeforeAfterMedia } from './BeforeAfterMedia';
import { Transformation, FeedNavigationProps } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TransformationCardProps {
  transformation: Transformation;
  isVisible: boolean;
  onLike: (transformationId: string) => void;
  onSave: (transformationId: string) => void;
  onFollow: (userId: string) => void;
  onComment: (transformationId: string) => void;
  onShare: (transformation: Transformation) => void;
  onUserPress: (userId: string) => void;
  onServicePress: (serviceId: string, providerId?: string) => void;
  onMenuPress: (transformation: Transformation) => void;
  navigation: FeedNavigationProps;
}

export const TransformationCard: React.FC<TransformationCardProps> = memo(({
  transformation,
  isVisible,
  onLike,
  onSave,
  onFollow,
  onComment,
  onShare,
  onUserPress,
  onServicePress,
  onMenuPress,
  navigation,
}) => {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const likeScale = useSharedValue(1);
  const likeOpacity = useSharedValue(0);
  const heartScale = useSharedValue(1);

  const handleDoubleTap = () => {
    if (!transformation.is_liked) {
      triggerLikeAnimation();
      onLike(transformation.id);
    }
  };

  const triggerLikeAnimation = () => {
    setIsLikeAnimating(true);
    
    // Heart animation
    likeOpacity.value = withSequence(
      withSpring(1, { duration: 200 }),
      withSpring(0, { duration: 300 }, () => {
        runOnJS(setIsLikeAnimating)(false);
      })
    );
    
    likeScale.value = withSequence(
      withSpring(1.5, { duration: 200 }),
      withSpring(1, { duration: 300 })
    );

    // Button animation
    heartScale.value = withSequence(
      withSpring(1.3, { duration: 150 }),
      withSpring(1, { duration: 150 })
    );
  };

  const handleLikePress = () => {
    if (!transformation.is_liked) {
      triggerLikeAnimation();
    }
    onLike(transformation.id);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing transformation! ${transformation.caption}`,
        url: `https://pawspace.com/transformations/${transformation.id}`,
      });
      onShare(transformation);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Options',
      '',
      [
        { text: 'Report', onPress: () => onMenuPress(transformation), style: 'destructive' },
        { text: 'Share', onPress: handleShare },
        { text: 'Save', onPress: () => onSave(transformation.id) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return `${Math.floor(diffInSeconds / 604800)}w`;
  };

  const shouldTruncateCaption = transformation.caption.length > 100;
  const displayCaption = showFullCaption || !shouldTruncateCaption
    ? transformation.caption
    : `${transformation.caption.substring(0, 100)}...`;

  const likeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: likeScale.value }],
      opacity: likeOpacity.value,
    };
  });

  const heartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => onUserPress(transformation.user.id)}
          activeOpacity={0.7}
        >
          <FastImage
            source={{ 
              uri: transformation.user.avatar_url || 'https://via.placeholder.com/40',
              priority: 'normal'
            }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.username}>
                {transformation.user.display_name || transformation.user.username}
              </Text>
              {transformation.user.is_verified && (
                <Text style={styles.verifiedIcon}>✓</Text>
              )}
            </View>
            <View style={styles.serviceRow}>
              <TouchableOpacity
                onPress={() => onServicePress(
                  transformation.service_type.id,
                  transformation.provider?.id
                )}
                activeOpacity={0.7}
              >
                <Text style={styles.serviceTag}>
                  {transformation.service_type.name}
                </Text>
              </TouchableOpacity>
              {transformation.location && (
                <Text style={styles.location}>• {transformation.location.name}</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          {!transformation.is_following_user && (
            <TouchableOpacity
              style={styles.followButton}
              onPress={() => onFollow(transformation.user.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <Text style={styles.menuIcon}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Media Content */}
      <View style={styles.mediaContainer}>
        <BeforeAfterMedia
          beforeMedia={transformation.before_media}
          afterMedia={transformation.after_media}
          isVisible={isVisible}
          onDoubleTap={handleDoubleTap}
          style={styles.media}
        />

        {/* Like Animation Overlay */}
        {isLikeAnimating && (
          <Animated.View style={[styles.likeAnimationOverlay, likeAnimatedStyle]}>
            <Text style={styles.likeAnimationHeart}>❤️</Text>
          </Animated.View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <Animated.View style={heartAnimatedStyle}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLikePress}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.actionIcon,
                transformation.is_liked && styles.likedIcon
              ]}>
                {transformation.is_liked ? '❤️' : '🤍'}
              </Text>
              <Text style={styles.actionCount}>
                {formatNumber(transformation.likes_count)}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment(transformation.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>
              {formatNumber(transformation.comments_count)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>📤</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onSave(transformation.id)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.actionIcon,
            transformation.is_saved && styles.savedIcon
          ]}>
            {transformation.is_saved ? '🔖' : '📑'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Caption */}
      {transformation.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>
            <Text style={styles.captionUsername}>
              {transformation.user.username}
            </Text>
            {' '}
            {displayCaption}
          </Text>
          {shouldTruncateCaption && (
            <TouchableOpacity
              onPress={() => setShowFullCaption(!showFullCaption)}
              activeOpacity={0.7}
            >
              <Text style={styles.showMoreText}>
                {showFullCaption ? 'Show less' : 'Show more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Tags */}
      {transformation.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {transformation.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      )}

      {/* Timestamp */}
      <Text style={styles.timestamp}>
        {formatTimeAgo(transformation.created_at)}
      </Text>

      {/* Book Service CTA */}
      {transformation.provider && transformation.booking_url && (
        <TouchableOpacity
          style={styles.bookingCTA}
          onPress={() => onServicePress(
            transformation.service_type.id,
            transformation.provider?.id
          )}
          activeOpacity={0.8}
        >
          <Text style={styles.bookingCTAText}>
            Book This Service
          </Text>
          <Text style={styles.bookingCTASubtext}>
            with {transformation.provider.display_name}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  verifiedIcon: {
    fontSize: 14,
    color: '#1DA1F2',
    marginLeft: 4,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  serviceTag: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
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
    fontSize: 12,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 16,
    color: '#666',
    transform: [{ rotate: '90deg' }],
  },
  mediaContainer: {
    position: 'relative',
  },
  media: {
    width: SCREEN_WIDTH,
    aspectRatio: 1,
  },
  likeAnimationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  likeAnimationHeart: {
    fontSize: 80,
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
  actionIcon: {
    fontSize: 24,
    marginRight: 4,
  },
  likedIcon: {
    color: '#FF3B30',
  },
  savedIcon: {
    color: '#FF9500',
  },
  actionCount: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  captionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  caption: {
    fontSize: 14,
    lineHeight: 18,
    color: '#000',
  },
  captionUsername: {
    fontWeight: '600',
  },
  showMoreText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tag: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 8,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  bookingCTA: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookingCTAText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingCTASubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
});