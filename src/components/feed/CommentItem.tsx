import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FastImage } from '../common/FastImage';
import { Comment, UserProfile } from '../../types';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  isReply?: boolean;
  onLike: (commentId: string) => void;
  onReply: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  onUserPress: (userId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  isReply = false,
  onLike,
  onReply,
  onDelete,
  onUserPress,
}) => {
  const [showReplies, setShowReplies] = useState(true);

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

  const formatLikesCount = (count: number): string => {
    if (count === 0) return '';
    if (count === 1) return '1 like';
    if (count < 1000) return `${count} likes`;
    return `${(count / 1000).toFixed(1)}K likes`;
  };

  const handleLongPress = () => {
    const isOwnComment = comment.user_id === currentUserId;
    
    const options = [
      { text: 'Reply', onPress: () => onReply(comment) },
      { text: 'Report', onPress: () => {}, style: 'destructive' as const },
    ];

    if (isOwnComment) {
      options.splice(1, 0, { 
        text: 'Delete', 
        onPress: () => onDelete(comment.id), 
        style: 'destructive' as const 
      });
    }

    options.push({ text: 'Cancel', style: 'cancel' as const });

    Alert.alert('Comment Options', '', options);
  };

  const renderMentions = (text: string) => {
    // Simple mention parsing - in a real app, you'd use a more sophisticated parser
    const mentionRegex = /@(\w+)/g;
    const parts = text.split(mentionRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a mention
        const mentionedUser = comment.mentions.find(user => 
          user.username.toLowerCase() === part.toLowerCase()
        );
        
        return (
          <Text
            key={index}
            style={styles.mention}
            onPress={() => mentionedUser && onUserPress(mentionedUser.id)}
          >
            @{part}
          </Text>
        );
      }
      return part;
    });
  };

  return (
    <View style={[styles.container, isReply && styles.replyContainer]}>
      <TouchableOpacity
        onPress={() => onUserPress(comment.user.id)}
        activeOpacity={0.7}
      >
        <FastImage
          source={{ 
            uri: comment.user.avatar_url || 'https://via.placeholder.com/32',
            priority: 'normal'
          }}
          style={[styles.avatar, isReply && styles.replyAvatar]}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <TouchableOpacity
          onLongPress={handleLongPress}
          activeOpacity={0.9}
        >
          <View style={styles.commentBubble}>
            <TouchableOpacity
              onPress={() => onUserPress(comment.user.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.username}>
                {comment.user.display_name || comment.user.username}
                {comment.user.is_verified && (
                  <Text style={styles.verifiedIcon}> ✓</Text>
                )}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.commentText}>
              {renderMentions(comment.text)}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <Text style={styles.timestamp}>
            {formatTimeAgo(comment.created_at)}
          </Text>
          
          {comment.likes_count > 0 && (
            <Text style={styles.likesCount}>
              {formatLikesCount(comment.likes_count)}
            </Text>
          )}
          
          {!isReply && (
            <TouchableOpacity
              onPress={() => onReply(comment)}
              activeOpacity={0.7}
            >
              <Text style={styles.replyButton}>Reply</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            onPress={() => onLike(comment.id)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.likeButton,
              comment.is_liked && styles.likedButton
            ]}>
              {comment.is_liked ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Replies */}
        {!isReply && comment.replies && comment.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {comment.replies.length > 3 && !showReplies && (
              <TouchableOpacity
                onPress={() => setShowReplies(true)}
                style={styles.showRepliesButton}
                activeOpacity={0.7}
              >
                <View style={styles.replyLine} />
                <Text style={styles.showRepliesText}>
                  View {comment.replies.length} replies
                </Text>
              </TouchableOpacity>
            )}
            
            {(showReplies ? comment.replies : comment.replies.slice(0, 3)).map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                isReply={true}
                onLike={onLike}
                onReply={onReply}
                onDelete={onDelete}
                onUserPress={onUserPress}
              />
            ))}
            
            {comment.replies.length > 3 && showReplies && (
              <TouchableOpacity
                onPress={() => setShowReplies(false)}
                style={styles.hideRepliesButton}
                activeOpacity={0.7}
              >
                <Text style={styles.hideRepliesText}>Hide replies</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  replyContainer: {
    paddingLeft: 48,
    paddingVertical: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  replyAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  username: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  verifiedIcon: {
    color: '#1DA1F2',
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    color: '#000',
  },
  mention: {
    color: '#007AFF',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 12,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginRight: 16,
  },
  likesCount: {
    fontSize: 12,
    color: '#666',
    marginRight: 16,
  },
  replyButton: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginRight: 16,
  },
  likeButton: {
    fontSize: 16,
  },
  likedButton: {
    color: '#FF3B30',
  },
  repliesContainer: {
    marginTop: 8,
  },
  showRepliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 12,
  },
  replyLine: {
    width: 24,
    height: 1,
    backgroundColor: '#DDD',
    marginRight: 8,
  },
  showRepliesText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  hideRepliesButton: {
    paddingVertical: 8,
    paddingLeft: 12,
  },
  hideRepliesText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
});