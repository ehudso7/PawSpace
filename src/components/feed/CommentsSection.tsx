import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Comment as CommentType, UserProfile } from '@/types';
import { feedService } from '@/services/feed';

interface CommentsSectionProps {
  transformationId: string;
  comments: CommentType[];
  currentUser: UserProfile;
  onCommentAdded?: (comment: CommentType) => void;
  onCommentDeleted?: (commentId: string) => void;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  transformationId,
  comments,
  currentUser,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState(comments);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleSubmitComment = useCallback(async () => {
    if (!newComment.trim() || isSubmitting) return;

    const commentText = newComment.trim();
    setNewComment('');
    setIsSubmitting(true);

    try {
      const newCommentData = await feedService.addComment(
        transformationId,
        commentText,
        replyingTo?.id
      );

      setLocalComments(prev => [...prev, newCommentData]);
      onCommentAdded?.(newCommentData);
      setReplyingTo(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment');
      setNewComment(commentText); // Restore the comment text
    } finally {
      setIsSubmitting(false);
    }
  }, [newComment, transformationId, replyingTo, onCommentAdded, isSubmitting]);

  const handleLikeComment = useCallback(async (commentId: string) => {
    try {
      await feedService.likeComment(commentId);
      // Update local state optimistically
      setLocalComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? {
                ...comment,
                is_liked: !comment.is_liked,
                likes_count: comment.is_liked
                  ? comment.likes_count - 1
                  : comment.likes_count + 1,
              }
            : comment
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to like comment');
    }
  }, []);

  const handleDeleteComment = useCallback(async (commentId: string) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await feedService.deleteComment(commentId);
              setLocalComments(prev => prev.filter(comment => comment.id !== commentId));
              onCommentDeleted?.(commentId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete comment');
            }
          },
        },
      ]
    );
  }, [onCommentDeleted]);

  const handleReply = useCallback((comment: CommentType) => {
    setReplyingTo(comment);
    inputRef.current?.focus();
  }, []);

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

  const renderComment = ({ item: comment }: { item: CommentType }) => {
    const isOwnComment = comment.user_id === currentUser.id;
    const isReply = !!comment.parent_comment_id;

    return (
      <View style={[styles.commentContainer, isReply && styles.replyContainer]}>
        <FastImage
          source={{ uri: comment.user.avatar_url }}
          style={styles.commentAvatar}
          resizeMode={FastImage.resizeMode.cover}
        />
        
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUsername}>{comment.user.display_name}</Text>
            <Text style={styles.commentTime}>{formatTimeAgo(comment.created_at)}</Text>
          </View>
          
          <Text style={styles.commentText}>{comment.text}</Text>
          
          <View style={styles.commentActions}>
            <TouchableOpacity
              onPress={() => handleLikeComment(comment.id)}
              style={styles.commentAction}
            >
              <Icon
                name={comment.is_liked ? 'favorite' : 'favorite-border'}
                size={16}
                color={comment.is_liked ? '#ff6b6b' : '#666'}
              />
              {comment.likes_count > 0 && (
                <Text style={styles.commentActionText}>{comment.likes_count}</Text>
              )}
            </TouchableOpacity>
            
            {!isReply && (
              <TouchableOpacity
                onPress={() => handleReply(comment)}
                style={styles.commentAction}
              >
                <Text style={styles.replyText}>Reply</Text>
              </TouchableOpacity>
            )}
            
            {isOwnComment && (
              <TouchableOpacity
                onPress={() => handleDeleteComment(comment.id)}
                style={styles.commentAction}
              >
                <Icon name="delete" size={16} color="#ff6b6b" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderReplies = (parentComment: CommentType) => {
    const replies = localComments.filter(comment => comment.parent_comment_id === parentComment.id);
    
    if (replies.length === 0) return null;

    return (
      <View style={styles.repliesContainer}>
        {replies.map(reply => (
          <View key={reply.id}>
            {renderComment({ item: reply })}
          </View>
        ))}
      </View>
    );
  };

  const renderCommentWithReplies = ({ item: comment }: { item: CommentType }) => {
    if (comment.parent_comment_id) return null; // Skip replies, they'll be rendered with their parent

    return (
      <View>
        {renderComment({ item: comment })}
        {renderReplies(comment)}
      </View>
    );
  };

  const topLevelComments = localComments.filter(comment => !comment.parent_comment_id);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={topLevelComments}
        renderItem={renderCommentWithReplies}
        keyExtractor={(item) => item.id}
        style={styles.commentsList}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.inputContainer}>
        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <Text style={styles.replyingToText}>
              Replying to @{replyingTo.user.username}
            </Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.inputRow}>
          <FastImage
            source={{ uri: currentUser.avatar_url }}
            style={styles.inputAvatar}
            resizeMode={FastImage.resizeMode.cover}
          />
          
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            placeholder={replyingTo ? `Reply to @${replyingTo.user.username}...` : 'Add a comment...'}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
            editable={!isSubmitting}
          />
          
          <TouchableOpacity
            onPress={handleSubmitComment}
            disabled={!newComment.trim() || isSubmitting}
            style={[
              styles.sendButton,
              (!newComment.trim() || isSubmitting) && styles.sendButtonDisabled,
            ]}
          >
            <Icon
              name="send"
              size={20}
              color={(!newComment.trim() || isSubmitting) ? '#ccc' : '#007AFF'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  replyContainer: {
    marginLeft: 40,
    borderLeftWidth: 2,
    borderLeftColor: '#f0f0f0',
    paddingLeft: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  replyText: {
    fontSize: 12,
    color: '#666',
  },
  repliesContainer: {
    marginTop: 8,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyingToText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f8f9fa',
  },
});

export default CommentsSection;