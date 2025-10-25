import React from 'react';
import { View, Text, StyleSheet, Image, ViewProps } from 'react-native';

export type ProviderCardProps = ViewProps & {
  name?: string;
  avatarUri?: string;
  rating?: number;
};

export const ProviderCard: React.FC<ProviderCardProps> = ({ name = 'Provider', avatarUri, rating = 5, style, ...rest }) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      <Image source={{ uri: avatarUri }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb'
  },
  info: {
    marginLeft: 12
  },
  name: {
    fontWeight: '600'
  },
  rating: {
    color: '#6b7280'
  }
});
