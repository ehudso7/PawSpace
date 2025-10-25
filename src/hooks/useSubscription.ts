import { useEffect, useMemo, useState } from 'react';

export type PremiumFeature =
  | 'create_transformation'
  | 'no_watermarks'
  | 'premium_assets'
  | 'featured_listings'
  | 'advanced_analytics'
  | 'priority_support'
  | 'ad_free';

export type SubscriptionStatus = {
  is_premium: boolean;
  plan: 'free' | 'premium';
  expires_at?: string;
  is_trial: boolean;
  trial_ends_at?: string;
  can_cancel: boolean;
};

export function useSubscription(currentUserId?: string) {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyTransformationCount, setMonthlyTransformationCount] = useState<number>(0);

  useEffect(() => {
    if (!currentUserId) return;
    setLoading(true);
    fetch(`/api/subscription-status/${currentUserId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then(setStatus)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [currentUserId]);

  const checkFeatureAccess = (feature: PremiumFeature): boolean => {
    if (status?.is_premium) return true;
    if (feature === 'create_transformation') {
      return monthlyTransformationCount < 3;
    }
    return false;
  };

  const showUpgradePrompt = (featureDescription: string) => {
    // Integrate with your app modal system
    // e.g., showModal({ title: 'Upgrade to Premium', description: featureDescription })
    console.warn('Feature requires premium:', featureDescription);
  };

  return { status, loading, error, checkFeatureAccess, showUpgradePrompt, setMonthlyTransformationCount };
}
