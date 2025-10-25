import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
} from 'react-native';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';
import { useComments } from '../../hooks/useComments';
import { Comment, UserProfile } from '../../types';

interface CommentsProps {
  transformationId: string;
  currentUser?: UserProfile;
  onUserPress: (userId: string) => void;
  style?: any;
}

export const Comments: React.FC<CommentsProps> = ({
  transformationId,
  currentUser,
  onUserPress,
  style,
}) => {
  const {
    comments,
    isLoading,
    isPosting,
    error,
    replyingTo,
    addComment,
    deleteComment,
    toggleCommentLike,
    setReplyingTo,
    refresh,
  } = useComments({ transformationId });

  const flatListRef = useRef<FlatList>(null);

  // Scroll to bottom when new comment is added
  useEffect(() => {
    if (comments.length > 0 && !isLoading) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [comments.length, isLoading]);

  const handleSubmitComment = async (text: string, parentCommentId?: string) => {
    await addComment(text, parentCommentId);
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <CommentItem
      comment={item}
      currentUserId={currentUser?.id}
      onLike={toggleCommentLike}
      onReply={handleReply}
      onDelete={handleDeleteComment}
      onUserPress={onUserPress}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No comments yet</Text>
      <Text style={styles.emptyStateSubtext}>Be the first to comment!</Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorText}>Failed to load comments</Text>
      <Text style={styles.errorSubtext}>{error}</Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.loadingText}>Loading comments...</Text>
    </View>
  );

  if (isLoading && comments.length === 0) {
    return (
      <View style={[styles.container, style]}>
        {renderLoadingState()}
        <CommentInput
          currentUser={currentUser}
          replyingTo={replyingTo}
          isPosting={isPosting}
          onSubmit={handleSubmitComment}
          onCancelReply={handleCancelReply}
        />
      </View>
    );
  }

  if (error && comments.length === 0) {
    return (
      <View style={[styles.container, style]}>
        {renderError()}
        <CommentInput
          currentUser={currentUser}
          replyingTo={replyingTo}
          isPosting={isPosting}
          onSubmit={handleSubmitComment}
          onCancelReply={handleCancelReply}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        style={styles.commentsList}
        contentContainerStyle={styles.commentsListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor="#007AFF"
            colors={['#007AFF']}
          />
        }
        ListEmptyComponent={renderEmptyState}
        keyboardShouldPersistTaps="handled"
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />
      
      <CommentInput
        currentUser={currentUser}
        replyingTo={replyingTo}
        isPosting={isPosting}
        onSubmit={handleSubmitComment}
        onCancelReply={handleCancelReply}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
  },
});