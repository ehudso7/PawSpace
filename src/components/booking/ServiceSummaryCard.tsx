import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '../common/Avatar';
import type { ProviderProfile, Service } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/format';

interface Props {
  provider: ProviderProfile;
  service: Service;
  appointmentTime: string;
  duration: number;
  address?: string;
}

export const ServiceSummaryCard: React.FC<Props> = ({ provider, service, appointmentTime, duration, address }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar uri={provider.avatar_url} name={provider.name} size={48} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={styles.providerName}>{provider.name}</Text>
          {provider.rating != null && <Text style={styles.rating}>⭐ {provider.rating.toFixed(1)}</Text>}
        </View>
      </View>
      <View style={styles.row}><Text style={styles.label}>Service</Text><Text style={styles.value}>{service.name} ({service.type})</Text></View>
      <View style={styles.row}><Text style={styles.label}>Date & Time</Text><Text style={styles.value}>{formatDateTime(appointmentTime)}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Duration</Text><Text style={styles.value}>{duration} min</Text></View>
      {address ? <View style={styles.row}><Text style={styles.label}>Location</Text><Text style={styles.value}>{address}</Text></View> : null}
      <View style={[styles.row, styles.lastRow]}>
        <Text style={styles.label}>Price</Text>
        <Text style={styles.value}>{formatCurrency(service.price)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  providerName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  rating: { color: '#6B7280', marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  label: { color: '#6B7280' },
  value: { color: '#111827', fontWeight: '500' },
  lastRow: { marginTop: 12 },
});
