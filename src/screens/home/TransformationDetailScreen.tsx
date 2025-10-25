import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video } from 'expo-av';
import FastImage from 'react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  SlideInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { feedService } from '../../services/feed';
import { Transformation, Comment } from '../../types/feed';
import CommentsSection from '../../components/feed/CommentsSection';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface TransformationDetailScreenProps {
  route: {
    params: {
      transformationId: string;
    };
  };
  navigation: any;
}

export const TransformationDetailScreen: React.FC<TransformationDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { transformationId } = route.params;

  const [transformation, setTransformation] = useState<Transformation | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showingAfter, setShowingAfter] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const videoRef = useRef<Video>(null);
  const togglePosition = useSharedValue(0);

  useEffect(() => {
    loadTransformation();
    loadComments();
  }, [transformationId]);

  useEffect(() => {
    if (transformation) {
      setIsLiked(transformation.is_liked);
      setLikesCount(transformation.likes_count);
      setIsSaved(transformation.is_saved);
    }
  }, [transformation]);

  const loadTransformation = async () => {
    try {
      const data = await feedService.getTransformation(transformationId);
      setTransformation(data);
    } catch (error) {
      console.error('Error loading transformation:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    setCommentsLoading(true);
    try {
      const data = await feedService.getComments(transformationId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLike = async () => {
    const wasLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!wasLiked);
    setLikesCount(wasLiked ? prevCount - 1 : prevCount + 1);

    try {
      if (wasLiked) {
        await feedService.unlikeTransformation(transformationId);
      } else {
        await feedService.likeTransformation(transformationId);
      }
    } catch (error) {
      setIsLiked(wasLiked);
      setLikesCount(prevCount);
    }
  };

  const handleSave = async () => {
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);

    try {
      if (wasSaved) {
        await feedService.unsaveTransformation(transformationId);
      } else {
        await feedService.saveTransformation(transformationId);
      }
    } catch (error) {
      setIsSaved(wasSaved);
    }
  };

  const handleToggleView = () => {
    setShowingAfter(!showingAfter);
    togglePosition.value = withSpring(showingAfter ? 0 : 1);
  };

  const handleCommentAdded = (comment: Comment) => {
    setComments((prev) => [comment, ...prev]);
    if (transformation) {
      setTransformation({
        ...transformation,
        comments_count: transformation.comments_count + 1,
      });
    }
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    if (transformation) {
      setTransformation({
        ...transformation,
        comments_count: transformation.comments_count - 1,
      });
    }
  };

  const toggleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: togglePosition.value * (SCREEN_WIDTH / 2 - 60) }],
    };
  });

  if (loading || !transformation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  const currentImageUrl = showingAfter
    ? transformation.after_image_url
    : transformation.before_image_url;
  const currentVideoUrl = showingAfter
    ? transformation.after_video_url
    : transformation.before_video_url;

  const hasVideo = !!currentVideoUrl;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transformation</Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? '#4A90E2' : '#333'}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Info */}
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => navigation.navigate('Profile', { userId: transformation.user_id })}
          >
            <FastImage
              source={{ uri: transformation.user.avatar_url }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={styles.username}>
                {transformation.user.is_provider
                  ? transformation.user.provider_info?.business_name
                  : transformation.user.name}
              </Text>
              <Text style={styles.serviceType}>
                {transformation.service_type.name}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Before/After Toggle */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleTrack}>
              <Animated.View style={[styles.toggleThumb, toggleAnimatedStyle]} />
            </View>
            <View style={styles.toggleLabels}>
              <TouchableOpacity
                style={styles.toggleLabel}
                onPress={() => {
                  setShowingAfter(false);
                  togglePosition.value = withSpring(0);
                }}
              >
                <Text
                  style={[
                    styles.toggleLabelText,
                    !showingAfter && styles.toggleLabelTextActive,
                  ]}
                >
                  Before
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggleLabel}
                onPress={() => {
                  setShowingAfter(true);
                  togglePosition.value = withSpring(1);
                }}
              >
                <Text
                  style={[
                    styles.toggleLabelText,
                    showingAfter && styles.toggleLabelTextActive,
                  ]}
                >
                  After
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Media */}
          <Animated.View entering={FadeIn} style={styles.mediaContainer}>
            {hasVideo ? (
              <Video
                ref={videoRef}
                source={{ uri: currentVideoUrl }}
                style={styles.media}
                resizeMode="cover"
                shouldPlay
                isLooping
                useNativeControls
              />
            ) : (
              <FastImage
                source={{ uri: currentImageUrl }}
                style={styles.media}
                resizeMode={FastImage.resizeMode.cover}
              />
            )}
          </Animated.View>

          {/* Actions */}
          <View style={styles.actions}>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={32}
                  color={isLiked ? '#FF6B6B' : '#333'}
                />
                <Text style={styles.actionText}>{likesCount}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={28} color="#333" />
                <Text style={styles.actionText}>{comments.length}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="arrow-redo-outline" size={28} color="#333" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Caption */}
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>{transformation.caption}</Text>
            <Text style={styles.timestamp}>
              {new Date(transformation.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Book Service CTA */}
          {transformation.user.is_provider && (
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() =>
                navigation.navigate('ServiceBooking', {
                  providerId: transformation.user_id,
                  serviceId: transformation.service_type.id,
                })
              }
            >
              <Text style={styles.bookButtonText}>Book This Service</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          )}

          {/* Comments Section */}
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>
              Comments ({comments.length})
            </Text>
          </View>

          {commentsLoading ? (
            <ActivityIndicator size="large" color="#4A90E2" style={styles.commentsLoader} />
          ) : (
            <CommentsSection
              comments={comments}
              transformationId={transformationId}
              onCommentAdded={handleCommentAdded}
              onCommentDeleted={handleCommentDeleted}
              navigation={navigation}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  serviceType: {
    fontSize: 14,
    color: '#4A90E2',
    marginTop: 2,
  },
  toggleContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  toggleTrack: {
    height: 40,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    position: 'relative',
    marginBottom: 8,
  },
  toggleThumb: {
    position: 'absolute',
    width: SCREEN_WIDTH / 2 - 24,
    height: 36,
    backgroundColor: '#4A90E2',
    borderRadius: 18,
    top: 2,
    left: 2,
  },
  toggleLabels: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  toggleLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleLabelTextActive: {
    color: 'white',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#000',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  actions: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  captionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  caption: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4A90E2',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  commentsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  commentsLoader: {
    paddingVertical: 40,
  },
});

export default TransformationDetailScreen;
