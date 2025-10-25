import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';

export type ProviderCardProps = {
  avatar?: ImageSourcePropType;
  name?: string;
  rating?: number;
};

export default function ProviderCard({ avatar, name, rating }: ProviderCardProps): JSX.Element {
  return (
    <View style={styles.container}>
      {avatar && <Image source={avatar} style={styles.avatar} />}
      <View style={styles.info}>
        <Text style={styles.name}>{name ?? 'Provider'}</Text>
        {typeof rating === 'number' && <Text style={styles.rating}>{rating.toFixed(1)} ★</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eee' },
  info: { marginLeft: 12 },
  name: { fontWeight: '600' },
  rating: { color: '#444', marginTop: 4 },
});
