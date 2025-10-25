import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingCalendar'>;

const BookingCalendarScreen: React.FC<Props> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Calendar Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BookingCalendarScreen;
