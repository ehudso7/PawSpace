import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
=======
import { View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
>>>>>>> origin/main
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<BookingStackParamList, 'BookingConfirm'>;

<<<<<<< HEAD
const BookingConfirmScreen: React.FC<Props> = ({ navigation, route }) => {
  const { bookingData } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement booking confirmation with payment */}
=======
const BookingConfirmScreen: React.FC<Props> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirm Screen</Text>
=======

const BookingConfirmScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Booking</Text>
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

export default BookingConfirmScreen;
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

export default BookingConfirmScreen;
=======
    marginBottom: 20,
  },
});

export default BookingConfirmScreen;
>>>>>>> origin/main
>>>>>>> origin/main
