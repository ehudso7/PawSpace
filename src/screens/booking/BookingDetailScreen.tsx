import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { getBookingById, cancelBooking } from '../../services/bookings';
import { Booking } from '../../types';
import { Avatar } from '../../components/Avatar';

interface Props {
  route: { params: { id: string } };
  navigation: any;
}

export const BookingDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<Booking | undefined>();
  const [error, setError] = useState<string | undefined>();

  async function load(): Promise<void> {
    setLoading(true);
    setError(undefined);
    try {
      const data = await getBookingById(id);
      setBooking(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load booking');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  function openMaps(location: string): void {
    const encoded = encodeURIComponent(location);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
    Linking.openURL(url);
  }

  async function onCancel(): Promise<void> {
    Alert.alert('Cancel booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No' },
      { text: 'Yes, cancel', style: 'destructive', onPress: async () => {
        try {
          await cancelBooking(id, 'User requested cancellation');
          navigation.goBack();
        } catch (err: any) {
          Alert.alert('Error', err?.message || 'Failed to cancel booking');
        }
      } },
    ]);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !booking) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{error || 'Not found'}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7fb', padding: 16 }}>
      <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar uri={booking.provider.avatar_url} name={booking.provider.name} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700' }}>{booking.provider.name}</Text>
            <Text>{booking.service.name}</Text>
            <Text>{new Date(booking.appointment_time).toLocaleString()}</Text>
          </View>
        </View>
        <View style={{ height: 8 }} />
        <Text>Status: {booking.status}</Text>
        {booking.notes ? <Text>Notes: {booking.notes}</Text> : null}
        <Text>Location: TBD</Text>
      </View>

      <View style={{ height: 12 }} />

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity onPress={() => openMaps('')} style={{ padding: 12, backgroundColor: '#111827', borderRadius: 10 }}>
          <Text style={{ color: '#fff' }}>Get Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chat', { userId: booking.provider_id })} style={{ padding: 12, backgroundColor: '#f1f5f9', borderRadius: 10 }}>
          <Text>Contact Provider</Text>
        </TouchableOpacity>
        {booking.status === 'confirmed' && (
          <TouchableOpacity onPress={onCancel} style={{ padding: 12, backgroundColor: '#fee2e2', borderRadius: 10 }}>
            <Text style={{ color: '#991b1b' }}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
      </View>

      {booking.status === 'completed' && (
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('LeaveReview', { bookingId: booking.id })} style={{ padding: 12, backgroundColor: '#22c55e', borderRadius: 10 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Leave Review</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ marginTop: 20, alignItems: 'center' }}>
        <View style={{ width: 140, height: 140, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
          <Text>QR</Text>
        </View>
      </View>
    </View>
  );
};

export default BookingDetailScreen;
