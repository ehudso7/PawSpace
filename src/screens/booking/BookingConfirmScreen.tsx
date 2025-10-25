import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  BookingConfirmScreenNavigationProp,
  BookingConfirmScreenRouteProp,
} from '../../types/navigation';
import {Pet, PaymentMethod, BookingData} from '../../types/booking';
import Button from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import bookingService from '../../services/booking';
import stripeService from '../../services/stripe';

const BookingConfirmScreen: React.FC = () => {
  const navigation = useNavigation<BookingConfirmScreenNavigationProp>();
  const route = useRoute<BookingConfirmScreenRouteProp>();
  const {service, provider, appointmentTime} = route.params;

  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);

  const platformFee = bookingService.calculatePlatformFee(service.price);
  const totalPrice = bookingService.calculateTotalPrice(service.price);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [petsData, paymentMethodsData] = await Promise.all([
        bookingService.getUserPets(),
        stripeService.getSavedPaymentMethods(),
      ]);

      setPets(petsData);
      setPaymentMethods(paymentMethodsData);

      // Auto-select first pet and payment method if available
      if (petsData.length > 0) {
        setSelectedPetId(petsData[0].id);
      }
      if (paymentMethodsData.length > 0) {
        setSelectedPaymentMethod(paymentMethodsData.find(pm => pm.is_default) || paymentMethodsData[0]);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert('Error', 'Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      const newPaymentMethod = await stripeService.addPaymentMethod();
      if (newPaymentMethod) {
        setPaymentMethods([...paymentMethods, newPaymentMethod]);
        setSelectedPaymentMethod(newPaymentMethod);
      }
    } catch (error) {
      console.error('Error adding payment method:', error);
      Alert.alert('Error', 'Failed to add payment method');
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Payment Required', 'Please select a payment method');
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Terms Required', 'Please agree to the cancellation policy');
      return;
    }

    try {
      setProcessing(true);

      // Prepare booking data
      const bookingData: BookingData = {
        service,
        provider,
        appointment_time: appointmentTime,
        duration: service.duration,
        pet_id: selectedPetId || undefined,
        notes: notes.trim() || undefined,
        total_price: totalPrice,
        platform_fee: platformFee,
      };

      // Create payment intent
      const paymentIntent = await stripeService.createPaymentIntent(totalPrice, bookingData);

      // Present payment sheet
      const paymentResult = await stripeService.presentPaymentSheet(paymentIntent);

      if (paymentResult.error) {
        Alert.alert('Payment Failed', paymentResult.error.message);
        return;
      }

      // Create booking in database
      const booking = await bookingService.createBooking({
        service_id: service.id,
        appointment_time: appointmentTime,
        pet_id: selectedPetId || undefined,
        notes: notes.trim() || undefined,
        payment_method_id: selectedPaymentMethod.id,
      });

      // Navigate to success screen
      navigation.navigate('BookingSuccess', {booking});
    } catch (error) {
      console.error('Error confirming booking:', error);
      Alert.alert('Booking Failed', 'Failed to confirm booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const renderServiceSummary = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Service Summary</Text>
      
      <View style={styles.providerInfo}>
        <Image
          source={{uri: provider.avatar || 'https://via.placeholder.com/50'}}
          style={styles.providerAvatar}
        />
        <View style={styles.providerDetails}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{provider.rating.toFixed(1)} ({provider.review_count} reviews)</Text>
          </View>
        </View>
      </View>

      <View style={styles.serviceDetails}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.serviceType}>{service.type}</Text>
        <Text style={styles.dateTime}>{bookingService.formatBookingTime(appointmentTime)}</Text>
        <Text style={styles.duration}>Duration: {bookingService.formatDuration(service.duration)}</Text>
        <Text style={styles.location}>{service.location}</Text>
      </View>
    </View>
  );

  const renderPetSelection = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Select Pet</Text>
      
      {pets.length === 0 ? (
        <TouchableOpacity style={styles.addPetButton}>
          <Icon name="add" size={24} color="#007AFF" />
          <Text style={styles.addPetText}>Add a pet</Text>
        </TouchableOpacity>
      ) : (
        <View>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.petOption,
                selectedPetId === pet.id && styles.selectedPetOption,
              ]}
              onPress={() => setSelectedPetId(pet.id)}>
              <Image
                source={{uri: pet.avatar || 'https://via.placeholder.com/40'}}
                style={styles.petAvatar}
              />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petDetails}>{pet.breed} • {pet.species}</Text>
              </View>
              {selectedPetId === pet.id && (
                <Icon name="check-circle" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderSpecialInstructions = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Special Instructions</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Any special instructions for the provider..."
        value={notes}
        onChangeText={setNotes}
        multiline
        maxLength={500}
        textAlignVertical="top"
      />
      <Text style={styles.characterCount}>{notes.length}/500</Text>
    </View>
  );

  const renderPriceBreakdown = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Price Breakdown</Text>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Service</Text>
        <Text style={styles.priceValue}>${service.price.toFixed(2)}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Platform fee (10%)</Text>
        <Text style={styles.priceValue}>${platformFee.toFixed(2)}</Text>
      </View>
      
      <View style={[styles.priceRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderPaymentMethod = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Payment Method</Text>
      
      {selectedPaymentMethod ? (
        <View style={styles.paymentMethodContainer}>
          <View style={styles.paymentMethodInfo}>
            <Icon name="credit-card" size={24} color="#666" />
            <Text style={styles.paymentMethodText}>
              {stripeService.formatPaymentMethodDisplay(selectedPaymentMethod)}
            </Text>
          </View>
          <TouchableOpacity onPress={handleAddPaymentMethod}>
            <Text style={styles.changePaymentText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Button
          title="Add Payment Method"
          onPress={handleAddPaymentMethod}
          variant="outline"
        />
      )}
    </View>
  );

  const renderTermsCheckbox = () => (
    <TouchableOpacity
      style={styles.termsContainer}
      onPress={() => setAgreeToTerms(!agreeToTerms)}>
      <Icon
        name={agreeToTerms ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color="#007AFF"
      />
      <Text style={styles.termsText}>
        I agree to the cancellation policy
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <LoadingSpinner message="Loading booking details..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderServiceSummary()}
        {renderPetSelection()}
        {renderSpecialInstructions()}
        {renderPriceBreakdown()}
        {renderPaymentMethod()}
        {renderTermsCheckbox()}
      </ScrollView>
      
      <View style={styles.bottomContainer}>
        <Button
          title={`Confirm & Pay $${totalPrice.toFixed(2)}`}
          onPress={handleConfirmBooking}
          loading={processing}
          disabled={!selectedPaymentMethod || !agreeToTerms}
          size="large"
          style={styles.confirmButton}
        />
      </View>
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
    color: '#1C1C1E',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  serviceDetails: {},
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  serviceType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  dateTime: {
    fontSize: 14,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  addPetText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  petOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPetOption: {
    backgroundColor: '#E3F2FD',
  },
  petAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  petDetails: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  priceValue: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
  },
  changePaymentText: {
    fontSize: 16,
    color: '#007AFF',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
  },
  termsText: {
    fontSize: 16,
    color: '#1C1C1E',
    marginLeft: 12,
    flex: 1,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  confirmButton: {
    width: '100%',
  },
});

export default BookingConfirmScreen;
