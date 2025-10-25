import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BookingData, Pet, PaymentIntent } from '../../types/booking';
import { createPaymentIntent, presentPaymentSheet } from '../../services/stripe';
import { createBooking } from '../../services/bookings';

interface RouteParams {
  bookingData: BookingData;
  pets: Pet[];
}

const BookingConfirmScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookingData, pets } = route.params as RouteParams;

  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);

  const platformFee = bookingData.total_price * 0.1;
  const totalAmount = bookingData.total_price + platformFee;

  useEffect(() => {
    loadSavedPaymentMethods();
  }, []);

  const loadSavedPaymentMethods = async () => {
    try {
      // Load saved payment methods
      // This would typically come from your backend
      setSavedPaymentMethods([]);
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const handleConfirmAndPay = async () => {
    if (!selectedPetId) {
      Alert.alert('Error', 'Please select a pet for this booking');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Error', 'Please agree to the cancellation policy');
      return;
    }

    setIsLoading(true);

    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent(totalAmount, {
        ...bookingData,
        pet_id: selectedPetId,
        notes,
      });

      // Present payment sheet
      const paymentResult = await presentPaymentSheet(paymentIntent);

      if (paymentResult.success && paymentResult.payment_intent_id) {
        // Create booking
        const booking = await createBooking({
          service_id: bookingData.service.id,
          appointment_time: bookingData.appointment_time,
          pet_id: selectedPetId,
          notes,
          payment_method_id: paymentResult.payment_intent_id,
        });

        // Navigate to success screen
        navigation.navigate('BookingSuccess', { booking });
      } else {
        Alert.alert('Payment Failed', paymentResult.error || 'Payment could not be processed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
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

  const { date, time } = formatDateTime(bookingData.appointment_time);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Booking</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Service Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Summary</Text>
          
          {/* Provider Info */}
          <View style={styles.providerInfo}>
            <Image
              source={{ uri: bookingData.provider.avatar || 'https://via.placeholder.com/50' }}
              style={styles.providerAvatar}
            />
            <View style={styles.providerDetails}>
              <Text style={styles.providerName}>{bookingData.provider.business_name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{bookingData.provider.rating.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>({bookingData.provider.review_count} reviews)</Text>
              </View>
            </View>
          </View>

          {/* Service Details */}
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>{bookingData.service.name}</Text>
            <Text style={styles.serviceType}>{bookingData.service.type}</Text>
            <Text style={styles.serviceDescription}>{bookingData.service.description}</Text>
          </View>

          {/* Date and Time */}
          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeItem}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateTimeText}>{date}</Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.dateTimeText}>{time}</Text>
            </View>
            <View style={styles.dateTimeItem}>
              <Ionicons name="hourglass-outline" size={20} color="#666" />
              <Text style={styles.dateTimeText}>{bookingData.duration} minutes</Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <Text style={styles.locationText}>{bookingData.provider.location.address}</Text>
          </View>
        </View>

        {/* Pet Selection */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Select Pet</Text>
          {pets.length > 0 ? (
            <View style={styles.petSelection}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.petOption,
                    selectedPetId === pet.id && styles.petOptionSelected,
                  ]}
                  onPress={() => setSelectedPetId(pet.id)}
                >
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petDetails}>
                      {pet.species} • {pet.breed || 'Mixed'}
                    </Text>
                  </View>
                  {selectedPetId === pet.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity style={styles.addPetButton}>
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.addPetText}>Add Pet</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Special Instructions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Special Instructions</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special notes for the provider..."
            value={notes}
            onChangeText={setNotes}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>{notes.length}/500</Text>
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Price</Text>
            <Text style={styles.priceValue}>${bookingData.total_price.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Platform Fee (10%)</Text>
            <Text style={styles.priceValue}>${platformFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Method</Text>
          {savedPaymentMethods.length > 0 ? (
            <View style={styles.paymentMethodContainer}>
              <View style={styles.paymentMethodInfo}>
                <Ionicons name="card" size={24} color="#666" />
                <Text style={styles.paymentMethodText}>
                  **** **** **** {selectedPaymentMethod?.last4 || '1234'}
                </Text>
              </View>
              <TouchableOpacity style={styles.changePaymentButton}>
                <Text style={styles.changePaymentText}>Change</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addPaymentButton}>
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.addPaymentText}>Add Payment Method</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Terms Checkbox */}
        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>cancellation policy</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, (!agreedToTerms || !selectedPetId) && styles.confirmButtonDisabled]}
          onPress={handleConfirmAndPay}
          disabled={!agreedToTerms || !selectedPetId || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.confirmButtonText}>
              Confirm & Pay ${totalAmount.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
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
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
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
  serviceDetails: {
    marginBottom: 16,
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
  dateTimeContainer: {
    marginBottom: 16,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  petSelection: {
    marginBottom: 8,
  },
  petOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  petOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  petDetails: {
    fontSize: 14,
    color: '#666',
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  addPetText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 16,
    color: '#333',
  },
  priceValue: {
    fontSize: 16,
    color: '#333',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  changePaymentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePaymentText: {
    fontSize: 16,
    color: '#007AFF',
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  addPaymentText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  termsContainer: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  termsLink: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  bottomContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});

export default BookingConfirmScreen;