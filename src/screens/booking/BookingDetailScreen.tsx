import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  BookingDetailScreenNavigationProp,
  BookingDetailScreenRouteProp,
} from '../../types/navigation';
import {Booking} from '../../types/booking';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import bookingService from '../../services/booking';

const BookingDetailScreen: React.FC = () => {
  const navigation = useNavigation<BookingDetailScreenNavigationProp>();
  const route = useRoute<BookingDetailScreenRouteProp>();
  const {bookingId} = route.params;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showQRCode, setShowQRCode] = useState<boolean>(false);

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      setLoading(true);
      const bookingData = await bookingService.getBookingById(bookingId);
      setBooking(bookingData);
    } catch (error) {
      console.error('Error loading booking details:', error);
      Alert.alert('Error', 'Failed to load booking details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = () => {
    if (!booking) return;

    const address = encodeURIComponent(booking.service.location);
    const url = `https://maps.google.com/maps?daddr=${address}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open maps application');
    });
  };

  const handleContactProvider = () => {
    if (!booking) return;

    Alert.alert(
      'Contact Provider',
      `Contact ${booking.provider.name}`,
      [
        {
          text: 'Call',
          onPress: () => {
            if (booking.provider.phone) {
              Linking.openURL(`tel:${booking.provider.phone}`);
            } else {
              Alert.alert('Error', 'Phone number not available');
            }
          },
        },
        {
          text: 'Message',
          onPress: () => {
            // Navigate to chat screen
            console.log('Navigate to chat with provider');
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ]
    );
  };

  const handleCancelBooking = () => {
    if (!booking) return;

    if (!bookingService.canCancelBooking(booking)) {
      Alert.alert(
        'Cannot Cancel',
        'Bookings can only be cancelled more than 24 hours before the appointment time.'
      );
      return;
    }

    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: showCancellationReasons,
        },
      ]
    );
  };

  const showCancellationReasons = () => {
    const reasons = [
      'Change of plans',
      'Pet is unwell',
      'Provider unavailable',
      'Emergency',
      'Other',
    ];

    Alert.alert(
      'Cancellation Reason',
      'Please select a reason for cancellation:',
      reasons.map(reason => ({
        text: reason,
        onPress: () => confirmCancellation(reason),
      }))
    );
  };

  const confirmCancellation = async (reason: string) => {
    if (!booking) return;

    try {
      await bookingService.cancelBooking(booking.id, reason);
      Alert.alert('Success', 'Booking cancelled successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };

  const handleLeaveReview = () => {
    if (!booking) return;
    // Navigate to review screen
    console.log('Navigate to review screen');
  };

  const generateQRData = (): string => {
    if (!booking) return '';
    return JSON.stringify({
      bookingId: booking.id,
      providerId: booking.provider_id,
      clientId: booking.client_id,
      appointmentTime: booking.appointment_time,
    });
  };

  const renderBookingHeader = () => (
    <View style={styles.headerCard}>
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge,
          {backgroundColor: bookingService.getBookingStatusColor(booking!.status)}
        ]}>
          <Text style={styles.statusText}>
            {bookingService.getBookingStatusText(booking!.status)}
          </Text>
        </View>
        <Text style={styles.bookingId}>
          Booking #{booking!.id.slice(-8).toUpperCase()}
        </Text>
      </View>

      <View style={styles.providerSection}>
        <Image
          source={{uri: booking!.provider.avatar || 'https://via.placeholder.com/60'}}
          style={styles.providerAvatar}
        />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{booking!.provider.name}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>
              {booking!.provider.rating.toFixed(1)} ({booking!.provider.review_count} reviews)
            </Text>
          </View>
          {booking!.provider.verified && (
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={16} color="#4CAF50" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderServiceDetails = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Service Details</Text>
      
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{booking!.service.name}</Text>
        <Text style={styles.serviceType}>{booking!.service.type}</Text>
        <Text style={styles.serviceDescription}>{booking!.service.description}</Text>
      </View>

      <View style={styles.detailsGrid}>
        <View style={styles.detailItem}>
          <Icon name="schedule" size={20} color="#666" />
          <Text style={styles.detailLabel}>Date & Time</Text>
          <Text style={styles.detailValue}>
            {bookingService.formatBookingTime(booking!.appointment_time)}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="access-time" size={20} color="#666" />
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>
            {bookingService.formatDuration(booking!.duration)}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="location-on" size={20} color="#666" />
          <Text style={styles.detailLabel}>Location</Text>
          <Text style={styles.detailValue}>{booking!.service.location}</Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="attach-money" size={20} color="#666" />
          <Text style={styles.detailLabel}>Total Paid</Text>
          <Text style={[styles.detailValue, styles.priceValue]}>
            ${booking!.total_price.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderPetInfo = () => {
    if (!booking!.pet) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pet Information</Text>
        
        <View style={styles.petInfo}>
          <Image
            source={{uri: booking!.pet.avatar || 'https://via.placeholder.com/50'}}
            style={styles.petAvatar}
          />
          <View style={styles.petDetails}>
            <Text style={styles.petName}>{booking!.pet.name}</Text>
            <Text style={styles.petBreed}>
              {booking!.pet.breed} • {booking!.pet.species}
            </Text>
            {booking!.pet.age && (
              <Text style={styles.petAge}>{booking!.pet.age} years old</Text>
            )}
          </View>
        </View>

        {booking!.pet.special_instructions && (
          <View style={styles.specialInstructions}>
            <Text style={styles.instructionsLabel}>Special Instructions:</Text>
            <Text style={styles.instructionsText}>
              {booking!.pet.special_instructions}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderNotesSection = () => {
    if (!booking!.notes) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notes to Provider</Text>
        <Text style={styles.notesText}>{booking!.notes}</Text>
      </View>
    );
  };

  const renderLocationMap = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Location</Text>
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.7749, // Default to San Francisco, replace with actual coordinates
            longitude: -122.4194,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{
              latitude: 37.7749,
              longitude: -122.4194,
            }}
            title={booking!.provider.name}
            description={booking!.service.location}
          />
        </MapView>
      </View>

      <Button
        title="Get Directions"
        onPress={handleGetDirections}
        variant="outline"
        style={styles.directionsButton}
      />
    </View>
  );

  const renderQRCode = () => (
    <View style={styles.card}>
      <View style={styles.qrHeader}>
        <Text style={styles.cardTitle}>Check-in QR Code</Text>
        <TouchableOpacity onPress={() => setShowQRCode(!showQRCode)}>
          <Icon
            name={showQRCode ? 'visibility-off' : 'visibility'}
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      </View>
      
      {showQRCode && (
        <View style={styles.qrContainer}>
          <QRCode
            value={generateQRData()}
            size={200}
            backgroundColor="white"
            color="black"
          />
          <Text style={styles.qrInstructions}>
            Show this QR code to your provider for easy check-in
          </Text>
        </View>
      )}
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionContainer}>
      <Button
        title="Contact Provider"
        onPress={handleContactProvider}
        variant="primary"
        style={styles.actionButton}
      />

      {bookingService.canCancelBooking(booking!) && (
        <Button
          title="Cancel Booking"
          onPress={handleCancelBooking}
          variant="outline"
          style={[styles.actionButton, styles.cancelButton]}
          textStyle={styles.cancelButtonText}
        />
      )}

      {bookingService.canLeaveReview(booking!) && (
        <Button
          title="Leave Review"
          onPress={handleLeaveReview}
          variant="secondary"
          style={styles.actionButton}
        />
      )}
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Loading booking details..." />;
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Booking not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderBookingHeader()}
        {renderServiceDetails()}
        {renderPetInfo()}
        {renderNotesSection()}
        {renderLocationMap()}
        {booking.status === 'confirmed' && renderQRCode()}
        {renderActionButtons()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bookingId: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  providerSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  serviceInfo: {
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    textAlign: 'right',
    flex: 1,
  },
  priceValue: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
  },
  petInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  petAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  petDetails: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  petAge: {
    fontSize: 14,
    color: '#666',
  },
  specialInstructions: {
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  instructionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  notesText: {
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 22,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  directionsButton: {
    alignSelf: 'flex-start',
  },
  qrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrInstructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  actionContainer: {
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    width: '100%',
  },
  cancelButton: {
    borderColor: '#F44336',
  },
  cancelButtonText: {
    color: '#F44336',
  },
});

export default BookingDetailScreen;