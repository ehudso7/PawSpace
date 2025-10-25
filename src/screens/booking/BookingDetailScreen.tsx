import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { getBookingById, cancelBooking } from '../../services/bookings';
import type { Booking } from '../../types';
import { useEffect, useState } from 'react';
import { formatCurrency, formatDateTime } from '../../utils/format';
import { buildMapsUrl } from '../../config';

interface Props { route: { params: { id: string } }, navigation: any }

export const BookingDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getBookingById(id);
        setBooking(data);
      } catch (e: any) {
        Alert.alert('Error', e?.message || 'Could not load booking');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!booking) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  const onDirections = () => {
    const address = booking.service.location_address;
    if (!address) return;
    Linking.openURL(buildMapsUrl(address));
  };

  const onCancel = () => {
    Alert.prompt(
      'Cancel Booking',
      'Please provide a reason for cancellation',
      [
        { text: 'Dismiss', style: 'cancel' },
        { text: 'Confirm', onPress: async (reason?: string) => {
          if (!reason) return;
          try { await cancelBooking(booking.id, reason); navigation.goBack(); } catch (e: any) { Alert.alert('Error', e?.message || 'Could not cancel'); }
        }},
      ],
      'plain-text'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{booking.service.name}</Text>
      <Text style={styles.subtitle}>{booking.provider.name}</Text>

      <View style={styles.row}><Text style={styles.label}>Date</Text><Text style={styles.value}>{formatDateTime(booking.appointment_time)}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Duration</Text><Text style={styles.value}>{booking.duration} min</Text></View>
      <View style={styles.row}><Text style={styles.label}>Status</Text><Text style={styles.value}>{booking.status}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Total</Text><Text style={styles.value}>{formatCurrency(booking.total_price)}</Text></View>

      {booking.notes ? (
        <View style={styles.notes}><Text style={styles.label}>Notes</Text><Text style={styles.value}>{booking.notes}</Text></View>
      ) : null}

      {booking.service.location_address && (
        <TouchableOpacity style={styles.button} onPress={onDirections}>
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat', { providerId: booking.provider_id })}>
        <Text style={styles.buttonText}>Contact Provider</Text>
      </TouchableOpacity>

      {booking.status === 'confirmed' && (
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={onCancel}>
          <Text style={styles.dangerText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}

      {booking.status === 'completed' && (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LeaveReview', { bookingId: booking.id })}>
          <Text style={styles.buttonText}>Leave Review</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#111827' },
  subtitle: { color: '#6B7280', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  label: { color: '#6B7280' },
  value: { color: '#111827', fontWeight: '500' },
  notes: { marginTop: 12 },
  button: { backgroundColor: '#111827', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
  buttonText: { color: 'white', fontWeight: '700' },
  dangerButton: { backgroundColor: '#FEE2E2' },
  dangerText: { color: '#DC2626', fontWeight: '700' },
});

export default BookingDetailScreen;
