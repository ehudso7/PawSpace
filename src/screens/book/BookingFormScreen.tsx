import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { BookStackScreenProps } from '../../types/navigation';

type Props = BookStackScreenProps<'BookingForm'>;

const BookingFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { serviceId, serviceName, providerId } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Book {serviceName}</Text>
      <Text variant="bodyLarge">Service ID: {serviceId}</Text>
      <Text variant="bodyLarge">Provider ID: {providerId}</Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('BookingConfirmation', { 
          bookingId: 'booking123' 
        })}
        style={styles.button}
      >
        Confirm Booking
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 20,
  },
});

export default BookingFormScreen;