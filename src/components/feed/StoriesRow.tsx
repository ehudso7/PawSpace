import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

export interface StoryItem {
  id: string;
  name: string;
  avatar_url: string;
  has_new: boolean;
  is_me?: boolean;
}

interface StoriesRowProps {
  stories: StoryItem[];
  onPressStory: (story: StoryItem) => void;
}

export const StoriesRow: React.FC<StoriesRowProps> = ({ stories, onPressStory }) => {
  const data = useMemo(() => stories, [stories]);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => onPressStory(item)}>
            <View style={[styles.ring, item.has_new && styles.ringNew]}>
              <FastImage source={{ uri: item.avatar_url }} style={styles.avatar} />
              {item.is_me && (
                <View style={styles.plus}>
                  <Text style={styles.plusText}>+</Text>
                </View>
              )}
            </View>
            <Text style={styles.name} numberOfLines={1}>{item.is_me ? 'Your Story' : item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

const SIZE = 64;

const styles = StyleSheet.create({
  container: { paddingVertical: 10, backgroundColor: '#fff', borderBottomColor: '#eee', borderBottomWidth: StyleSheet.hairlineWidth },
  item: { width: SIZE + 24, alignItems: 'center', marginRight: 8 },
  ring: { width: SIZE + 4, height: SIZE + 4, borderRadius: (SIZE + 4) / 2, borderWidth: 2, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  ringNew: { borderColor: '#10b981' },
  avatar: { width: SIZE, height: SIZE, borderRadius: SIZE / 2 },
  name: { marginTop: 6, fontSize: 12, color: '#334155', maxWidth: SIZE + 16 },
  plus: { position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  plusText: { color: '#fff', fontWeight: '700' },
});

export default StoriesRow;
