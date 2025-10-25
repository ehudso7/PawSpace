import React from 'react';
import { View, Text, Image, StyleSheet, ImageSourcePropType } from 'react-native';

export type TransformationCardProps = {
  beforeImage?: ImageSourcePropType;
  afterImage?: ImageSourcePropType;
  title?: string;
};

export default function TransformationCard({ beforeImage, afterImage, title }: TransformationCardProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? 'Transformation'}</Text>
      <View style={styles.row}>
        {beforeImage && <Image source={beforeImage} style={styles.image} />}
        {afterImage && <Image source={afterImage} style={styles.image} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  title: { fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  image: { width: 120, height: 120, borderRadius: 8, backgroundColor: '#eee' },
});
