import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface StoryMedia {
  id: string;
  url: string;
  duration_ms?: number;
}

export interface Story {
  id: string;
  username: string;
  avatar_url?: string;
  items: StoryMedia[];
}

interface Props {
  story: Story;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export function StoryViewer({ story, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startTimer();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function startTimer() {
    stopTimer();
    const d = story.items[index]?.duration_ms ?? 4000;
    timerRef.current = setTimeout(() => {
      if (index < story.items.length - 1) setIndex((i) => i + 1);
      else onClose();
    }, d);
  }
  function stopTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  return (
    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'black' }}>
      <FastImage source={{ uri: story.items[index]?.url }} style={{ width, height, resizeMode: 'cover' }} />
      <View style={{ position: 'absolute', top: spacing.xl, left: spacing.lg, right: spacing.lg }}>
        <Text style={{ color: colors.textPrimary, fontWeight: 'bold', fontSize: 16 }}>{story.username}</Text>
      </View>
      <View style={{ position: 'absolute', top: spacing.xl / 2, left: spacing.lg, right: spacing.lg, flexDirection: 'row', gap: 4 }}>
        {story.items.map((_, i) => (
          <View key={i} style={{ flex: 1, height: 3, backgroundColor: i <= index ? colors.textPrimary : colors.surface }} />
        ))}
      </View>
      <Pressable onPress={onClose} style={{ position: 'absolute', top: spacing.xl, right: spacing.lg, padding: spacing.sm }}>
        <Text style={{ color: colors.textSecondary }}>Close</Text>
      </Pressable>
    </View>
  );
}

export default StoryViewer;
