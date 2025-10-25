import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { BookStackScreenProps } from '../../types/navigation';

type Props = BookStackScreenProps<'BookingConfirmation'>;

const BookingConfirmationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Booking Confirmed!</Text>
      <Text variant="bodyLarge">Booking ID: {bookingId}</Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('ServiceListScreen')}
        style={styles.button}
      >
        Back to Services
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
  },
});

export default BookingConfirmationScreen;