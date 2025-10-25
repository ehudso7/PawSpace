import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { SubscriptionStatus, PremiumFeature } from '../types/stripe';
import { stripeService } from '../services/stripe';

interface UseSubscriptionReturn {
  status: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  checkFeatureAccess: (feature: PremiumFeature) => boolean;
  showUpgradePrompt: (feature: string) => void;
  refreshSubscription: () => Promise<void>;
  createSubscription: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  monthlyTransformationCount: number;
  incrementTransformationCount: () => void;
}

export const useSubscription = (userId?: string): UseSubscriptionReturn => {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyTransformationCount, setMonthlyTransformationCount] = useState(0);

  // Load subscription status on mount
  useEffect(() => {
    if (userId) {
      refreshSubscription();
    }
  }, [userId]);

  // Refresh subscription status
  const refreshSubscription = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const subscriptionStatus = await stripeService.getSubscriptionStatus(userId);
      setStatus(subscriptionStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscription status');
      console.error('Error refreshing subscription:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Check if user has access to a premium feature
  const checkFeatureAccess = useCallback((feature: PremiumFeature): boolean => {
    if (!status) return false;
    
    // Premium users have access to all features
    if (status.is_premium) return true;
    
    // Check specific limits for free users
    switch (feature) {
      case 'create_transformation':
        return monthlyTransformationCount < 3;
      case 'unlimited_transformations':
        return false; // Always requires premium
      case 'no_watermarks':
        return false; // Always requires premium
      case 'premium_stickers':
        return false; // Always requires premium
      case 'featured_listings':
        return false; // Always requires premium
      case 'advanced_analytics':
        return false; // Always requires premium
      case 'priority_support':
        return false; // Always requires premium
      case 'ad_free':
        return false; // Always requires premium
      default:
        return false;
    }
  }, [status, monthlyTransformationCount]);

  // Show upgrade prompt for premium features
  const showUpgradePrompt = useCallback((feature: string) => {
    Alert.alert(
      'Premium Feature',
      `"${feature}" is available with PawSpace Premium. Upgrade now to unlock unlimited access!`,
      [
        {
          text: 'Maybe Later',
          style: 'cancel',
        },
        {
          text: 'Upgrade Now',
          onPress: createSubscription,
        },
      ]
    );
  }, []);

  // Create new subscription
  const createSubscription = useCallback(async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID is required to create subscription');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await stripeService.createSubscription(userId);
      
      // Refresh subscription status after successful creation
      await refreshSubscription();
      
      Alert.alert(
        'Success!',
        'Your subscription has been created successfully. Welcome to PawSpace Premium!',
        [{ text: 'OK' }]
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userId, refreshSubscription]);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    if (!status?.subscription_id) {
      Alert.alert('Error', 'No active subscription found');
      return;
    }

    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.',
      [
        {
          text: 'Keep Subscription',
          style: 'cancel',
        },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              setError(null);
              
              await stripeService.cancelSubscription(status.subscription_id!);
              
              // Refresh subscription status after cancellation
              await refreshSubscription();
              
              Alert.alert(
                'Subscription Cancelled',
                'Your subscription has been cancelled. You will retain access to premium features until the end of your billing period.',
                [{ text: 'OK' }]
              );
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
              setError(errorMessage);
              Alert.alert('Error', errorMessage);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }, [status, refreshSubscription]);

  // Increment transformation count (for free users)
  const incrementTransformationCount = useCallback(() => {
    if (!status?.is_premium) {
      setMonthlyTransformationCount(prev => prev + 1);
    }
  }, [status?.is_premium]);

  return {
    status,
    loading,
    error,
    checkFeatureAccess,
    showUpgradePrompt,
    refreshSubscription,
    createSubscription,
    cancelSubscription,
    monthlyTransformationCount,
    incrementTransformationCount,
  };
};