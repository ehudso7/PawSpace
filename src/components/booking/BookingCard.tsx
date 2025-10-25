import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Booking } from '../../types';
import { Avatar } from '../common/Avatar';
import { formatCurrency, formatDateTime } from '../../utils/format';

interface Props {
  booking: Booking;
  onView: (id: string) => void;
  onMessage: (providerId: string) => void;
  onCancel: (id: string) => void;
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  const bg = status === 'confirmed' ? '#10B981' : status === 'completed' ? '#60A5FA' : status === 'cancelled' ? '#EF4444' : '#F59E0B';
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 9999 }}>
      <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>{status.toUpperCase()}</Text>
    </View>
  );
}

export const BookingCard: React.FC<Props> = ({ booking, onView, onMessage, onCancel }) => {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar uri={booking.provider.avatar_url} name={booking.provider.name} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={styles.title}>{booking.service.name}</Text>
          <Text style={styles.subtitle}>{booking.provider.name}</Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>
      <View style={styles.row}><Text style={styles.label}>Date</Text><Text style={styles.value}>{formatDateTime(booking.appointment_time)}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Price</Text><Text style={styles.value}>{formatCurrency(booking.total_price)}</Text></View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onView(booking.id)}><Text style={styles.link}>View Details</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onMessage(booking.provider_id)}><Text style={styles.link}>Message Provider</Text></TouchableOpacity>
        {booking.status === 'confirmed' && (
          <TouchableOpacity onPress={() => onCancel(booking.id)}><Text style={[styles.link, styles.danger]}>Cancel</Text></TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginTop: 12 },
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  subtitle: { color: '#6B7280' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  label: { color: '#6B7280' },
  value: { color: '#111827', fontWeight: '500' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  link: { color: '#2563EB', fontWeight: '600' },
  danger: { color: '#EF4444' },
});
