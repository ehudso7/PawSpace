import React from 'react';
import { Image, Pressable, View, StyleSheet } from 'react-native';

interface Props {
  uri?: string;
  size?: number;
  editable?: boolean;
  onEditPress?: () => void;
}

export default function Avatar({ uri, size = 96, editable, onEditPress }: Props) {
  return (
    <Pressable disabled={!editable} onPress={onEditPress} style={{ width: size, height: size }}>
      <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
        {uri ? (
          <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
        ) : (
          <View style={[styles.placeholder, { width: size, height: size, borderRadius: size / 2 }]} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  placeholder: {
    backgroundColor: '#ddd',
  },
});
