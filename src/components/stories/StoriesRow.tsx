import React, { memo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface StoryItem {
  id: string;
  username: string;
  avatar_url?: string;
  has_new?: boolean;
  is_self?: boolean;
}

interface Props {
  data: StoryItem[];
  onPressStory: (id: string) => void;
  onCreate?: () => void;
}

const AVATAR_SIZE = 64;

function StoryCircle({ item, onPress, onCreate }: { item: StoryItem; onPress: () => void; onCreate?: () => void }) {
  const ringColor = item.has_new ? colors.accent : colors.border;
  return (
    <Pressable onPress={item.is_self && onCreate ? onCreate : onPress} style={{ alignItems: 'center', marginHorizontal: spacing.sm }}>
      <View
        style={{
          width: AVATAR_SIZE + 6,
          height: AVATAR_SIZE + 6,
          borderRadius: (AVATAR_SIZE + 6) / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: ringColor,
        }}
      >
        <FastImage
          source={{ uri: item.avatar_url ?? 'https://placehold.co/128x128' }}
          style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 }}
        />
        {item.is_self && (
          <View
            style={{
              position: 'absolute',
              right: 2,
              bottom: 2,
              backgroundColor: colors.accent,
              width: 20,
              height: 20,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>+</Text>
          </View>
        )}
      </View>
      <Text numberOfLines={1} style={{ marginTop: spacing.xs, color: colors.textSecondary, maxWidth: AVATAR_SIZE + 10, fontSize: 12 }}>
        {item.username}
      </Text>
    </Pressable>
  );
}

const MemoStoryCircle = memo(StoryCircle);

function KeyExtractor(item: StoryItem) {
  return item.id;
}

export const StoriesRow = memo(function StoriesRow({ data, onPressStory, onCreate }: Props) {
  return (
    <View style={{ paddingVertical: spacing.sm }}>
      <FlatList
        data={data}
        keyExtractor={KeyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.lg }}
        renderItem={({ item }) => (
          <MemoStoryCircle item={item} onPress={() => onPressStory(item.id)} onCreate={onCreate} />
        )}
      />
    </View>
  );
});

export default StoriesRow;
