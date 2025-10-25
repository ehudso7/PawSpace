import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import type { Booking, CreateBookingData, Pet, ProviderProfile, Service } from '../../types';
import { ServiceSummaryCard } from '../../components/booking/ServiceSummaryCard';
import { formatCurrency } from '../../utils/format';
import { PLATFORM_FEE_PERCENT } from '../../config';
import { getMyPets, getSavedPaymentMethodSummary } from '../../services/user';
import { initializeStripe, createPaymentIntent, presentPaymentSheet } from '../../services/stripe';
import { createBooking } from '../../services/bookings';

interface RouteParams {
  service: Service;
  provider: ProviderProfile;
  appointmentTime: string; // ISO
  duration: number; // minutes
}

interface Props {
  route: { params: RouteParams };
  navigation: any;
}

export const BookingConfirmScreen: React.FC<Props> = ({ route, navigation }) => {
  const { service, provider, appointmentTime, duration } = route.params;
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string | undefined>();
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<{ label: string } | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const platformFee = useMemo(() => Math.round(service.price * PLATFORM_FEE_PERCENT), [service.price]);
  const total = useMemo(() => service.price + platformFee, [service.price, platformFee]);

  useEffect(() => {
    initializeStripe().catch(() => {});
    getMyPets().then(setPets).catch(() => setPets([]));
    getSavedPaymentMethodSummary().then(setPaymentMethod).catch(() => setPaymentMethod(null));
  }, []);

  const onConfirmPay = async () => {
    if (!agreeTerms) {
      Alert.alert('Terms Required', 'Please agree to the cancellation policy to continue.');
      return;
    }
    if (notes.length > 500) {
      Alert.alert('Too Long', 'Special instructions must be 500 characters or fewer.');
      return;
    }
    setLoading(true);
    try {
      const bookingMeta = { serviceId: service.id, providerId: provider.id, appointmentTime };
      const intent = await createPaymentIntent(total, bookingMeta);
      const payment = await presentPaymentSheet(intent);
      if (payment.status !== 'succeeded') {
        if (payment.status !== 'canceled') Alert.alert('Payment Failed', payment.errorMessage || 'Please try again.');
        setLoading(false);
        return;
      }

      const data: CreateBookingData = {
        service_id: service.id,
        appointment_time: appointmentTime,
        pet_id: selectedPetId,
        notes,
        payment_method_id: 'payment_sheet',
      };
      const booking: Booking = await createBooking(data);
      setLoading(false);
      navigation.replace('BookingSuccess', { bookingId: booking.id, reference: booking.id });
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Error', e?.message || 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Service Summary */}
        <ServiceSummaryCard provider={provider} service={service} appointmentTime={appointmentTime} duration={duration} address={service.location_address} />

        {/* Pet Selection */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pet</Text>
          {pets.length > 0 ? (
            <View style={styles.dropdown}>
              {pets.map(p => (
                <TouchableOpacity key={p.id} style={[styles.dropdownItem, selectedPetId === p.id && styles.dropdownItemSelected]} onPress={() => setSelectedPetId(p.id)}>
                  <Text style={styles.dropdownText}>{p.name}{p.breed ? ` • ${p.breed}` : ''}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('AddPet')} style={styles.linkRow}>
              <Text style={styles.link}>Add pet</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Special Instructions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes to provider"
            multiline
            maxLength={500}
          />
          <Text style={styles.charCount}>{notes.length}/500</Text>
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Price</Text>
          <View style={styles.row}><Text style={styles.label}>Service</Text><Text style={styles.value}>{formatCurrency(service.price)}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Platform fee</Text><Text style={styles.value}>{formatCurrency(platformFee)}</Text></View>
          <View style={[styles.row, styles.totalRow]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatCurrency(total)}</Text></View>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethod ? (
            <View style={styles.row}><Text style={styles.value}>{paymentMethod.label}</Text></View>
          ) : (
            <Text style={styles.label}>No saved card</Text>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('PaymentMethods')} style={styles.linkRow}>
            <Text style={styles.link}>Change payment method</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <TouchableOpacity style={[styles.card, styles.checkboxRow]} onPress={() => setAgreeTerms(!agreeTerms)}>
          <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>I agree to cancellation policy</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.cta, (!agreeTerms || loading) && styles.ctaDisabled]} disabled={!agreeTerms || loading} onPress={onConfirmPay}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.ctaText}>Confirm & Pay {formatCurrency(total)}</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  content: { padding: 16, paddingBottom: 120 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  label: { color: '#6B7280' },
  value: { color: '#111827', fontWeight: '500' },
  textArea: { minHeight: 100, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, textAlignVertical: 'top' },
  charCount: { alignSelf: 'flex-end', color: '#6B7280', marginTop: 4 },
  dropdown: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 },
  dropdownItem: { padding: 12 },
  dropdownItemSelected: { backgroundColor: '#F3F4F6' },
  dropdownText: { color: '#111827' },
  linkRow: { marginTop: 8 },
  link: { color: '#2563EB', fontWeight: '600' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#D1D5DB', marginRight: 8 },
  checkboxChecked: { backgroundColor: '#10B981', borderColor: '#10B981' },
  checkboxLabel: { color: '#111827' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  cta: { backgroundColor: '#111827', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  ctaDisabled: { opacity: 0.7 },
  ctaText: { color: 'white', fontWeight: '700' },
});

export default BookingConfirmScreen;
