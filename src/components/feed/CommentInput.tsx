import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Comment, UserProfile } from '../../types';

interface CommentInputProps {
  onSubmit: (text: string, parentCommentId?: string) => Promise<void>;
  replyingTo: Comment | null;
  onCancelReply: () => void;
  isPosting: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  onSubmit,
  replyingTo,
  onCancelReply,
  isPosting,
  placeholder = 'Add a comment...',
  maxLength = 500,
}) => {
  const [text, setText] = useState('');
  const [mentions, setMentions] = useState<UserProfile[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (replyingTo) {
      // Auto-mention the user being replied to
      const mentionText = `@${replyingTo.user.username} `;
      setText(mentionText);
      setMentions([replyingTo.user]);
      inputRef.current?.focus();
    }
  }, [replyingTo]);

  const handleSubmit = async () => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    try {
      await onSubmit(trimmedText, replyingTo?.id);
      setText('');
      setMentions([]);
      if (replyingTo) {
        onCancelReply();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment. Please try again.');
    }
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
    
    // Simple mention detection
    const words = newText.split(' ');
    const lastWord = words[words.length - 1];
    
    if (lastWord.startsWith('@') && lastWord.length > 1) {
      // In a real app, you'd search for users here
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const addMention = (user: UserProfile) => {
    const words = text.split(' ');
    words[words.length - 1] = `@${user.username} `;
    setText(words.join(' '));
    setMentions(prev => [...prev.filter(u => u.id !== user.id), user]);
    setShowMentions(false);
  };

  const canSubmit = text.trim().length > 0 && !isPosting;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {replyingTo && (
        <View style={styles.replyingToContainer}>
          <Text style={styles.replyingToText}>
            Replying to {replyingTo.user.display_name || replyingTo.user.username}
          </Text>
          <TouchableOpacity
            onPress={onCancelReply}
            style={styles.cancelReplyButton}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelReplyText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mention suggestions - simplified version */}
      {showMentions && (
        <View style={styles.mentionsContainer}>
          <Text style={styles.mentionsTitle}>Suggestions</Text>
          {/* In a real app, you'd show actual user suggestions here */}
          <TouchableOpacity
            style={styles.mentionItem}
            onPress={() => addMention({
              id: '1',
              username: 'example_user',
              display_name: 'Example User',
              is_provider: false,
              is_verified: false,
              follower_count: 0,
              following_count: 0,
            })}
          >
            <Text style={styles.mentionUsername}>@example_user</Text>
            <Text style={styles.mentionDisplayName}>Example User</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.textInput}
          value={text}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          maxLength={maxLength}
          editable={!isPosting}
          returnKeyType="default"
          blurOnSubmit={false}
        />
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            canSubmit && styles.submitButtonActive,
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.submitButtonText,
            canSubmit && styles.submitButtonTextActive,
          ]}>
            {isPosting ? '...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      {text.length > 0 && (
        <View style={styles.characterCount}>
          <Text style={[
            styles.characterCountText,
            text.length > maxLength * 0.9 && styles.characterCountWarning,
          ]}>
            {text.length}/{maxLength}
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
  replyingToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  replyingToText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  cancelReplyButton: {
    padding: 4,
  },
  cancelReplyText: {
    fontSize: 16,
    color: '#666',
  },
  mentionsContainer: {
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    maxHeight: 150,
  },
  mentionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  mentionItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  mentionUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  mentionDisplayName: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
    backgroundColor: '#F8F8F8',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#E1E1E1',
    minWidth: 60,
    alignItems: 'center',
  },
  submitButtonActive: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  submitButtonTextActive: {
    color: '#fff',
  },
  characterCount: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  characterCountText: {
    fontSize: 12,
    color: '#999',
  },
  characterCountWarning: {
    color: '#FF3B30',
  },
});