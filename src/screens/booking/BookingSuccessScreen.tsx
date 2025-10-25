import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Share,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  BookingSuccessScreenNavigationProp,
  BookingSuccessScreenRouteProp,
} from '../../types/navigation';
import Button from '../../components/Button';
import bookingService from '../../services/booking';

const BookingSuccessScreen: React.FC = () => {
  const navigation = useNavigation<BookingSuccessScreenNavigationProp>();
  const route = useRoute<BookingSuccessScreenRouteProp>();
  const {booking} = route.params;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const handleViewBooking = () => {
    navigation.navigate('BookingDetail', {bookingId: booking.id});
  };

  const handleBookAnother = () => {
    navigation.navigate('ServiceList');
  };

  const handleShare = async () => {
    try {
      const message = `🐾 Booking Confirmed!\n\nService: ${booking.service.name}\nProvider: ${booking.provider.name}\nDate: ${bookingService.formatBookingTime(booking.appointment_time)}\nBooking ID: ${booking.id}\n\nBooked via PawSpace`;

      await Share.share({
        message,
        title: 'Booking Confirmation',
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share booking confirmation');
    }
  };

  const generateBookingReference = (bookingId: string): string => {
    // Generate a user-friendly booking reference
    return `PS${bookingId.slice(-8).toUpperCase()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Animation */}
        <Animated.View
          style={[
            styles.checkmarkContainer,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
            style={styles.checkmarkBackground}>
            <Icon name="check" size={60} color="#FFFFFF" />
          </Animatable.View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={[styles.messageContainer, {opacity: fadeAnim}]}>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your appointment has been successfully booked
          </Text>
        </Animated.View>

        {/* Booking Details */}
        <Animated.View style={[styles.detailsCard, {opacity: fadeAnim}]}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailValue}>{generateBookingReference(booking.id)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{booking.service.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provider</Text>
            <Text style={styles.detailValue}>{booking.provider.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {bookingService.formatBookingTime(booking.appointment_time)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>
              {bookingService.formatDuration(booking.duration)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Paid</Text>
            <Text style={[styles.detailValue, styles.priceValue]}>
              ${booking.total_price.toFixed(2)}
            </Text>
          </View>

          {booking.pet && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pet</Text>
              <Text style={styles.detailValue}>{booking.pet.name}</Text>
            </View>
          )}
        </Animated.View>

        {/* Confirmation Message */}
        <Animated.View style={[styles.confirmationContainer, {opacity: fadeAnim}]}>
          <View style={styles.infoRow}>
            <Icon name="info" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              You'll receive a confirmation email shortly. The provider will contact you to confirm the appointment details.
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Action Buttons */}
      <Animated.View style={[styles.buttonContainer, {opacity: fadeAnim}]}>
        <Button
          title="View Booking"
          onPress={handleViewBooking}
          variant="primary"
          size="large"
          style={styles.primaryButton}
        />

        <View style={styles.secondaryButtons}>
          <Button
            title="Book Another"
            onPress={handleBookAnother}
            variant="outline"
            size="medium"
            style={styles.secondaryButton}
          />

          <Button
            title="Share"
            onPress={handleShare}
            variant="secondary"
            size="medium"
            style={styles.secondaryButton}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  checkmarkContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  checkmarkBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    textAlign: 'right',
  },
  priceValue: {
    color: '#4CAF50',
    fontSize: 18,
  },
  confirmationContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 0,
  },
  primaryButton: {
    marginBottom: 16,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default BookingSuccessScreen;