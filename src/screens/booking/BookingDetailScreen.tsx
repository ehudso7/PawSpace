import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Linking,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Booking } from '../../types/booking';
import { getBookingById, cancelBooking } from '../../services/bookings';

interface RouteParams {
  bookingId: string;
}

const BookingDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingId } = route.params as RouteParams;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await getBookingById(bookingId);
      setBooking(data);
    } catch (error) {
      console.error('Error loading booking:', error);
      Alert.alert('Error', 'Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = () => {
    if (!booking) return;

    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(booking.id, 'User requested cancellation');
              Alert.alert('Success', 'Booking has been cancelled');
              navigation.goBack();
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleGetDirections = () => {
    if (!booking) return;

    const { lat, lng } = booking.provider.location.coordinates;
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open maps app');
    });
  };

  const handleContactProvider = () => {
    if (!booking) return;

    // Navigate to chat with provider
    navigation.navigate('Chat', { 
      providerId: booking.provider.id,
      bookingId: booking.id 
    });
  };

  const handleShareBooking = async () => {
    if (!booking) return;

    try {
      const message = `Check out my booking with ${booking.provider.business_name} for ${booking.service.name} on ${new Date(booking.appointment_time).toLocaleDateString()}. Booking ID: ${booking.id}`;
      
      await Share.share({
        message,
        title: 'Booking Details',
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share booking details');
    }
  };

  const handleLeaveReview = () => {
    if (!booking) return;

    // Navigate to review screen
    navigation.navigate('Review', { 
      bookingId: booking.id,
      providerId: booking.provider.id 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'completed':
        return '#2196F3';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading booking details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#F44336" />
          <Text style={styles.errorTitle}>Booking Not Found</Text>
          <Text style={styles.errorSubtitle}>
            The booking you're looking for doesn't exist or has been removed.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { date, time } = formatDateTime(booking.appointment_time);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Details</Text>
          <TouchableOpacity onPress={handleShareBooking}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
              <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
            </View>
            <Text style={styles.bookingId}>#{booking.id}</Text>
          </View>
          <Text style={styles.statusDescription}>
            {booking.status === 'confirmed' && 'Your booking is confirmed and ready to go!'}
            {booking.status === 'pending' && 'Your booking is being reviewed by the provider.'}
            {booking.status === 'completed' && 'This booking has been completed successfully.'}
            {booking.status === 'cancelled' && 'This booking has been cancelled.'}
          </Text>
        </View>

        {/* Service Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Information</Text>
          <View style={styles.serviceHeader}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{booking.service.name}</Text>
              <Text style={styles.serviceType}>{booking.service.type}</Text>
              <Text style={styles.serviceDescription}>{booking.service.description}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Total Price</Text>
              <Text style={styles.priceValue}>${booking.total_price.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Provider Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Provider Information</Text>
          <View style={styles.providerInfo}>
            <Image
              source={{ uri: booking.provider.avatar || 'https://via.placeholder.com/60' }}
              style={styles.providerAvatar}
            />
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>{booking.provider.business_name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{booking.provider.rating.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>({booking.provider.review_count} reviews)</Text>
              </View>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.locationText}>{booking.provider.location.address}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Appointment Details</Text>
          <View style={styles.appointmentInfo}>
            <View style={styles.appointmentItem}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <View style={styles.appointmentTextContainer}>
                <Text style={styles.appointmentLabel}>Date</Text>
                <Text style={styles.appointmentValue}>{date}</Text>
              </View>
            </View>
            <View style={styles.appointmentItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <View style={styles.appointmentTextContainer}>
                <Text style={styles.appointmentLabel}>Time</Text>
                <Text style={styles.appointmentValue}>{time}</Text>
              </View>
            </View>
            <View style={styles.appointmentItem}>
              <Ionicons name="hourglass-outline" size={20} color="#666" />
              <View style={styles.appointmentTextContainer}>
                <Text style={styles.appointmentLabel}>Duration</Text>
                <Text style={styles.appointmentValue}>{booking.duration} minutes</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pet Information */}
        {booking.pet && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pet Information</Text>
            <View style={styles.petInfo}>
              <Ionicons name="paw-outline" size={24} color="#666" />
              <View style={styles.petDetails}>
                <Text style={styles.petName}>{booking.pet.name}</Text>
                <Text style={styles.petBreed}>
                  {booking.pet.species} • {booking.pet.breed || 'Mixed'}
                </Text>
                {booking.pet.special_notes && (
                  <Text style={styles.petNotes}>{booking.pet.special_notes}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Special Instructions */}
        {booking.notes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Special Instructions</Text>
            <Text style={styles.notesText}>{booking.notes}</Text>
          </View>
        )}

        {/* Payment Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Information</Text>
          <View style={styles.paymentInfo}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Service Price</Text>
              <Text style={styles.paymentValue}>${(booking.total_price - booking.platform_fee).toFixed(2)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Platform Fee</Text>
              <Text style={styles.paymentValue}>${booking.platform_fee.toFixed(2)}</Text>
            </View>
            <View style={[styles.paymentRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>${booking.total_price.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentStatus}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.paymentStatusText}>Payment completed</Text>
            </View>
          </View>
        </View>

        {/* QR Code for Check-in */}
        {booking.status === 'confirmed' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Check-in QR Code</Text>
            <View style={styles.qrContainer}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code-outline" size={64} color="#666" />
                <Text style={styles.qrText}>QR Code will be available 24 hours before appointment</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {booking.status === 'confirmed' && (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={handleGetDirections}>
              <Ionicons name="navigate-outline" size={20} color="white" />
              <Text style={styles.primaryButtonText}>Get Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleContactProvider}>
              <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
              <Text style={styles.secondaryButtonText}>Contact Provider</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelBooking}>
              <Ionicons name="close-circle-outline" size={20} color="#F44336" />
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </>
        )}
        
        {booking.status === 'completed' && (
          <TouchableOpacity style={styles.primaryButton} onPress={handleLeaveReview}>
            <Ionicons name="star-outline" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Leave Review</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  bookingId: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  statusDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerDetails: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  appointmentInfo: {
    gap: 16,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTextContainer: {
    marginLeft: 12,
  },
  appointmentLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  appointmentValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petDetails: {
    marginLeft: 12,
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  petNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  paymentInfo: {
    gap: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    color: '#333',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  paymentStatusText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrPlaceholder: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  qrText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  actionContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
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
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
    marginLeft: 8,
  },
});

export default BookingDetailScreen;