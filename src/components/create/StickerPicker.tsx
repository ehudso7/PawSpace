import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { STICKERS } from '../../constants/stickers';

interface Props {
  onPick: (uri: string) => void;
}

const numColumns = 5;

const StickerPicker: React.FC<Props> = ({ onPick }) => {
  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={STICKERS}
      keyExtractor={(i) => i.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <Pressable style={styles.item} onPress={() => onPick(item.uri)}>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </Pressable>
      )}
    />
  );
};

const size = 64;
const styles = StyleSheet.create({
  list: { padding: 12 },
  item: { width: size + 16, height: size + 16, padding: 8 },
  image: { width: size, height: size, resizeMode: 'contain' },
});

export default StickerPicker;
