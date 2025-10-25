import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, useTheme, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { BookScreenProps } from '../../types/navigation';

type Props = BookScreenProps<'BookingConfirmation'>;

const BookingConfirmationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bookingId } = route.params;
  const theme = useTheme();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Surface style={styles.surface} elevation={2}>
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={80} color={theme.colors.primary} />
        </View>

        <Text variant="displaySmall" style={styles.title}>
          Booking Confirmed!
        </Text>

        <Text variant="bodyLarge" style={styles.message}>
          Your booking has been successfully confirmed.
        </Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Booking ID:</Text>
            <Text variant="bodyMedium" style={styles.value}>{bookingId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Status:</Text>
            <Text variant="bodyMedium" style={[styles.value, { color: theme.colors.primary }]}>
              Confirmed
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text variant="bodyMedium" style={styles.label}>Date:</Text>
            <Text variant="bodyMedium" style={styles.value}>To be scheduled</Text>
          </View>
        </View>

        <Text variant="bodyMedium" style={styles.info}>
          A confirmation email has been sent to your registered email address.
          The service provider will contact you shortly.
        </Text>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('ServiceList')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Back to Services
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate('ProfileTab', { screen: 'MyBookings' })}
          style={styles.button}
        >
          View My Bookings
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
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  message: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  details: {
    width: '100%',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    opacity: 0.7,
  },
  value: {
    fontWeight: '600',
  },
  info: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default BookingConfirmationScreen;
