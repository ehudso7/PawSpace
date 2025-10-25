/**
 * useSubscription Hook
 * Manages subscription status and premium feature access
 */

import { useState, useEffect, useCallback } from 'react';
import { SubscriptionStatus, PremiumFeature } from '../types/payment';
import stripeService from '../services/stripe';

interface UseSubscriptionReturn {
  status: SubscriptionStatus | null;
  loading: boolean;
  error: string | null;
  checkFeatureAccess: (feature: PremiumFeature) => boolean;
  showUpgradePrompt: (feature: string) => void;
  refreshStatus: () => Promise<void>;
  isPremium: boolean;
  isTrialActive: boolean;
  transformationsRemaining: number;
}

export const useSubscription = (userId: string | null): UseSubscriptionReturn => {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch subscription status from backend
   */
  const fetchStatus = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const subscriptionStatus = await stripeService.getSubscriptionStatus(userId);
      setStatus(subscriptionStatus);
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Set default free status on error
      setStatus({
        is_premium: false,
        plan: 'free',
        is_trial: false,
        can_cancel: false,
        transformations_used: 0,
        transformations_limit: 3,
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Refresh subscription status
   */
  const refreshStatus = useCallback(async () => {
    await fetchStatus();
  }, [fetchStatus]);

  /**
   * Check if user has access to a premium feature
   */
  const checkFeatureAccess = useCallback((feature: PremiumFeature): boolean => {
    if (!status) return false;

    // Premium users have access to everything
    if (status.is_premium) return true;

    // Check specific limits for free users
    switch (feature) {
      case 'create_transformation':
        const transformationsUsed = status.transformations_used || 0;
        const transformationsLimit = status.transformations_limit || 3;
        return transformationsUsed < transformationsLimit;

      case 'export_without_watermark':
      case 'premium_stickers':
      case 'featured_listing':
      case 'advanced_analytics':
      case 'priority_support':
      case 'ad_free':
        return false; // These require premium

      default:
        return false;
    }
  }, [status]);

  /**
   * Show upgrade prompt for a specific feature
   * This would typically open a modal - implementation depends on your modal system
   */
  const showUpgradePrompt = useCallback((feature: string) => {
    // TODO: Integrate with your modal system
    console.log(`Upgrade required for: ${feature}`);
    // Example: navigation.navigate('Subscription', { highlightFeature: feature });
  }, []);

  // Fetch status on mount and when userId changes
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Computed values
  const isPremium = status?.is_premium || false;
  const isTrialActive = status?.is_trial || false;
  const transformationsRemaining = Math.max(
    0,
    (status?.transformations_limit || 3) - (status?.transformations_used || 0)
  );

  return {
    status,
    loading,
    error,
    checkFeatureAccess,
    showUpgradePrompt,
    refreshStatus,
    isPremium,
    isTrialActive,
    transformationsRemaining,
  };
};

export default useSubscription;
