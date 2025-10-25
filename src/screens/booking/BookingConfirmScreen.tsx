import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import type { BookingConfirmParams, PetSummary } from '../../types';
import { Avatar } from '../../components/Avatar';
import { RatingStars } from '../../components/RatingStars';
import { calculatePriceBreakdown } from '../../config/stripe';
import { formatCurrency } from '../../utils/currency';
import { createPaymentIntent, presentPaymentSheet } from '../../services/stripe';
import { createBooking } from '../../services/bookings';

interface Props {
  route: { params: BookingConfirmParams };
  navigation: any;
}

const characterLimit = 500;

export const BookingConfirmScreen: React.FC<Props> = ({ route, navigation }) => {
  const { service, provider, duration, dateTime, basePrice, currency = service.currency, location, pets = [] } = route.params;

  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(pets[0]?.id);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agree, setAgree] = useState(false);

  const prices = useMemo(() => calculatePriceBreakdown(basePrice), [basePrice]);

  const disabled = !agree || isSubmitting;

  async function onConfirmPay(): Promise<void> {
    if (disabled) return;
    setIsSubmitting(true);
    try {
      const intent = await createPaymentIntent(prices.total, {
        service_id: service.id,
        appointment_time: dateTime,
        pet_id: selectedPetId,
        notes: notes || undefined,
      });

      const paymentResult = await presentPaymentSheet(intent);
      if (!paymentResult.success) {
        throw new Error(paymentResult.errorMessage || 'Payment failed');
      }

      const booking = await createBooking({
        service_id: service.id,
        appointment_time: dateTime,
        pet_id: selectedPetId,
        notes: notes || undefined,
        payment_method_id: 'payment_sheet',
        payment_intent_id: paymentResult.paymentIntentId!,
      });

      navigation.replace('BookingSuccess', { bookingId: booking.id, ref: booking.payment_intent_id });
    } catch (err: any) {
      const message = err?.message || 'Something went wrong while processing your payment.';
      Alert.alert('Payment error', message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderPetSelector(): JSX.Element {
    if (pets.length === 0) {
      return (
        <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12 }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Pet</Text>
          <Text style={{ color: '#666', marginBottom: 8 }}>No pets found.</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddPet')} style={{ backgroundColor: '#007bff', padding: 12, borderRadius: 8 }}>
            <Text style={{ color: '#fff', textAlign: 'center' }}>Add pet</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 8 }}>Select pet</Text>
        <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' }}>
          {pets.map((p) => (
            <TouchableOpacity key={p.id} onPress={() => setSelectedPetId(p.id)} style={{ padding: 12, backgroundColor: selectedPetId === p.id ? '#eef6ff' : '#fff' }}>
              <Text>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7fb' }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Service Summary Card */}
        <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar uri={provider.avatar_url} name={provider.name} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700' }}>{provider.name}</Text>
              <RatingStars rating={provider.rating} />
            </View>
          </View>
          <View style={{ height: 12 }} />
          <Text style={{ fontWeight: '600' }}>{service.name}</Text>
          <Text style={{ color: '#666' }}>{service.type}</Text>
          <View style={{ height: 8 }} />
          <Text>{new Date(dateTime).toLocaleString()}</Text>
          <Text>{duration} min</Text>
          <Text numberOfLines={2} style={{ color: '#333' }}>{location}</Text>
        </View>

        {/* Pet Selection */}
        {renderPetSelector()}

        {/* Special Instructions */}
        <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12 }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Special instructions</Text>
          <TextInput
            value={notes}
            onChangeText={(t) => t.length <= characterLimit && setNotes(t)}
            placeholder="Notes to provider"
            multiline
            numberOfLines={4}
            style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, textAlignVertical: 'top' }}
          />
          <Text style={{ alignSelf: 'flex-end', color: '#666', marginTop: 4 }}>{notes.length}/{characterLimit}</Text>
        </View>

        {/* Price Breakdown */}
        <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12 }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Price</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
            <Text>Service</Text>
            <Text>{formatCurrency(basePrice, currency)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
            <Text>Platform fee (10%)</Text>
            <Text>{formatCurrency(prices.platformFee, currency)}</Text>
          </View>
          <View style={{ height: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '700' }}>Total</Text>
            <Text style={{ fontWeight: '700' }}>{formatCurrency(prices.total, currency)}</Text>
          </View>
        </View>

        {/* Payment Method (simple placeholder) */}
        <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12 }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Payment method</Text>
          <Text style={{ color: '#666', marginBottom: 8 }}>Using saved default payment method</Text>
          <TouchableOpacity onPress={() => navigation.navigate('PaymentMethods')} style={{ padding: 12, backgroundColor: '#f1f5f9', borderRadius: 8 }}>
            <Text>Change payment method</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <TouchableOpacity onPress={() => setAgree((a) => !a)} style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 20, height: 20, borderWidth: 1, borderColor: '#888', borderRadius: 4, backgroundColor: agree ? '#22c55e' : 'transparent' }} />
          <Text>I agree to cancellation policy</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' }}>
        <TouchableOpacity onPress={onConfirmPay} disabled={disabled} style={{ backgroundColor: disabled ? '#94a3b8' : '#22c55e', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}>
          {isSubmitting && <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />}
          <Text style={{ color: '#fff', fontWeight: '700' }}>Confirm & Pay {formatCurrency(prices.total, currency)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingConfirmScreen;
