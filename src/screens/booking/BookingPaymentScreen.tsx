import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { usePayment } from '../../hooks/usePayment';
import { useSubscription } from '../../hooks/useSubscription';
import PaymentButton from '../../components/PaymentButton';
import LoadingOverlay from '../../components/LoadingOverlay';
import { BookingPaymentData } from '../../types/stripe';

interface BookingPaymentScreenProps {
  bookingData: BookingPaymentData;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
}

const BookingPaymentScreen: React.FC<BookingPaymentScreenProps> = ({
  bookingData,
  onPaymentSuccess,
  onPaymentCancel,
}) => {
  const { processing, error, processBookingPayment, clearError } = usePayment();
  const { checkFeatureAccess, showUpgradePrompt } = useSubscription();

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError();
  }, [clearError]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Check if user has access to booking feature (if it requires premium)
      if (!checkFeatureAccess('create_transformation')) {
        showUpgradePrompt('Book premium services');
        return;
      }

      const result = await processBookingPayment(bookingData);
      
      if (result?.success) {
        onPaymentSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      Alert.alert(
        'Payment Error',
        'An error occurred while processing your payment. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Confirm Payment</Text>
          <Text style={styles.subtitle}>Review your booking details</Text>
        </View>

        {/* Booking Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Booking Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provider</Text>
            <Text style={styles.detailValue}>{bookingData.providerName}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>{formatAmount(bookingData.amount)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailValue}>{bookingData.bookingId}</Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Payment Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>{formatAmount(bookingData.amount)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee (10%)</Text>
            <Text style={styles.summaryValue}>
              {formatAmount(bookingData.amount * 0.10)}
            </Text>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatAmount(bookingData.amount * 1.10)}
            </Text>
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Payment Buttons */}
        <View style={styles.buttonContainer}>
          <PaymentButton
            title="Cancel"
            variant="secondary"
            onPress={onPaymentCancel}
            disabled={processing || isProcessing}
            style={styles.cancelButton}
          />
          
          <PaymentButton
            title={`Pay ${formatAmount(bookingData.amount * 1.10)}`}
            variant="primary"
            onPress={handlePayment}
            loading={processing || isProcessing}
            disabled={processing || isProcessing}
            style={styles.payButton}
          />
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityText}>
            🔒 Your payment information is secure and encrypted. 
            We use Stripe for secure payment processing.
          </Text>
        </View>
      </ScrollView>

      <LoadingOverlay
        visible={processing || isProcessing}
        message={processing ? 'Processing payment...' : 'Preparing payment...'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  detailsCard: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  summaryCard: {
    margin: 20,
    marginTop: 10,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  errorContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderColor: '#f44336',
    borderWidth: 1,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    margin: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  payButton: {
    flex: 2,
  },
  securityNotice: {
    margin: 20,
    padding: 16,
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  securityText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default BookingPaymentScreen;