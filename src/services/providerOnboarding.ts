/**
 * Provider Onboarding Service
 * Handles Stripe Connect onboarding for service providers
 */

import { Alert, Linking } from 'react-native';
import stripeService from './stripe';

export interface ProviderOnboardingOptions {
  userId: string;
  email: string;
  country?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export class ProviderOnboardingService {
  /**
   * Start provider onboarding flow
   */
  async startOnboarding(options: ProviderOnboardingOptions): Promise<void> {
    const { userId, email, country = 'US', onSuccess, onError } = options;

    try {
      // Get onboarding URL from backend
      const result = await stripeService.onboardProvider(userId, email);

      // Open Stripe onboarding in browser/webview
      const supported = await Linking.canOpenURL(result.onboardingUrl);

      if (supported) {
        await Linking.openURL(result.onboardingUrl);
        
        // Show success message
        Alert.alert(
          'Complete Your Setup',
          'Please complete the onboarding process in your browser. You\'ll be redirected back to the app when finished.',
          [
            {
              text: 'OK',
              onPress: onSuccess,
            },
          ]
        );
      } else {
        throw new Error('Cannot open onboarding URL');
      }
    } catch (error) {
      console.error('Provider onboarding error:', error);
      
      Alert.alert(
        'Onboarding Failed',
        error instanceof Error ? error.message : 'Unable to start onboarding process. Please try again.'
      );

      if (onError) {
        onError(error instanceof Error ? error : new Error('Unknown error'));
      }
    }
  }

  /**
   * Check if provider onboarding is complete
   */
  async checkOnboardingStatus(userId: string): Promise<boolean> {
    try {
      // TODO: Call backend to check if Stripe account is verified
      // For now, return false
      return false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Get provider dashboard link
   */
  async getDashboardLink(userId: string): Promise<string | null> {
    try {
      // TODO: Call backend to get Stripe dashboard login link
      return null;
    } catch (error) {
      console.error('Error getting dashboard link:', error);
      return null;
    }
  }
}

// Export singleton instance
export const providerOnboardingService = new ProviderOnboardingService();
export default providerOnboardingService;
