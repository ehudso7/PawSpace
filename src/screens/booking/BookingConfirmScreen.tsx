import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookingConfirmScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Booking</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default BookingConfirmScreen;