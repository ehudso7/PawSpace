import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type ServiceCardProps = {
  title?: string;
  price?: string | number;
  durationMins?: number;
};

export default function ServiceCard({ title, price, durationMins }: ServiceCardProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title ?? 'Service'}</Text>
      <Text style={styles.meta}>{price ? `$${price}` : ''} {durationMins ? `• ${durationMins}m` : ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 12 },
  title: { fontWeight: '600', marginBottom: 6 },
  meta: { color: '#666' },
});
