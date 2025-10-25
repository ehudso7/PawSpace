import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import stripeService from '../services/stripe';
import { SubscriptionStatus, PremiumFeature } from '../types/payment';

interface UseSubscriptionReturn {
  status: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  checkFeatureAccess: (feature: PremiumFeature) => boolean;
  showUpgradePrompt: (feature: string, onUpgrade?: () => void) => void;
  createSubscription: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  monthlyTransformationCount: number;
}

// Mock transformation count - replace with actual implementation
let mockTransformationCount = 0;

export const useSubscription = (userId?: string): UseSubscriptionReturn => {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyTransformationCount, setMonthlyTransformationCount] = useState(mockTransformationCount);

  /**
   * Fetch subscription status from backend
   */
  const fetchStatus = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const subscriptionStatus = await stripeService.getSubscriptionStatus(userId);
      setStatus(subscriptionStatus);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscription status';
      setError(errorMessage);
      console.error('Subscription status error:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Check if user has access to a premium feature
   */
  const checkFeatureAccess = useCallback((feature: PremiumFeature): boolean => {
    if (!status) return false;

    // Premium users have access to all features
    if (status.is_premium || status.is_trial) return true;

    // Check specific limits for free users
    switch (feature) {
      case 'create_transformation':
      case 'unlimited_transformations':
        return monthlyTransformationCount < 3;
      
      case 'no_watermarks':
      case 'premium_stickers':
      case 'featured_listings':
      case 'advanced_analytics':
      case 'priority_support':
      case 'ad_free':
        return false; // These are premium-only features
      
      default:
        return false;
    }
  }, [status, monthlyTransformationCount]);

  /**
   * Show upgrade prompt modal
   */
  const showUpgradePrompt = useCallback((feature: string, onUpgrade?: () => void) => {
    Alert.alert(
      'Premium Feature',
      `${feature} is available with PawSpace Premium. Upgrade now to unlock this feature and many more!`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Upgrade to Premium',
          onPress: () => {
            if (onUpgrade) {
              onUpgrade();
            } else {
              // Navigate to subscription screen
              // This should be implemented based on your navigation system
              console.log('Navigate to subscription screen');
            }
          },
        },
      ]
    );
  }, []);

  /**
   * Create a new subscription
   */
  const createSubscription = useCallback(async () => {
    if (!userId) {
      throw new Error('User ID is required to create subscription');
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await stripeService.createSubscription(userId);
      
      // Refresh status after successful subscription
      await fetchStatus();
      
      Alert.alert(
        'Success!',
        'Your premium subscription has been activated. Welcome to PawSpace Premium!',
        [{ text: 'OK' }]
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription';
      setError(errorMessage);
      
      Alert.alert(
        'Subscription Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchStatus]);

  /**
   * Cancel active subscription
   */
  const cancelSubscription = useCallback(async () => {
    if (!status?.subscription_id) {
      throw new Error('No active subscription to cancel');
    }

    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your premium subscription? You will lose access to premium features at the end of your billing period.',
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
              
              // Refresh status after cancellation
              await fetchStatus();
              
              Alert.alert(
                'Subscription Cancelled',
                'Your subscription has been cancelled. You will retain premium access until the end of your billing period.',
                [{ text: 'OK' }]
              );
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Failed to cancel subscription';
              setError(errorMessage);
              
              Alert.alert(
                'Cancellation Failed',
                errorMessage,
                [{ text: 'OK' }]
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }, [status, fetchStatus]);

  /**
   * Refresh subscription status
   */
  const refreshStatus = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  // Fetch status on mount and when userId changes
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Mock function to increment transformation count
  // Replace with actual implementation that tracks usage
  useEffect(() => {
    const incrementTransformationCount = () => {
      mockTransformationCount += 1;
      setMonthlyTransformationCount(mockTransformationCount);
    };

    // This is just for demo - implement actual usage tracking
    // incrementTransformationCount();
  }, []);

  return {
    status,
    loading,
    error,
    checkFeatureAccess,
    showUpgradePrompt,
    createSubscription,
    cancelSubscription,
    refreshStatus,
    monthlyTransformationCount,
  };
};