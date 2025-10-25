import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeInUp, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import feedService from '../../services/feed';
import { ServiceType, Transformation } from '../../types/feed';
import { formatNumberShort, } from '../../utils/time';
import { formatTimeAgo } from '../../utils/time';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface TransformationCardProps {
  item: Transformation;
  isVisible?: boolean;
  isScrollingDown?: boolean;
  onPressProvider?: (providerId: string) => void;
  onPressService?: (serviceType: ServiceType) => void;
  onPressComment?: (item: Transformation) => void;
  onShare?: (item: Transformation) => void;
}

const MEDIA_HEIGHT = Math.round(SCREEN_WIDTH * 1.1);

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

export const TransformationCard: React.FC<TransformationCardProps> = React.memo(({
  item,
  isVisible = false,
  isScrollingDown = false,
  onPressProvider,
  onPressService,
  onPressComment,
  onShare,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(item.is_liked);
  const [likesCount, setLikesCount] = useState<number>(item.likes_count);
  const [isSaved, setIsSaved] = useState<boolean>(item.is_saved ?? false);
  const [showAfter, setShowAfter] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(item.provider.is_following ?? false);

  const heartScale = useSharedValue(0);
  const ctaVisible = useSharedValue(1);

  useEffect(() => {
    ctaVisible.value = withTiming(isScrollingDown ? 0 : 1, { duration: 220 });
  }, [isScrollingDown, ctaVisible]);

  useEffect(() => {
    setIsLiked(item.is_liked);
    setLikesCount(item.likes_count);
    setIsSaved(item.is_saved ?? false);
  }, [item]);

  const currentMedia = showAfter ? item.after : item.before;

  const runHeartAnim = useCallback(() => {
    heartScale.value = 0;
    heartScale.value = withSpring(1, { damping: 6, stiffness: 200 }, () => {
      heartScale.value = withTiming(0, { duration: 350 });
    });
  }, [heartScale]);

  const handleToggleLike = useCallback(async () => {
    // optimistic update
    setIsLiked(prev => !prev);
    setLikesCount(prev => prev + (isLiked ? -1 : 1));
    try {
      if (!isLiked) {
        await feedService.likeTransformation(item.id);
      } else {
        await feedService.unlikeTransformation(item.id);
      }
    } catch (e) {
      // revert
      setIsLiked(prev => !prev);
      setLikesCount(prev => prev + (isLiked ? 1 : -1));
    }
  }, [isLiked, item.id]);

  const handleDoubleTapLike = useCallback(() => {
    runHeartAnim();
    if (!isLiked) {
      // like if not already
      handleToggleLike();
    }
  }, [handleToggleLike, isLiked, runHeartAnim]);

  const handleSave = useCallback(async () => {
    setIsSaved(true);
    try {
      await feedService.saveTransformation(item.id);
    } catch (e) {
      setIsSaved(false);
    }
  }, [item.id]);

  const handleFollow = useCallback(async () => {
    const next = !isFollowing;
    setIsFollowing(next);
    try {
      if (next) await feedService.followUser(item.provider.id);
      else await feedService.unfollowUser(item.provider.id);
    } catch {
      setIsFollowing(!next);
    }
  }, [isFollowing, item.provider.id]);

  const pan = Gesture.Pan()
    .onEnd(e => {
      if (Math.abs(e.translationX) > 40) {
        runOnJS(setShowAfter)(e.translationX < 0);
      }
    });

  const doubleTap = Gesture.Tap().numberOfTaps(2).onEnd(() => {
    runOnJS(handleDoubleTapLike)();
  });

  const singleTap = Gesture.Tap().onEnd(() => {
    runOnJS(setShowAfter)(prev => !prev);
  });

  const composedGesture = Gesture.Race(doubleTap, Gesture.Simultaneous(singleTap, pan));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
    opacity: interpolate(heartScale.value, [0, 1], [0, 1]),
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(isScrollingDown ? 24 : 0) }],
    opacity: ctaVisible.value,
  }));

  const onPressMore = useCallback(() => {
    Alert.alert('Post options', undefined, [
      { text: 'Report', onPress: () => feedService.reportTransformation(item.id, 'Inappropriate') },
      { text: 'Share', onPress: () => (onShare ? onShare(item) : feedService.shareTransformation(item)) },
      { text: isSaved ? 'Saved' : 'Save', onPress: handleSave },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [handleSave, isSaved, item, onShare]);

  const onPressBook = useCallback(() => {
    // Deep link or navigate to booking; stub open URL
    Linking.openURL('https://example.com/book');
  }, []);

  return (
    <Animated.View entering={FadeInUp.springify()} style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.headerLeft} onPress={() => onPressProvider?.(item.provider.id)}>
          <FastImage source={{ uri: item.provider.avatar_url }} style={styles.avatar} />
          <View style={styles.headerTitle}>
            <Text style={styles.providerName}>{item.provider.name}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.service_type}</Text>
              </View>
              <Text style={styles.timeText}> · {formatTimeAgo(item.created_at)}</Text>
            </View>
          </View>
        </Pressable>
        <View style={styles.headerRight}>
          {!isFollowing && (
            <Pressable style={styles.followBtn} onPress={handleFollow}>
              <Text style={styles.followBtnText}>Follow</Text>
            </Pressable>
          )}
          <Pressable hitSlop={8} onPress={onPressMore}>
            <Icon name="ellipsis-horizontal" size={20} color="#222" />
          </Pressable>
        </View>
      </View>

      {/* Media */}
      <GestureDetector gesture={composedGesture}>
        <View style={styles.mediaContainer}>
          {currentMedia.type === 'image' ? (
            <AnimatedFastImage
              source={{ uri: currentMedia.url }}
              resizeMode={FastImage.resizeMode.cover}
              style={styles.media}
            />
          ) : (
            isVisible ? (
              <Video
                source={{ uri: currentMedia.url }}
                style={styles.media}
                paused={!isVisible}
                resizeMode="cover"
                repeat
              />
            ) : (
              <View style={[styles.media, styles.videoPlaceholder]} />
            )
          )}
          <Animated.View pointerEvents="none" style={[styles.heartOverlay, heartStyle]}>
            <Icon name="heart" size={100} color="#ff3b30" />
          </Animated.View>
          <View style={styles.sideToggle}>
            <View style={[styles.toggleDot, showAfter ? styles.toggleDotActive : undefined]} />
            <View style={[styles.toggleDot, !showAfter ? styles.toggleDotActive : undefined]} />
          </View>
        </View>
      </GestureDetector>

      {/* Footer actions */}
      <View style={styles.actionsRow}>
        <View style={styles.actionsLeft}>
          <Pressable style={styles.iconBtn} onPress={handleToggleLike}>
            <Icon name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? '#ff3b30' : '#222'} />
          </Pressable>
          <Text style={styles.countText}>{formatNumberShort(likesCount)}</Text>
          <Pressable style={[styles.iconBtn, { marginLeft: 16 }]} onPress={() => onPressComment?.(item)}>
            <Icon name="chatbubble-ellipses-outline" size={24} color="#222" />
          </Pressable>
          <Text style={styles.countText}>{formatNumberShort(item.comments_count)}</Text>
          <Pressable style={[styles.iconBtn, { marginLeft: 16 }]} onPress={() => (onShare ? onShare(item) : feedService.shareTransformation(item))}>
            <Icon name="share-social-outline" size={24} color="#222" />
          </Pressable>
        </View>
        <Pressable style={styles.iconBtn} onPress={handleSave}>
          <Icon name={isSaved ? 'bookmark' : 'bookmark-outline'} size={24} color="#222" />
        </Pressable>
      </View>

      {/* Caption */}
      {!!item.caption && (
        <ExpandableText text={item.caption} />
      )}

      {/* Service tag */}
      <Pressable style={styles.serviceTag} onPress={() => onPressService?.(item.service_type)}>
        <Icon name="pricetag-outline" size={16} color="#666" />
        <Text style={styles.serviceTagText}> {item.service_type}</Text>
      </Pressable>

      {/* Booking CTA */}
      <Animated.View style={[styles.ctaContainer, ctaStyle]}>
        <Pressable style={styles.bookBtn} onPress={onPressBook}>
          <Icon name="calendar-outline" size={18} color="#fff" />
          <Text style={styles.bookBtnText}> Book This Service</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
});

const ExpandableText: React.FC<{ text: string }> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const [shouldShowMore, setShouldShowMore] = useState(false);
  const textRef = useRef<Text>(null);

  const onTextLayout = useCallback((e: any) => {
    if (e?.nativeEvent?.lines?.length > 2) setShouldShowMore(true);
  }, []);

  return (
    <View style={styles.captionContainer}>
      <Text
        ref={textRef}
        style={styles.caption}
        numberOfLines={expanded ? undefined : 2}
        onTextLayout={onTextLayout}
      >
        {text}
      </Text>
      {shouldShowMore && (
        <Pressable onPress={() => setExpanded(p => !p)}>
          <Text style={styles.moreLess}>{expanded ? 'See less' : 'See more'}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    marginLeft: 10,
    flex: 1,
  },
  providerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 12, color: '#334155' },
  timeText: { fontSize: 12, color: '#94a3b8' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  followBtn: {
    backgroundColor: '#111827',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  followBtnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd' },
  mediaContainer: {
    width: '100%',
    height: MEDIA_HEIGHT,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: { width: '100%', height: '100%' },
  videoPlaceholder: { backgroundColor: '#e2e8f0' },
  heartOverlay: {
    position: 'absolute',
    alignSelf: 'center',
    top: '40%',
  },
  sideToggle: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 12,
    padding: 4,
  },
  toggleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.6)', margin: 3 },
  toggleDotActive: { backgroundColor: '#fff' },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  actionsLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 4 },
  countText: { fontSize: 13, color: '#334155', marginLeft: 4, minWidth: 28 },
  captionContainer: { paddingHorizontal: 12, paddingBottom: 8 },
  caption: { fontSize: 14, color: '#0f172a' },
  moreLess: { marginTop: 4, color: '#2563eb', fontSize: 13, fontWeight: '600' },
  serviceTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8 },
  serviceTagText: { color: '#475569', fontSize: 13 },
  ctaContainer: { paddingHorizontal: 12, paddingBottom: 12 },
  bookBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bookBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default TransformationCard;
