import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
=======
import { View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
>>>>>>> origin/main
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingCalendar'>;

<<<<<<< HEAD
const BookingCalendarScreen: React.FC<Props> = ({ navigation, route }) => {
  const { serviceId, providerId } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement calendar with available time slots */}
=======
const BookingCalendarScreen: React.FC<Props> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Calendar Screen</Text>
=======

const BookingCalendarScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Date & Time</Text>
>>>>>>> origin/main
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#fff',
  },
});

export default BookingCalendarScreen;
=======
<<<<<<< HEAD
    justifyContent: 'center',
    alignItems: 'center',
=======
    padding: 20,
>>>>>>> origin/main
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
<<<<<<< HEAD
  },
});

export default BookingCalendarScreen;
=======
    marginBottom: 20,
  },
});

export default BookingCalendarScreen;
>>>>>>> origin/main
>>>>>>> origin/main
