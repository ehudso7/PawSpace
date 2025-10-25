import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, TextInput, Divider, useTheme, Surface } from 'react-native-paper';
import type { BookScreenProps } from '../../types/navigation';

type Props = BookScreenProps<'Booking'>;

const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const theme = useTheme();

  const handleBooking = () => {
    // Simulate booking
    const bookingId = Math.random().toString(36).substring(7);
    navigation.navigate('BookingConfirmation', { bookingId });
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.header}>
          Book Service
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Service ID: {serviceId}
        </Text>

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Select Date & Time
        </Text>

        <TextInput
          label="Date"
          value={date}
          onChangeText={setDate}
          mode="outlined"
          placeholder="YYYY-MM-DD"
          style={styles.input}
        />

        <TextInput
          label="Time"
          value={time}
          onChangeText={setTime}
          mode="outlined"
          placeholder="HH:MM"
          style={styles.input}
        />

        <Divider style={styles.divider} />

        <Text variant="titleMedium" style={styles.sectionTitle}>
          Additional Notes
        </Text>

        <TextInput
          label="Notes (Optional)"
          value={notes}
          onChangeText={setNotes}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="Any special requests or information..."
        />

        <Divider style={styles.divider} />

        <View style={styles.summary}>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Booking Summary
          </Text>
          <View style={styles.summaryRow}>
            <Text variant="bodyMedium">Service Fee:</Text>
            <Text variant="bodyMedium" style={styles.price}>$50.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text variant="bodyMedium">Service Charge:</Text>
            <Text variant="bodyMedium" style={styles.price}>$5.00</Text>
          </View>
          <Divider style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text variant="titleMedium" style={styles.bold}>Total:</Text>
            <Text variant="titleMedium" style={[styles.price, styles.bold]}>$55.00</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleBooking}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Confirm Booking
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  header: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  summary: {
    marginTop: 8,
  },
  summaryTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryDivider: {
    marginVertical: 8,
  },
  price: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default BookingScreen;
