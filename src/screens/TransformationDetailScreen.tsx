import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

import CommentsSection from '@/components/feed/CommentsSection';
import { Transformation, Comment, UserProfile } from '@/types';
import { feedService } from '@/services/feed';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface RouteParams {
  transformation: Transformation;
}

const TransformationDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { transformation: initialTransformation } = route.params as RouteParams;

  const [transformation, setTransformation] = useState<Transformation>(initialTransformation);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadTransformationDetails();
    loadComments();
    loadCurrentUser();
  }, []);

  const loadTransformationDetails = async () => {
    try {
      setLoading(true);
      const details = await feedService.getTransformation(transformation.id);
      setTransformation(details);
    } catch (error) {
      Alert.alert('Error', 'Failed to load transformation details');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await feedService.getComments(transformation.id);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const loadCurrentUser = async () => {
    // This would come from your auth service
    setCurrentUser({
      id: 'current-user-id',
      username: 'currentuser',
      display_name: 'Current User',
      avatar_url: 'https://via.placeholder.com/150',
      bio: 'Bio here',
      followers_count: 100,
      following_count: 50,
      is_following: false,
      is_verified: false,
      created_at: new Date().toISOString(),
    });
  };

  const handleLike = useCallback(async () => {
    const newIsLiked = !transformation.is_liked;
    const newLikesCount = newIsLiked ? transformation.likes_count + 1 : transformation.likes_count - 1;

    // Optimistic update
    setTransformation(prev => ({
      ...prev,
      is_liked: newIsLiked,
      likes_count: newLikesCount,
    }));

    try {
      if (newIsLiked) {
        await feedService.likeTransformation(transformation.id);
      } else {
        await feedService.unlikeTransformation(transformation.id);
      }
    } catch (error) {
      // Revert on failure
      setTransformation(prev => ({
        ...prev,
        is_liked: !newIsLiked,
        likes_count: transformation.likes_count,
      }));
      Alert.alert('Error', 'Failed to update like status');
    }
  }, [transformation]);

  const handleSave = useCallback(async () => {
    const newIsSaved = !transformation.is_saved;

    // Optimistic update
    setTransformation(prev => ({
      ...prev,
      is_saved: newIsSaved,
    }));

    try {
      if (newIsSaved) {
        await feedService.saveTransformation(transformation.id);
      } else {
        await feedService.unsaveTransformation(transformation.id);
      }
    } catch (error) {
      // Revert on failure
      setTransformation(prev => ({
        ...prev,
        is_saved: !newIsSaved,
      }));
      Alert.alert('Error', 'Failed to update save status');
    }
  }, [transformation]);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out this amazing transformation! ${transformation.caption}`,
        url: `https://app.com/transformation/${transformation.id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share content');
    }
  }, [transformation]);

  const handleFollow = useCallback(async () => {
    try {
      if (transformation.user.is_following) {
        await feedService.unfollowUser(transformation.user.id);
      } else {
        await feedService.followUser(transformation.user.id);
      }
      
      setTransformation(prev => ({
        ...prev,
        user: {
          ...prev.user,
          is_following: !prev.user.is_following,
        },
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to update follow status');
    }
  }, [transformation.user]);

  const handleCommentAdded = useCallback((comment: Comment) => {
    setComments(prev => [...prev, comment]);
    setTransformation(prev => ({
      ...prev,
      comments_count: prev.comments_count + 1,
    }));
  }, []);

  const handleCommentDeleted = useCallback((commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
    setTransformation(prev => ({
      ...prev,
      comments_count: prev.comments_count - 1,
    }));
  }, []);

  const handleMediaSwipe = useCallback((direction: 'left' | 'right') => {
    const mediaItems = [transformation.before_media, transformation.after_media];
    
    if (direction === 'left' && currentMediaIndex === 0) {
      setCurrentMediaIndex(1);
    } else if (direction === 'right' && currentMediaIndex === 1) {
      setCurrentMediaIndex(0);
    }
  }, [currentMediaIndex, transformation]);

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

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Icon name="share" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Icon
            name={transformation.is_saved ? "bookmark" : "bookmark-border"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMedia = () => {
    const mediaItems = [transformation.before_media, transformation.after_media];
    const currentMedia = mediaItems[currentMediaIndex];

    return (
      <View style={styles.mediaContainer}>
        <TouchableOpacity
          style={styles.mediaWrapper}
          onPress={() => setCurrentMediaIndex(currentMediaIndex === 0 ? 1 : 0)}
          activeOpacity={1}
        >
          {currentMedia.type === 'video' ? (
            <Video
              source={{ uri: currentMedia.url }}
              style={styles.media}
              resizeMode="cover"
              paused={!isVideoPlaying}
              onLoad={() => setIsVideoPlaying(true)}
              repeat
              muted
            />
          ) : (
            <FastImage
              source={{ uri: currentMedia.url }}
              style={styles.media}
              resizeMode={FastImage.resizeMode.cover}
            />
          )}
          
          {/* Media Label */}
          <View style={styles.mediaLabel}>
            <Text style={styles.mediaLabelText}>
              {currentMediaIndex === 0 ? 'BEFORE' : 'AFTER'}
            </Text>
          </View>
          
          {/* Swipe Indicator */}
          <View style={styles.swipeIndicator}>
            <View style={[styles.indicatorDot, currentMediaIndex === 0 && styles.activeDot]} />
            <View style={[styles.indicatorDot, currentMediaIndex === 1 && styles.activeDot]} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderUserInfo = () => (
    <View style={styles.userInfo}>
      <FastImage
        source={{ uri: transformation.user.avatar_url }}
        style={styles.userAvatar}
        resizeMode={FastImage.resizeMode.cover}
      />
      
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{transformation.user.display_name}</Text>
        <Text style={styles.serviceName}>{transformation.service.name}</Text>
        <Text style={styles.timestamp}>{formatTimeAgo(transformation.created_at)}</Text>
      </View>
      
      <TouchableOpacity
        style={[
          styles.followButton,
          transformation.user.is_following && styles.followingButton,
        ]}
        onPress={handleFollow}
      >
        <Text
          style={[
            styles.followButtonText,
            transformation.user.is_following && styles.followingButtonText,
          ]}
        >
          {transformation.user.is_following ? 'Following' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actions}>
      <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
        <Icon
          name={transformation.is_liked ? "favorite" : "favorite-border"}
          size={28}
          color={transformation.is_liked ? "#ff6b6b" : "#fff"}
        />
        <Text style={styles.actionText}>{transformation.likes_count}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => setShowComments(!showComments)}
      >
        <Icon name="chat-bubble-outline" size={28} color="#fff" />
        <Text style={styles.actionText}>{transformation.comments_count}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
        <Icon name="share" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderCaption = () => (
    <View style={styles.captionContainer}>
      <Text style={styles.captionText}>
        <Text style={styles.captionUsername}>@{transformation.user.username}</Text>
        {' '}
        {transformation.caption}
      </Text>
      
      {transformation.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {transformation.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  const renderBookingCTA = () => (
    <TouchableOpacity style={styles.bookingButton}>
      <Text style={styles.bookingButtonText}>Book This Service</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {renderHeader()}
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderMedia()}
        
        <View style={styles.content}>
          {renderUserInfo()}
          {renderCaption()}
          {renderBookingCTA()}
        </View>
      </ScrollView>
      
      {renderActions()}
      
      {showComments && currentUser && (
        <View style={styles.commentsContainer}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <TouchableOpacity onPress={() => setShowComments(false)}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <CommentsSection
            transformationId={transformation.id}
            comments={comments}
            currentUser={currentUser}
            onCommentAdded={handleCommentAdded}
            onCommentDeleted={handleCommentDeleted}
          />
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  scrollView: {
    flex: 1,
  },
  mediaContainer: {
    height: screenHeight * 0.6,
    position: 'relative',
  },
  mediaWrapper: {
    flex: 1,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  mediaLabel: {
    position: 'absolute',
    top: 20,
    left: 20,
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
  swipeIndicator: {
    position: 'absolute',
    bottom: 20,
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
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: screenHeight * 0.4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  serviceName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  followingButton: {
    backgroundColor: '#f0f0f0',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#666',
  },
  actions: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  captionContainer: {
    marginBottom: 16,
  },
  captionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000',
  },
  captionUsername: {
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 8,
    marginBottom: 4,
  },
  bookingButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  bookingButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  commentsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.6,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});

export default TransformationDetailScreen;