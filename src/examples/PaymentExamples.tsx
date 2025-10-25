import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useSubscription } from '../hooks/useSubscription';
import { useFreemiumGating } from '../hooks/useFreemiumGating';
import stripeService from '../services/stripe';

// Example: Create Screen with freemium gating
export const CreateScreenExample: React.FC<{ userId: string }> = ({ userId }) => {
  const { checkFeatureAccess, showUpgradePrompt } = useSubscription(userId);

  const handleCreateTransformation = () => {
    if (!checkFeatureAccess('create_transformation')) {
      showUpgradePrompt('Create unlimited transformations');
      return;
    }

    // Continue with transformation creation
    Alert.alert('Success', 'Transformation created!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Transformation</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleCreateTransformation}
      >
        <Text style={styles.buttonText}>Create New Transformation</Text>
      </TouchableOpacity>
    </View>
  );
};

// Example: Booking payment flow
export const BookingPaymentExample: React.FC<{ userId: string }> = ({ userId }) => {
  const handleBookingPayment = async () => {
    try {
      const bookingData = {
        amount: 50.00, // $50.00
        providerId: 'acct_provider_stripe_account_id',
        providerName: 'Pet Sitter Pro',
        bookingId: 'booking_123',
        description: 'Dog walking service - 2 hours',
      };

      const result = await stripeService.processBookingPayment(bookingData);
      
      if (result.success) {
        Alert.alert('Payment Successful', 'Your booking has been confirmed!');
      }
    } catch (error) {
      Alert.alert('Payment Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Service</Text>
      <Text style={styles.subtitle}>Dog Walking - $50.00</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleBookingPayment}
      >
        <Text style={styles.buttonText}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

// Example: Provider onboarding
export const ProviderOnboardingExample: React.FC<{ 
  userId: string; 
  email: string; 
}> = ({ userId, email }) => {
  const handleProviderOnboarding = async () => {
    try {
      const result = await stripeService.onboardProvider(userId, email);
      
      // Open the onboarding URL in a webview or external browser
      Alert.alert(
        'Provider Onboarding',
        'Complete your provider setup to start receiving payments.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Continue Setup',
            onPress: () => {
              // Open result.onboardingUrl in webview
              console.log('Open onboarding URL:', result.onboardingUrl);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Onboarding Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Become a Provider</Text>
      <Text style={styles.subtitle}>
        Set up your account to start offering services and receiving payments.
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleProviderOnboarding}
      >
        <Text style={styles.buttonText}>Start Provider Setup</Text>
      </TouchableOpacity>
    </View>
  );
};

// Example: Feature gating with FeatureGate component
export const FeatureGatingExample: React.FC<{ userId: string }> = ({ userId }) => {
  const { FeatureGate } = useFreemiumGating(userId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Premium Features</Text>
      
      {/* This content only shows for premium users */}
      <FeatureGate 
        feature="no_watermarks" 
        userId={userId}
        fallback={
          <View style={styles.lockedFeature}>
            <Text style={styles.lockedText}>🔒 Remove watermarks with Premium</Text>
          </View>
        }
      >
        <View style={styles.premiumFeature}>
          <Text style={styles.premiumText}>✨ Watermark-free exports available!</Text>
        </View>
      </FeatureGate>

      {/* This shows upgrade prompt when tapped */}
      <FeatureGate 
        feature="premium_stickers" 
        userId={userId}
        showUpgradePrompt={true}
        fallback={
          <TouchableOpacity style={styles.upgradePrompt}>
            <Text style={styles.upgradeText}>Tap to unlock premium stickers</Text>
          </TouchableOpacity>
        }
      >
        <View style={styles.premiumFeature}>
          <Text style={styles.premiumText}>🎨 Premium stickers unlocked!</Text>
        </View>
      </FeatureGate>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  premiumFeature: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  premiumText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '500',
  },
  lockedFeature: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  lockedText: {
    color: '#999',
    fontSize: 16,
  },
  upgradePrompt: {
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  upgradeText: {
    color: '#F57C00',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});