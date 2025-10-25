import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { cancelBooking } from '../../services/bookings';

interface Props { route: { params: { id: string } }; navigation: any; }

export default function CancelBookingScreen({ route, navigation }: Props): JSX.Element {
  const { id } = route.params;
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(): Promise<void> {
    setLoading(true);
    try {
      await cancelBooking(id, reason || 'User cancelled');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 8 }}>Cancel Booking</Text>
      <Text style={{ color: '#666', marginBottom: 8 }}>Please provide a reason (optional):</Text>
      <TextInput value={reason} onChangeText={setReason} placeholder="Reason" style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12 }} />
      <View style={{ height: 12 }} />
      <TouchableOpacity disabled={loading} onPress={onSubmit} style={{ backgroundColor: '#991b1b', padding: 12, borderRadius: 10 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}>{loading ? 'Cancelling...' : 'Confirm Cancel'}</Text>
      </TouchableOpacity>
    </View>
  );
}
