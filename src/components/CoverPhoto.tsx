import React from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';

interface Props {
  uri?: string;
  height?: number;
  editable?: boolean;
  onEditPress?: () => void;
}

export default function CoverPhoto({ uri, height = 160, editable, onEditPress }: Props) {
  return (
    <Pressable disabled={!editable} onPress={onEditPress}>
      <View style={{ height }}>
        {uri ? (
          <ImageBackground source={{ uri }} style={StyleSheet.absoluteFill} />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.placeholder]} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  placeholder: { backgroundColor: '#ccc' },
});
