import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { Transformation } from '../../types/feed';
import { LikeButton } from './LikeButton';
import { abbreviateCount } from '../../utils/format';
import { timeAgo } from '../../utils/time';
import { useNavigation } from '../../navigation/stubs';
import feedService from '../../services/feed';

const { width } = Dimensions.get('window');
const CARD_HORIZONTAL = spacing.lg;
const CARD_WIDTH = width - CARD_HORIZONTAL * 2;

interface Props {
  item: Transformation;
  isViewable?: boolean; // to control autoplay later
  onToggleSave?: (id: string) => void;
}

export const TransformationCard = memo(function TransformationCard({ item, isViewable = false }: Props) {
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(item.is_liked);
  const [likesCount, setLikesCount] = useState(item.likes_count);
  const [isSaved, setIsSaved] = useState(item.is_saved);
  const [showAfter, setShowAfter] = useState(true);

  const heartScale = useSharedValue(0);
  const contentTranslateX = useSharedValue(0);

  useEffect(() => {
    // prefetch images for snappy toggling
    FastImage.preload([
      { uri: item.before.url },
      { uri: item.after.url },
    ]);
  }, [item.before.url, item.after.url]);

  const onDoubleTap = useCallback(async () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((c) => c + 1);
      heartScale.value = withSequence(
        withTiming(1, { duration: 100, easing: Easing.out(Easing.ease) }),
        withDelay(300, withTiming(0, { duration: 200 }))
      );
      try {
        await feedService.likeTransformation(item.id);
      } catch {
        setIsLiked(false);
        setLikesCount((c) => Math.max(0, c - 1));
      }
    }
  }, [heartScale, isLiked, item.id]);

  const toggleLike = useCallback(async () => {
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
    try {
      if (next) await feedService.likeTransformation(item.id);
      else await feedService.unlikeTransformation(item.id);
    } catch {
      setIsLiked(!next);
      setLikesCount((c) => (!next ? c + 1 : Math.max(0, c - 1)));
    }
  }, [isLiked, item.id]);

  const toggleSave = useCallback(async () => {
    const next = !isSaved;
    setIsSaved(next);
    try {
      if (next) await feedService.saveTransformation(item.id);
      // unsave omitted in service; keep simple
    } catch {
      setIsSaved(!next);
    }
  }, [isSaved, item.id]);

  const header = useMemo(() => (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.lg }}>
      <Pressable onPress={() => navigation.navigate('Profile', { userId: item.provider.id })} style={{ marginRight: spacing.sm }}>
        <FastImage
          source={{ uri: item.provider.avatar_url ?? 'https://placehold.co/96x96' }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{item.provider.display_name}</Text>
        <Pressable onPress={() => navigation.navigate('Booking', { serviceType: item.service_type, providerId: item.provider.id })}>
          <Text style={{ color: colors.accent, fontSize: 12 }}>{item.service_type.toUpperCase()}</Text>
        </Pressable>
      </View>
      {!item.provider.is_following && (
        <Pressable onPress={() => feedService.followUser(item.provider.id)} style={{ backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 }}>
          <Text style={{ color: 'white', fontWeight: '600' }}>Follow</Text>
        </Pressable>
      )}
      <Pressable style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}>
        <Text style={{ color: colors.textSecondary }}>⋯</Text>
      </Pressable>
    </View>
  ), [item.provider.display_name, item.provider.id, item.provider.is_following, item.service_type, navigation]);

  const media = useMemo(() => (
    <Pressable onLongPress={() => {}} onPress={() => setShowAfter((s) => !s)} onDoublePress={onDoubleTap as any}>
      <View style={{ width: CARD_WIDTH, height: CARD_WIDTH * (item.after.aspect_ratio ?? 1), backgroundColor: colors.surface, overflow: 'hidden', borderRadius: 12 }}>
        <Animated.View style={{ flex: 1 }}>
          <FastImage
            source={{ uri: showAfter ? item.after.url : item.before.url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </Animated.View>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: '40%',
            left: 0,
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ scale: heartScale }],
            opacity: heartScale,
          }}
        >
          <Text style={{ fontSize: 72, color: colors.accent }}>♥</Text>
        </Animated.View>
      </View>
    </Pressable>
  ), [item.after.aspect_ratio, item.after.url, item.before.url, onDoubleTap, showAfter]);

  const footer = useMemo(() => (
    <View style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
          <LikeButton isLiked={isLiked} count={likesCount} onToggle={toggleLike} />
          <Pressable onPress={() => navigation.navigate('TransformationDetail', { id: item.id })}>
            <Text style={{ color: colors.textSecondary }}>💬 {abbreviateCount(item.comments_count)}</Text>
          </Pressable>
          <Pressable>
            <Text style={{ color: colors.textSecondary }}>↗</Text>
          </Pressable>
        </View>
        <Pressable onPress={toggleSave}>
          <Text style={{ color: isSaved ? colors.accent : colors.textSecondary }}>{isSaved ? '⯆ Saved' : '⯆ Save'}</Text>
        </Pressable>
      </View>
      {!!item.caption && (
        <Text numberOfLines={2} style={{ color: colors.textPrimary, marginTop: spacing.sm }}>
          {item.caption}
        </Text>
      )}
      <Pressable onPress={() => navigation.navigate('Booking', { serviceType: item.service_type, providerId: item.provider.id })}>
        <Text style={{ color: colors.accent, marginTop: spacing.xs }}>#{item.service_type}</Text>
      </Pressable>
      <Text style={{ color: colors.textSecondary, marginTop: spacing.xs }}>{timeAgo(item.created_at)}</Text>
      {item.provider.is_provider && (
        <Animated.View style={{ marginTop: spacing.md }}>
          <Pressable
            onPress={() => navigation.navigate('Booking', { serviceType: item.service_type, providerId: item.provider.id })}
            style={{ backgroundColor: colors.accent, paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>Book This Service</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  ), [isLiked, likesCount, toggleLike, navigation, item.id, item.caption, item.comments_count, item.service_type, item.provider.id, item.provider.is_provider, isSaved, toggleSave]);

  return (
    <View style={{ width: CARD_WIDTH, alignSelf: 'center', backgroundColor: colors.card, borderRadius: 12, marginVertical: spacing.md }}>
      {header}
      {media}
      {footer}
    </View>
  );
});

export default TransformationCard;
