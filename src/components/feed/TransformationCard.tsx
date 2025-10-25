import React from 'react';
import { View, Text, StyleSheet, Image, ViewProps } from 'react-native';

export type TransformationCardProps = ViewProps & {
  title?: string;
  beforeUri?: string;
  afterUri?: string;
};

export const TransformationCard: React.FC<TransformationCardProps> = ({ title = 'Transformation', beforeUri, afterUri, style, ...rest }) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.imagesRow}>
        <Image source={{ uri: beforeUri }} style={styles.image} />
        <Image source={{ uri: afterUri }} style={styles.image} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12
  },
  title: {
    fontWeight: '600',
    marginBottom: 8
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 8
  },
  image: {
    width: 120,
    height: 120,
    backgroundColor: '#e5e7eb',
    borderRadius: 8
  }
});
