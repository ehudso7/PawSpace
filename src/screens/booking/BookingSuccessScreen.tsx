import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Share } from 'react-native';

interface Props {
  route: { params: { bookingId: string; ref?: string } };
  navigation: any;
}

export const BookingSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  }, [scale]);

  const { bookingId, ref } = route.params || {};

  async function onShare(): Promise<void> {
    try {
      await Share.share({
        message: `Booking confirmed! ID: ${bookingId}${ref ? `, Ref: ${ref}` : ''}`,
      });
    } catch (_) {}
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#f6f7fb' }}>
      <Animated.View style={{ transform: [{ scale }], width: 120, height: 120, borderRadius: 60, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 56 }}>✓</Text>
      </Animated.View>
      <View style={{ height: 16 }} />
      <Text style={{ fontSize: 20, fontWeight: '700' }}>Booking Confirmed</Text>
      <View style={{ height: 8 }} />
      <Text style={{ color: '#555', textAlign: 'center' }}>Booking ID: {bookingId}</Text>
      {ref ? <Text style={{ color: '#555', textAlign: 'center' }}>Reference: {ref}</Text> : null}
      <View style={{ height: 24 }} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TouchableOpacity onPress={() => navigation.replace('MyBookings', { tab: 'upcoming' })} style={{ padding: 12, backgroundColor: '#111827', borderRadius: 10 }}>
          <Text style={{ color: '#fff' }}>View Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.replace('ServiceList')} style={{ padding: 12, backgroundColor: '#f1f5f9', borderRadius: 10 }}>
          <Text>Book Another</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={{ padding: 12, backgroundColor: '#f1f5f9', borderRadius: 10 }}>
          <Text>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingSuccessScreen;
