import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';

export type BookingDetailProps = NativeStackScreenProps<RootStackParamList, 'BookingDetail'>;

const BookingDetailScreen: React.FC<BookingDetailProps> = ({ route }) => {
  const { id } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking #{id}</Text>
      <Text>Details coming soon.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
});

export default BookingDetailScreen;
