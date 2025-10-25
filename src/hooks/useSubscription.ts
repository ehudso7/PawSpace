import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PremiumFeature, SubscriptionStatus } from '../types/billing';
import { stripeService } from '../services/stripe';

export function useSubscription(currentUserId?: string) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyTransformationCount, setMonthlyTransformationCount] = useState<number>(0);

  const refresh = useCallback(async () => {
    if (!currentUserId) return;
    setLoading(true);
    setError(null);
    try {
      const s = await stripeService.getSubscriptionStatus(currentUserId);
      setStatus(s);
    } catch (e: any) {
      setError(e?.message || 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const checkFeatureAccess = useCallback(
    (feature: PremiumFeature): boolean => {
      if (status?.is_premium) return true;
      if (feature === 'create_transformation') {
        return monthlyTransformationCount < 3;
      }
      return false;
    },
    [status, monthlyTransformationCount]
  );

  const showUpgradePrompt = useCallback((featureLabel: string) => {
    // Implement your UI flow to show modal/sheet
    console.log(`Upgrade required to access: ${featureLabel}`);
  }, []);

  return useMemo(
    () => ({ status, loading, error, refresh, checkFeatureAccess, showUpgradePrompt, monthlyTransformationCount, setMonthlyTransformationCount }),
    [status, loading, error, refresh, checkFeatureAccess, showUpgradePrompt, monthlyTransformationCount]
  );
}
