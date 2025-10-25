import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';
import { useComments } from '../../hooks/useComments';
import { Comment } from '../../types';

interface CommentsSectionProps {
  transformationId: string;
  currentUserId?: string;
  onUserPress: (userId: string) => void;
  style?: any;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  transformationId,
  currentUserId,
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

  const handleAddComment = async (text: string, parentCommentId?: string) => {
    await addComment(text, parentCommentId);
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(commentId);
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <CommentItem
      comment={item}
      currentUserId={currentUserId}
      onLike={toggleCommentLike}
      onReply={setReplyingTo}
      onDelete={handleDeleteComment}
      onUserPress={onUserPress}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No comments yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Be the first to share your thoughts!
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorText}>{error}</Text>
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
          onSubmit={handleAddComment}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          isPosting={isPosting}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Comments ({comments.length})
        </Text>
      </View>

      {error ? (
        renderError()
      ) : (
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          style={styles.commentsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refresh}
              tintColor="#007AFF"
            />
          }
          ListEmptyComponent={renderEmptyState}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={comments.length === 0 ? styles.emptyContainer : undefined}
        />
      )}

      <CommentInput
        onSubmit={handleAddComment}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
        isPosting={isPosting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    backgroundColor: '#F8F8F8',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  commentsList: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 60,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});