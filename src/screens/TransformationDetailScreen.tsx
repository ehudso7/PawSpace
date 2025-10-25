import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BeforeAfterMedia } from '../components/feed/BeforeAfterMedia';
import { CommentsSection } from '../components/feed/CommentsSection';
import { FastImage } from '../components/common/FastImage';
import { feedService } from '../services/feed';
import { 
  Transformation, 
  TransformationDetailParams, 
  FeedNavigationProps,
  UserProfile 
} from '../types';

interface TransformationDetailScreenProps {
  route: {
    params: TransformationDetailParams;
  };
  navigation: FeedNavigationProps;
  currentUser?: UserProfile;
}

export const TransformationDetailScreen: React.FC<TransformationDetailScreenProps> = ({
  route,
  navigation,
  currentUser,
}) => {
  const { transformationId, transformation: initialTransformation } = route.params;
  
  const [transformation, setTransformation] = useState<Transformation | null>(
    initialTransformation || null
  );
  const [isLoading, setIsLoading] = useState(!initialTransformation);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (transformation) {
      setIsLiked(transformation.is_liked);
      setIsSaved(transformation.is_saved);
      setIsFollowing(transformation.is_following_user);
      setLikesCount(transformation.likes_count);
    }
  }, [transformation]);

  const loadTransformation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await feedService.getTransformation(transformationId);
      setTransformation(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load transformation');
    } finally {
      setIsLoading(false);
    }
  }, [transformationId]);

  useEffect(() => {
    if (!initialTransformation) {
      loadTransformation();
    }
  }, [loadTransformation, initialTransformation]);

  const handleLike = useCallback(async () => {
    if (!transformation) return;

    const wasLiked = isLiked;
    const newLikesCount = wasLiked ? likesCount - 1 : likesCount + 1;

    // Optimistic update
    setIsLiked(!wasLiked);
    setLikesCount(newLikesCount);

    try {
      if (wasLiked) {
        await feedService.unlikeTransformation(transformation.id);
      } else {
        await feedService.likeTransformation(transformation.id);
      }
    } catch (error) {
      // Revert on failure
      setIsLiked(wasLiked);
      setLikesCount(likesCount);
      console.error('Failed to toggle like:', error);
    }
  }, [transformation, isLiked, likesCount]);

  const handleSave = useCallback(async () => {
    if (!transformation) return;

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
      console.error('Failed to toggle save:', error);
    }
  }, [transformation, isSaved]);

  const handleFollow = useCallback(async () => {
    if (!transformation) return;

    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);

    try {
      if (wasFollowing) {
        await feedService.unfollowUser(transformation.user.id);
      } else {
        await feedService.followUser(transformation.user.id);
      }
    } catch (error) {
      setIsFollowing(wasFollowing);
      console.error('Failed to toggle follow:', error);
    }
  }, [transformation, isFollowing]);

  const handleShare = useCallback(async () => {
    if (!transformation) return;

    try {
      await Share.share({
        message: `Check out this amazing transformation! ${transformation.caption}`,
        url: `https://pawspace.com/transformations/${transformation.id}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [transformation]);

  const handleUserPress = useCallback((userId: string) => {
    navigation.navigate('Profile', { userId });
  }, [navigation]);

  const handleBookService = useCallback(() => {
    if (!transformation?.provider) return;
    
    navigation.navigate('Booking', {
      providerId: transformation.provider.id,
      serviceTypeId: transformation.service_type.id,
      transformationId: transformation.id,
    });
  }, [transformation, navigation]);

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
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transformation</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !transformation) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transformation</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error || 'Transformation not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadTransformation}
            activeOpacity={0.8}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transformation</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => handleUserPress(transformation.user.id)}
            activeOpacity={0.7}
          >
            <FastImage
              source={{
                uri: transformation.user.avatar_url || 'https://via.placeholder.com/50',
                priority: 'high'
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
              <Text style={styles.serviceType}>
                {transformation.service_type.name}
              </Text>
              <Text style={styles.timestamp}>
                {formatTimeAgo(transformation.created_at)}
              </Text>
            </View>
          </TouchableOpacity>

          {!isFollowing && transformation.user.id !== currentUser?.id && (
            <TouchableOpacity
              style={styles.followButton}
              onPress={handleFollow}
              activeOpacity={0.8}
            >
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Media */}
        <BeforeAfterMedia
          beforeMedia={transformation.before_media}
          afterMedia={transformation.after_media}
          isVisible={true}
          onDoubleTap={handleLike}
          style={styles.media}
        />

        {/* Actions */}
        <View style={styles.actions}>
          <View style={styles.leftActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.actionIcon,
                isLiked && styles.likedIcon
              ]}>
                {isLiked ? '❤️' : '🤍'}
              </Text>
              <Text style={styles.actionCount}>
                {formatNumber(likesCount)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionCount}>
                {formatNumber(transformation.comments_count)}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.actionIcon,
              isSaved && styles.savedIcon
            ]}>
              {isSaved ? '🔖' : '📑'}
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
              {transformation.caption}
            </Text>
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

        {/* Book Service CTA */}
        {transformation.provider && transformation.booking_url && (
          <TouchableOpacity
            style={styles.bookingCTA}
            onPress={handleBookService}
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

        {/* Comments */}
        <View style={styles.commentsContainer}>
          <CommentsSection
            transformationId={transformation.id}
            currentUserId={currentUser?.id}
            onUserPress={handleUserPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  verifiedIcon: {
    fontSize: 16,
    color: '#1DA1F2',
    marginLeft: 4,
  },
  serviceType: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  media: {
    aspectRatio: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionIcon: {
    fontSize: 28,
    marginRight: 6,
  },
  likedIcon: {
    color: '#FF3B30',
  },
  savedIcon: {
    color: '#FF9500',
  },
  actionCount: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  captionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  caption: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
  },
  captionUsername: {
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tag: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 12,
    marginBottom: 6,
  },
  bookingCTA: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookingCTAText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bookingCTASubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  commentsContainer: {
    flex: 1,
    minHeight: 400,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
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