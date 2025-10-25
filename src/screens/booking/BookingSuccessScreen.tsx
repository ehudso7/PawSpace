import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Booking } from '../../types/booking';

interface RouteParams {
  booking: Booking;
}

const { width } = Dimensions.get('window');

const BookingSuccessScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking } = route.params as RouteParams;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate checkmark
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleViewBooking = () => {
    navigation.navigate('BookingDetail', { bookingId: booking.id });
  };

  const handleBookAnother = () => {
    navigation.navigate('ServiceList');
  };

  const handleShare = async () => {
    try {
      const message = `I just booked ${booking.service.name} with ${booking.provider.business_name} for ${new Date(booking.appointment_time).toLocaleDateString()}. Booking ID: ${booking.id}`;
      
      await Share.share({
        message,
        title: 'Booking Confirmation',
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share booking details');
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const { date, time } = formatDateTime(booking.appointment_time);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Animation */}
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={120} color="#4CAF50" />
          </Animated.View>
        </View>

        {/* Success Message */}
        <Animated.View
          style={[
            styles.messageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your appointment has been successfully booked
          </Text>
        </Animated.View>

        {/* Booking Details Card */}
        <Animated.View
          style={[
            styles.bookingCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle}>Booking Details</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Confirmed</Text>
            </View>
          </View>

          <View style={styles.bookingInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{time}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="business-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{booking.provider.business_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="paw-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{booking.service.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{booking.provider.location.address}</Text>
            </View>
          </View>

          <View style={styles.bookingIdContainer}>
            <Text style={styles.bookingIdLabel}>Booking ID</Text>
            <Text style={styles.bookingId}>{booking.id}</Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.primaryButton} onPress={handleViewBooking}>
            <Ionicons name="eye-outline" size={20} color="white" />
            <Text style={styles.primaryButtonText}>View Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleBookAnother}>
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Book Another</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#666" />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Next Steps */}
        <Animated.View
          style={[
            styles.nextStepsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>
              You'll receive a confirmation email with all the details
            </Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>
              The provider will contact you 24 hours before the appointment
            </Text>
          </View>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>
              Check in with the QR code when you arrive
            </Text>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animationContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  checkmarkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  bookingInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  bookingIdContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  bookingIdLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  nextStepsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  stepText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
});

export default BookingSuccessScreen;