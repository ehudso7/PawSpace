/**
 * Example: Provider Dashboard with Stripe Connect
 * Shows how to onboard providers and display earnings
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import providerOnboardingService from '../services/providerOnboarding';

interface ProviderDashboardProps {
  userId: string;
  userEmail: string;
  stripeAccountId?: string;
  stripeAccountVerified?: boolean;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  userId,
  userEmail,
  stripeAccountId,
  stripeAccountVerified,
}) => {
  const [loading, setLoading] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(!!stripeAccountVerified);

  const handleStartOnboarding = async () => {
    setLoading(true);

    await providerOnboardingService.startOnboarding({
      userId,
      email: userEmail,
      country: 'US',
      onSuccess: () => {
        Alert.alert(
          'Success!',
          'Please complete the onboarding process to start receiving payments.',
          [{ text: 'OK' }]
        );
      },
      onError: (error) => {
        Alert.alert('Error', error.message);
      },
    });

    setLoading(false);
  };

  const handleViewDashboard = async () => {
    const dashboardUrl = await providerOnboardingService.getDashboardLink(userId);
    if (dashboardUrl) {
      // Open Stripe dashboard
      console.log('Opening dashboard:', dashboardUrl);
    }
  };

  if (!stripeAccountId) {
    return (
      <View style={styles.container}>
        <View style={styles.onboardingCard}>
          <Text style={styles.icon}>💳</Text>
          <Text style={styles.title}>Set Up Payments</Text>
          <Text style={styles.description}>
            Connect your bank account to start receiving payments from customers.
          </Text>

          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Receive payments instantly</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Secure payment processing</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Automatic tax reporting</Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>Weekly payouts</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.onboardButton}
            onPress={handleStartOnboarding}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.onboardButtonText}>
                Connect Bank Account
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.note}>
            Powered by Stripe • Takes 2-3 minutes
          </Text>
        </View>
      </View>
    );
  }

  if (!stripeAccountVerified) {
    return (
      <View style={styles.container}>
        <View style={styles.pendingCard}>
          <Text style={styles.icon}>⏳</Text>
          <Text style={styles.title}>Verification Pending</Text>
          <Text style={styles.description}>
            Your account is being verified. This usually takes 1-2 business days.
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleStartOnboarding}
          >
            <Text style={styles.secondaryButtonText}>
              Complete Onboarding
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Provider Dashboard</Text>
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedBadgeText}>✓ Verified</Text>
        </View>
      </View>

      {/* Earnings Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Earnings Summary</Text>
        <Text style={styles.earningsAmount}>$1,234.56</Text>
        <Text style={styles.earningsLabel}>Total Earnings</Text>

        <View style={styles.earningsBreakdown}>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsValue}>$567.89</Text>
            <Text style={styles.earningsItemLabel}>This Month</Text>
          </View>
          <View style={styles.earningsItem}>
            <Text style={styles.earningsValue}>$123.45</Text>
            <Text style={styles.earningsItemLabel}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Recent Bookings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Bookings</Text>
        {/* Add booking list here */}
        <Text style={styles.placeholderText}>No recent bookings</Text>
      </View>

      {/* Payment Settings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Settings</Text>
        
        <TouchableOpacity 
          style={styles.settingItem}
          onPress={handleViewDashboard}
        >
          <Text style={styles.settingItemText}>View Stripe Dashboard</Text>
          <Text style={styles.settingItemIcon}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingItemText}>Payout Schedule</Text>
          <Text style={styles.settingItemIcon}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingItemText}>Bank Account</Text>
          <Text style={styles.settingItemIcon}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  onboardingCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pendingCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  benefitsList: {
    width: '100%',
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIcon: {
    fontSize: 20,
    color: '#22C55E',
    marginRight: 12,
    width: 24,
  },
  benefitText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  onboardButton: {
    backgroundColor: '#4A90E2',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  onboardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  note: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  verifiedBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  earningsBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  earningsItem: {
    alignItems: 'center',
  },
  earningsValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  earningsItemLabel: {
    fontSize: 14,
    color: '#666666',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  settingItemIcon: {
    fontSize: 20,
    color: '#999999',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default ProviderDashboard;
