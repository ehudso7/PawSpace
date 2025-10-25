import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Chip, useTheme } from 'react-native-paper';
import type { ProfileScreenProps } from '../../types/navigation';

type Props = ProfileScreenProps<'MyBookings'>;

const MyBookingsScreen: React.FC<Props> = () => {
  const theme = useTheme();

  const bookings = [
    {
      id: '1',
      service: 'Dog Walking',
      date: '2024-03-15',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: '2',
      service: 'Pet Grooming',
      date: '2024-03-18',
      time: '2:00 PM',
      status: 'pending',
    },
    {
      id: '3',
      service: 'Veterinary Care',
      date: '2024-03-10',
      time: '11:30 AM',
      status: 'completed',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.primary;
      case 'pending':
        return '#FFA500';
      case 'completed':
        return '#4CAF50';
      default:
        return theme.colors.onSurface;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.header}>
          My Bookings
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          View and manage your service bookings
        </Text>

        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No bookings yet
            </Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} style={styles.card} mode="elevated">
              <Card.Title
                title={booking.service}
                subtitle={`${booking.date} at ${booking.time}`}
                right={() => (
                  <Chip
                    style={[styles.statusChip, { backgroundColor: getStatusColor(booking.status) }]}
                    textStyle={styles.statusText}
                  >
                    {booking.status.toUpperCase()}
                  </Chip>
                )}
              />
              <Card.Content>
                <Text variant="bodyMedium">
                  Booking ID: {booking.id}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 24,
    opacity: 0.7,
  },
  card: {
    marginBottom: 16,
  },
  statusChip: {
    marginRight: 16,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.5,
  },
});

export default MyBookingsScreen;
