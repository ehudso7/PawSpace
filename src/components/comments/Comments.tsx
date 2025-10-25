import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import feedService from '../../services/feed';
import { Comment } from '../../types/feed';
import FastImage from 'react-native-fast-image';
import { formatTimeAgo } from '../../utils/time';

interface CommentsProps {
  transformationId: string;
}

const CommentItem: React.FC<{
  comment: Comment;
  onReply: (c: Comment) => void;
  onDelete: (c: Comment) => void;
  onLike: (c: Comment) => void;
}> = ({ comment, onReply, onDelete, onLike }) => {
  return (
    <View style={styles.commentRow}>
      <FastImage source={{ uri: comment.user.avatar_url }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.bubble}>
          <Text style={styles.username}>{comment.user.username}</Text>
          <Text style={styles.commentText}> {comment.text}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{formatTimeAgo(comment.created_at)}</Text>
          <Pressable onPress={() => onReply(comment)}>
            <Text style={styles.metaAction}>  Reply</Text>
          </Pressable>
          <Pressable onPress={() => onLike(comment)}>
            <Text style={styles.metaAction}>  Like ({comment.likes_count})</Text>
          </Pressable>
          <Pressable onLongPress={() => onDelete(comment)}>
            <Text style={[styles.metaAction, { color: '#ef4444' }]}>  Delete</Text>
          </Pressable>
        </View>
        {comment.replies?.map(r => (
          <View key={r.id} style={styles.replyRow}>
            <FastImage source={{ uri: r.user.avatar_url }} style={[styles.avatar, { width: 28, height: 28 }]} />
            <View style={{ flex: 1 }}>
              <View style={styles.bubble}>
                <Text style={styles.username}>{r.user.username}</Text>
                <Text style={styles.commentText}> {r.text}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{formatTimeAgo(r.created_at)}</Text>
                <Pressable onPress={() => onLike(r)}>
                  <Text style={styles.metaAction}>  Like ({r.likes_count})</Text>
                </Pressable>
                <Pressable onLongPress={() => onDelete(r)}>
                  <Text style={[styles.metaAction, { color: '#ef4444' }]}>  Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export const Comments: React.FC<CommentsProps> = ({ transformationId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [loading, setLoading] = useState(false);

  const loadComments = useCallback(async () => {
    const list = await feedService.getComments(transformationId);
    setComments(list);
  }, [transformationId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  const onSend = useCallback(async () => {
    if (!text.trim()) return;
    const optimistic: Comment = {
      id: `tmp_${Date.now()}`,
      transformation_id: transformationId,
      user_id: 'me',
      user: { id: 'me', name: 'You', username: 'you', avatar_url: 'https://i.pravatar.cc/150?u=me', is_provider: false },
      text,
      likes_count: 0,
      is_liked: false,
      parent_comment_id: replyTo?.id,
      replies: [],
      created_at: new Date().toISOString(),
    };

    setText('');
    setReplyTo(null);

    setComments(prev => {
      if (replyTo) {
        const copy = [...prev];
        const idx = copy.findIndex(c => c.id === replyTo.id);
        if (idx !== -1) {
          copy[idx] = { ...copy[idx], replies: [optimistic, ...(copy[idx].replies ?? [])] };
        } else {
          copy.unshift(optimistic);
        }
        return copy;
      }
      return [optimistic, ...prev];
    });

    try {
      const saved = await feedService.addComment(transformationId, text, undefined, replyTo?.id);
      // replace optimistic
      setComments(prev => prev.map(c => (c.id === optimistic.id ? saved : c)));
    } catch {
      // revert
      setComments(prev => prev.filter(c => c.id !== optimistic.id));
    }
  }, [replyTo, text, transformationId]);

  const onDelete = useCallback(async (c: Comment) => {
    Alert.alert('Delete comment?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const prev = comments;
        setComments(cs => cs.filter(x => x.id !== c.id));
        try { await feedService.deleteComment(c.id); } catch { setComments(prev); }
      } },
    ]);
  }, [comments]);

  const onLike = useCallback(async (c: Comment) => {
    // simple optimistic like increment; idempotence not tracked here
    setComments(prev => prev.map(x => x.id === c.id ? { ...x, likes_count: x.likes_count + 1, is_liked: true } : x));
    try { await feedService.likeComment(c.id); } catch {}
  }, []);

  const onReply = useCallback((c: Comment) => setReplyTo(c), []);

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <CommentItem comment={item} onReply={onReply} onDelete={onDelete} onLike={onLike} />
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <View style={styles.inputBar}>
        {replyTo && (
          <Pressable onPress={() => setReplyTo(null)} style={styles.replyPill}>
            <Text style={styles.replyPillText}>Replying to {replyTo.user.username} · Cancel</Text>
          </Pressable>
        )}
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Add a comment"
            value={text}
            onChangeText={setText}
            style={styles.input}
            multiline
          />
          <Pressable onPress={onSend} style={styles.sendBtn}>
            <Icon name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  commentRow: { flexDirection: 'row', paddingHorizontal: 12, paddingTop: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e2e8f0', marginRight: 10 },
  bubble: { backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  username: { fontWeight: '700', color: '#0f172a' },
  commentText: { color: '#0f172a' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 10 },
  metaText: { color: '#64748b', fontSize: 12 },
  metaAction: { color: '#0ea5e9', fontSize: 12 },
  replyRow: { flexDirection: 'row', paddingLeft: 42, marginTop: 6 },

  inputBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopColor: '#e2e8f0', borderTopWidth: StyleSheet.hairlineWidth, padding: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end' },
  input: { flex: 1, minHeight: 40, maxHeight: 120, borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  sendBtn: { marginLeft: 8, backgroundColor: '#111827', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },

  replyPill: { marginBottom: 6, alignSelf: 'flex-start', backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  replyPillText: { color: '#3730a3', fontWeight: '600' },
});

export default Comments;
