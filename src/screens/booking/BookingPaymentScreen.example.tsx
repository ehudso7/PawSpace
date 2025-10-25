/**
 * Example: Booking Payment Flow
 * Shows how to process marketplace payments
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import stripeService from '../services/stripe';

interface BookingPaymentScreenProps {
  booking: {
    id: string;
    provider: {
      id: string;
      name: string;
      stripeAccountId: string;
    };
    service: {
      name: string;
      price: number;
    };
    date: string;
    time: string;
  };
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
}

export const BookingPaymentScreen: React.FC<BookingPaymentScreenProps> = ({
  booking,
  onPaymentSuccess,
  onPaymentCancel,
}) => {
  const [processing, setProcessing] = useState(false);

  const calculateFees = () => {
    const subtotal = booking.service.price;
    const platformFee = subtotal * 0.10; // 10% commission
    const total = subtotal;

    return {
      subtotal,
      platformFee,
      total,
    };
  };

  const fees = calculateFees();

  const handlePayment = async () => {
    try {
      setProcessing(true);

      const result = await stripeService.processBookingPayment({
        amount: fees.total,
        providerId: booking.provider.stripeAccountId,
        providerName: booking.provider.name,
        bookingId: booking.id,
      });

      Alert.alert(
        'Payment Successful!',
        'Your booking has been confirmed. You will receive a confirmation email shortly.',
        [
          {
            text: 'OK',
            onPress: onPaymentSuccess,
          },
        ]
      );
    } catch (error) {
      console.error('Payment error:', error);
      
      Alert.alert(
        'Payment Failed',
        error instanceof Error ? error.message : 'Unable to process payment. Please try again.',
        [
          { text: 'Cancel', style: 'cancel', onPress: onPaymentCancel },
          { text: 'Retry', onPress: handlePayment },
        ]
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Booking Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Booking Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service:</Text>
          <Text style={styles.summaryValue}>{booking.service.name}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Provider:</Text>
          <Text style={styles.summaryValue}>{booking.provider.name}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Date:</Text>
          <Text style={styles.summaryValue}>{booking.date}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Time:</Text>
          <Text style={styles.summaryValue}>{booking.time}</Text>
        </View>
      </View>

      {/* Payment Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Details</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Service Price:</Text>
          <Text style={styles.priceValue}>${fees.subtotal.toFixed(2)}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.feeLabel}>
            Platform Fee (10%):
          </Text>
          <Text style={styles.feeValue}>
            ${fees.platformFee.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${fees.total.toFixed(2)}</Text>
        </View>

        <Text style={styles.note}>
          The platform fee helps us maintain and improve PawSpace.
        </Text>
      </View>

      {/* Payment Security */}
      <View style={styles.securityCard}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Secure payment processing powered by Stripe
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.payButtonText}>
                Pay ${fees.total.toFixed(2)}
              </Text>
              <Text style={styles.payButtonSubtext}>
                Confirm and Pay
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onPaymentCancel}
          disabled={processing}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  feeLabel: {
    fontSize: 14,
    color: '#666666',
  },
  feeValue: {
    fontSize: 14,
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A90E2',
  },
  note: {
    fontSize: 12,
    color: '#999999',
    fontStyle: 'italic',
    marginTop: 8,
  },
  securityCard: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  securityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
  },
  actions: {
    marginTop: 'auto',
  },
  payButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  payButtonSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default BookingPaymentScreen;
