import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Share } from 'react-native';

interface Props {
  route: { params: { bookingId: string; reference: string } };
  navigation: any;
}

export const BookingSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId, reference } = route.params;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  }, [scale]);

  const onShare = async () => {
    await Share.share({ message: `Booking confirmed! Reference: ${reference}` });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.checkCircle, { transform: [{ scale }] }]}> 
        <Text style={styles.check}>✓</Text>
      </Animated.View>
      <Text style={styles.title}>Booking Confirmed</Text>
      <Text style={styles.subtitle}>Reference #{reference}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MyBookings')}>
        <Text style={styles.buttonText}>View Booking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.navigate('ServiceList')}>
        <Text style={[styles.buttonText, styles.secondaryText]}>Book Another</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onShare}>
        <Text style={styles.link}>Share confirmation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'white' },
  checkCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  check: { color: 'white', fontSize: 48, fontWeight: '800' },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 16 },
  subtitle: { color: '#6B7280', marginTop: 4 },
  button: { width: '100%', backgroundColor: '#111827', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  buttonText: { color: 'white', fontWeight: '700' },
  secondary: { backgroundColor: '#F3F4F6' },
  secondaryText: { color: '#111827' },
  link: { color: '#2563EB', marginTop: 12, fontWeight: '600' },
});

export default BookingSuccessScreen;
