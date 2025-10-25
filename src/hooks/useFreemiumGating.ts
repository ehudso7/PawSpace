import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useSubscription } from './useSubscription';
import { PremiumFeature } from '../types/payment';

interface UseFreemiumGatingReturn {
  canUseFeature: (feature: PremiumFeature) => boolean;
  enforceFeatureAccess: (feature: PremiumFeature, featureName: string, onSuccess: () => void) => void;
  getFeatureLimitMessage: (feature: PremiumFeature) => string;
  getRemainingUsage: (feature: PremiumFeature) => number | null;
}

export const useFreemiumGating = (userId?: string): UseFreemiumGatingReturn => {
  const { 
    status, 
    checkFeatureAccess, 
    showUpgradePrompt, 
    monthlyTransformationCount 
  } = useSubscription(userId);

  /**
   * Check if user can use a specific feature
   */
  const canUseFeature = useCallback((feature: PremiumFeature): boolean => {
    return checkFeatureAccess(feature);
  }, [checkFeatureAccess]);

  /**
   * Enforce feature access with automatic upgrade prompts
   */
  const enforceFeatureAccess = useCallback((
    feature: PremiumFeature, 
    featureName: string, 
    onSuccess: () => void
  ) => {
    if (canUseFeature(feature)) {
      onSuccess();
      return;
    }

    // Show appropriate message based on feature
    const message = getFeatureLimitMessage(feature);
    showUpgradePrompt(`${featureName}\n\n${message}`, () => {
      // Navigate to subscription screen
      // This should be implemented based on your navigation system
      console.log('Navigate to subscription screen for feature:', feature);
    });
  }, [canUseFeature, showUpgradePrompt]);

  /**
   * Get feature limit message for free users
   */
  const getFeatureLimitMessage = useCallback((feature: PremiumFeature): string => {
    switch (feature) {
      case 'create_transformation':
      case 'unlimited_transformations':
        const remaining = 3 - monthlyTransformationCount;
        if (remaining <= 0) {
          return 'You\'ve reached your monthly limit of 3 transformations. Upgrade to Premium for unlimited transformations!';
        }
        return `You have ${remaining} transformations remaining this month. Upgrade to Premium for unlimited transformations!`;
      
      case 'no_watermarks':
        return 'Remove watermarks from your exports with Premium. Create professional-looking content without any branding.';
      
      case 'premium_stickers':
        return 'Access our exclusive collection of premium stickers and effects. Make your pet photos even more adorable!';
      
      case 'featured_listings':
        return 'Get your services featured at the top of search results. Attract more customers with Premium provider benefits.';
      
      case 'advanced_analytics':
        return 'Track detailed analytics about your listings, bookings, and customer engagement with Premium insights.';
      
      case 'priority_support':
        return 'Get priority customer support with faster response times and dedicated assistance.';
      
      case 'ad_free':
        return 'Enjoy an ad-free experience throughout the app. Focus on what matters most - your pets!';
      
      default:
        return 'This is a Premium feature. Upgrade now to unlock all Premium benefits!';
    }
  }, [monthlyTransformationCount]);

  /**
   * Get remaining usage for usage-based features
   */
  const getRemainingUsage = useCallback((feature: PremiumFeature): number | null => {
    if (status?.is_premium || status?.is_trial) {
      return null; // Unlimited for premium users
    }

    switch (feature) {
      case 'create_transformation':
      case 'unlimited_transformations':
        return Math.max(0, 3 - monthlyTransformationCount);
      
      default:
        return null; // Feature is either available or not
    }
  }, [status, monthlyTransformationCount]);

  return {
    canUseFeature,
    enforceFeatureAccess,
    getFeatureLimitMessage,
    getRemainingUsage,
  };
};

/**
 * Higher-order component for feature gating
 */
export const withFeatureGating = (
  feature: PremiumFeature,
  featureName: string
) => {
  return (WrappedComponent: React.ComponentType<any>) => {
    return (props: any) => {
      const { enforceFeatureAccess } = useFreemiumGating(props.userId);

      const handleFeatureAccess = (onSuccess: () => void) => {
        enforceFeatureAccess(feature, featureName, onSuccess);
      };

      return (
        <WrappedComponent
          {...props}
          enforceFeatureAccess={handleFeatureAccess}
        />
      );
    };
  };
};

/**
 * Feature gate component for conditional rendering
 */
interface FeatureGateProps {
  feature: PremiumFeature;
  userId?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  userId,
  children,
  fallback = null,
  showUpgradePrompt = false,
}) => {
  const { canUseFeature, enforceFeatureAccess } = useFreemiumGating(userId);

  if (canUseFeature(feature)) {
    return <>{children}</>;
  }

  if (showUpgradePrompt) {
    return (
      <div 
        onClick={() => enforceFeatureAccess(feature, 'Premium Feature', () => {})}
        style={{ cursor: 'pointer' }}
      >
        {fallback}
      </div>
    );
  }

  return <>{fallback}</>;
};