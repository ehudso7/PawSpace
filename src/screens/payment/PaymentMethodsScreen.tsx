import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import { theme } from '@/constants/theme';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    // Mock data - replace with actual API call
  ]);

  const handleAddCard = () => {
    Alert.alert('Add Payment Method', 'Payment method integration will be available soon.', [
      { text: 'OK' },
    ]);
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleRemove = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Payment Methods</Text>
        <Text style={styles.subtitle}>Manage your payment methods</Text>

        {paymentMethods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No payment methods added yet</Text>
            <Text style={styles.emptySubtext}>Add a payment method to get started</Text>
          </View>
        ) : (
          <View style={styles.methodsList}>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.methodCard}>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodType}>
                    {method.type === 'card' ? '??' : method.type === 'apple_pay' ? '??' : 'G'} Card
                  </Text>
                  {method.last4 && (
                    <Text style={styles.methodDetails}>
                      {method.brand} ???? {method.last4}
                    </Text>
                  )}
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <View style={styles.methodActions}>
                  {!method.isDefault && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(method.id)}
                    >
                      <Text style={styles.actionText}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() => handleRemove(method.id)}
                  >
                    <Text style={[styles.actionText, styles.removeText]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <Button
          title="Add Payment Method"
          onPress={handleAddCard}
          style={styles.addButton}
        />
      </ScrollView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  methodsList: {
    marginBottom: 24,
  },
  methodCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  methodInfo: {
    marginBottom: 12,
  },
  methodType: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  methodDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.successBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.success,
  },
  methodActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: theme.colors.lightGray,
  },
  removeButton: {
    backgroundColor: theme.colors.errorBackground,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  removeText: {
    color: theme.colors.error,
  },
  addButton: {
    marginTop: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});