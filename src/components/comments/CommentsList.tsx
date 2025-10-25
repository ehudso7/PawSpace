import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { Comment } from '../../types/feed';
import feedService from '../../services/feed';

interface Props {
  transformationId: string;
}

function CommentItem({ item, onReply, onLike, onDelete }: { item: Comment; onReply: (c: Comment) => void; onLike: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', paddingVertical: spacing.sm }}>
      <FastImage source={{ uri: item.user.avatar_url ?? 'https://placehold.co/96x96' }} style={{ width: 32, height: 32, borderRadius: 16, marginRight: spacing.sm }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{item.user.display_name}</Text>
        <Text style={{ color: colors.textSecondary, marginTop: 2 }}>{item.text}</Text>
        <View style={{ flexDirection: 'row', gap: 16, marginTop: spacing.xs }}>
          <Pressable onPress={() => onLike(item.id)}><Text style={{ color: colors.textSecondary }}>♥ {item.likes_count}</Text></Pressable>
          <Pressable onPress={() => onReply(item)}><Text style={{ color: colors.textSecondary }}>Reply</Text></Pressable>
          <Pressable onLongPress={() => onDelete(item.id)}><Text style={{ color: colors.textSecondary }}>⋯</Text></Pressable>
        </View>
        {item.replies?.map((r) => (
          <View key={r.id} style={{ flexDirection: 'row', marginTop: spacing.sm }}>
            <View style={{ width: 24 }} />
            <FastImage source={{ uri: r.user.avatar_url ?? 'https://placehold.co/96x96' }} style={{ width: 24, height: 24, borderRadius: 12, marginRight: spacing.sm }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{r.user.display_name}</Text>
              <Text style={{ color: colors.textSecondary, marginTop: 2 }}>{r.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export const CommentsList = memo(function CommentsList({ transformationId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    feedService.getComments(transformationId).then(setComments);
  }, [transformationId]);

  const onReply = useCallback((c: Comment) => {
    setReplyTo(c);
    setText(`@${c.user.username} `);
    inputRef.current?.focus();
  }, []);

  const onLike = useCallback(async (id: string) => {
    // optimistic
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, is_liked: true, likes_count: c.likes_count + 1 } : {
      ...c,
      replies: c.replies?.map((r) => (r.id === id ? { ...r, is_liked: true, likes_count: r.likes_count + 1 } : r)),
    })));
    try {
      await feedService.likeComment(id);
    } catch {
      // revert minimal
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, is_liked: false, likes_count: Math.max(0, c.likes_count - 1) } : {
        ...c,
        replies: c.replies?.map((r) => (r.id === id ? { ...r, is_liked: false, likes_count: Math.max(0, r.likes_count - 1) } : r)),
      })));
    }
  }, []);

  const onDelete = useCallback(async (id: string) => {
    const prev = comments;
    setComments((cs) => cs.filter((c) => c.id !== id).map((c) => ({ ...c, replies: c.replies?.filter((r) => r.id !== id) })));
    try {
      await feedService.deleteComment(id);
    } catch {
      setComments(prev);
    }
  }, [comments]);

  const onSend = useCallback(async () => {
    if (!text.trim()) return;
    const optimistic: Comment = {
      id: `optimistic-${Math.random().toString(36).slice(2, 8)}`,
      transformation_id: transformationId,
      user_id: 'you',
      user: { id: 'you', username: 'you', display_name: 'You' },
      text,
      likes_count: 0,
      is_liked: false,
      parent_comment_id: replyTo?.id,
      created_at: new Date().toISOString(),
    };
    setComments((prev) => (replyTo ? prev.map((c) => (c.id === replyTo.id ? { ...c, replies: [...(c.replies ?? []), optimistic] } : c)) : [optimistic, ...prev]));
    setText('');
    setReplyTo(null);

    try {
      await feedService.addComment(transformationId, optimistic.text, replyTo?.id);
      const fresh = await feedService.getComments(transformationId);
      setComments(fresh);
    } catch {
      // ignore; optimistic stays
    }
  }, [replyTo, text, transformationId]);

  const header = useMemo(() => (
    <View style={{ paddingVertical: spacing.sm }}>
      <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>Comments</Text>
    </View>
  ), []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <FlatList
        data={comments}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl * 2 }}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <CommentItem item={item} onReply={onReply} onLike={onLike} onDelete={onDelete} />
        )}
      />
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.md, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border }}>
        {replyTo && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
            <Text style={{ color: colors.textSecondary }}>Replying to {replyTo.user.display_name}</Text>
            <Pressable onPress={() => setReplyTo(null)} style={{ marginLeft: spacing.sm }}>
              <Text style={{ color: colors.accent }}>Cancel</Text>
            </Pressable>
          </View>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder="Add a comment..."
            placeholderTextColor={colors.textSecondary}
            style={{ flex: 1, backgroundColor: colors.surface, color: colors.textPrimary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: 20 }}
          />
          <Pressable onPress={onSend}>
            <Text style={{ color: colors.accent, fontWeight: '600' }}>Send</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
});

export default CommentsList;
