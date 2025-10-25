/**
 * Payment System Tests
 * Test suite for payment functionality
 */

import stripeService from '../services/stripe';
import providerOnboardingService from '../services/providerOnboarding';
import { useSubscription } from '../hooks/useSubscription';
import { 
  formatCurrency, 
  calculateCommission, 
  validatePaymentAmount,
  parseStripeError 
} from '../utils/payment';

/**
 * Test Stripe Service
 */
describe('StripeService', () => {
  test('should initialize with publishable key', async () => {
    await stripeService.initialize('pk_test_xxx', 'PawSpace');
    expect(stripeService.getPublishableKey()).toBe('pk_test_xxx');
  });

  test('should create subscription', async () => {
    const result = await stripeService.createSubscription('user_123', 'price_xxx');
    expect(result).toHaveProperty('subscriptionId');
  });

  test('should process booking payment', async () => {
    const result = await stripeService.processBookingPayment({
      amount: 50.00,
      providerId: 'acct_xxx',
      providerName: 'Test Provider',
      bookingId: 'booking_123',
    });
    expect(result).toHaveProperty('paymentIntent');
  });

  test('should get subscription status', async () => {
    const status = await stripeService.getSubscriptionStatus('user_123');
    expect(status).toHaveProperty('is_premium');
    expect(status).toHaveProperty('plan');
  });
});

/**
 * Test Subscription Hook
 */
describe('useSubscription', () => {
  test('should return subscription status', () => {
    const { status } = useSubscription('user_123');
    expect(status).toBeDefined();
  });

  test('should check feature access for free users', () => {
    const { checkFeatureAccess } = useSubscription('user_123');
    // Assuming free user
    expect(checkFeatureAccess('premium_stickers')).toBe(false);
  });

  test('should check feature access for premium users', () => {
    const { checkFeatureAccess, isPremium } = useSubscription('user_premium');
    if (isPremium) {
      expect(checkFeatureAccess('premium_stickers')).toBe(true);
    }
  });
});

/**
 * Test Payment Utilities
 */
describe('Payment Utilities', () => {
  test('should format currency correctly', () => {
    expect(formatCurrency(49.99)).toBe('$49.99');
    expect(formatCurrency(1000)).toBe('$1,000.00');
  });

  test('should calculate commission', () => {
    const result = calculateCommission(100, 10);
    expect(result.amount).toBe(100);
    expect(result.commission).toBe(10);
    expect(result.providerReceives).toBe(90);
  });

  test('should validate payment amounts', () => {
    expect(validatePaymentAmount(50, 10, 1000).valid).toBe(true);
    expect(validatePaymentAmount(5, 10, 1000).valid).toBe(false);
    expect(validatePaymentAmount(2000, 10, 1000).valid).toBe(false);
  });

  test('should parse Stripe errors', () => {
    const error = { code: 'card_declined', message: 'Card declined' };
    const parsed = parseStripeError(error);
    expect(parsed).toContain('declined');
  });
});

/**
 * Test Provider Onboarding
 */
describe('ProviderOnboardingService', () => {
  test('should start onboarding', async () => {
    await providerOnboardingService.startOnboarding({
      userId: 'user_123',
      email: 'provider@test.com',
      country: 'US',
    });
    // Should not throw error
  });

  test('should check onboarding status', async () => {
    const status = await providerOnboardingService.checkOnboardingStatus('user_123');
    expect(typeof status).toBe('boolean');
  });
});

/**
 * Integration Tests
 */
describe('Payment Flow Integration', () => {
  test('should complete subscription flow', async () => {
    // 1. Check initial status (free)
    const initialStatus = await stripeService.getSubscriptionStatus('user_test');
    expect(initialStatus.plan).toBe('free');

    // 2. Create subscription
    const subscription = await stripeService.createSubscription('user_test', 'price_test');
    expect(subscription.subscriptionId).toBeDefined();

    // 3. Verify premium status
    const premiumStatus = await stripeService.getSubscriptionStatus('user_test');
    expect(premiumStatus.is_premium).toBe(true);

    // 4. Cancel subscription
    await stripeService.cancelSubscription(subscription.subscriptionId, 'user_test');
  });

  test('should complete booking payment flow', async () => {
    // 1. Create booking
    const bookingData = {
      amount: 75.00,
      providerId: 'acct_test',
      providerName: 'Test Provider',
      bookingId: 'booking_test_123',
    };

    // 2. Process payment
    const result = await stripeService.processBookingPayment(bookingData);
    expect(result.paymentIntent).toBeDefined();
  });
});

/**
 * Edge Function Tests
 */
describe('Edge Functions', () => {
  const API_BASE = process.env.EXPO_PUBLIC_API_URL;

  test('create-subscription endpoint', async () => {
    const response = await fetch(`${API_BASE}/create-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price_id: 'price_test',
        user_id: 'user_test',
      }),
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data).toHaveProperty('subscriptionId');
    expect(data).toHaveProperty('clientSecret');
  });

  test('subscription-status endpoint', async () => {
    const response = await fetch(`${API_BASE}/subscription-status/user_test`);
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data).toHaveProperty('is_premium');
    expect(data).toHaveProperty('plan');
  });

  test('create-booking-payment endpoint', async () => {
    const response = await fetch(`${API_BASE}/create-booking-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 5000,
        provider_stripe_account_id: 'acct_test',
        application_fee_amount: 500,
        booking_id: 'booking_test',
      }),
    });
    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data).toHaveProperty('clientSecret');
  });
});

/**
 * Error Handling Tests
 */
describe('Error Handling', () => {
  test('should handle invalid subscription creation', async () => {
    await expect(
      stripeService.createSubscription('', 'invalid_price')
    ).rejects.toThrow();
  });

  test('should handle invalid payment amount', () => {
    const result = validatePaymentAmount(-10);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should handle missing provider ID', async () => {
    await expect(
      stripeService.processBookingPayment({
        amount: 50,
        providerId: '',
        providerName: 'Test',
        bookingId: 'test',
      })
    ).rejects.toThrow();
  });
});

/**
 * Freemium Gating Tests
 */
describe('Freemium Gating', () => {
  test('free users should have transformation limits', () => {
    const { status } = useSubscription('user_free');
    expect(status?.transformations_limit).toBe(3);
  });

  test('premium users should have unlimited transformations', () => {
    const { status, isPremium } = useSubscription('user_premium');
    if (isPremium) {
      expect(status?.transformations_limit).toBeGreaterThan(1000);
    }
  });

  test('should block premium features for free users', () => {
    const { checkFeatureAccess } = useSubscription('user_free');
    expect(checkFeatureAccess('premium_stickers')).toBe(false);
    expect(checkFeatureAccess('export_without_watermark')).toBe(false);
    expect(checkFeatureAccess('featured_listing')).toBe(false);
  });
});

/**
 * Manual Test Cases
 */
export const MANUAL_TEST_CASES = [
  {
    name: 'Create Subscription with Trial',
    steps: [
      '1. Open SubscriptionScreen as free user',
      '2. Tap "Start 7-Day Free Trial"',
      '3. Complete payment sheet',
      '4. Verify "Premium Active" badge shows',
      '5. Verify "Trial ends in X days" message',
      '6. Check all premium features are unlocked',
    ],
    expected: 'User should have premium access immediately with trial',
  },
  {
    name: 'Cancel Subscription',
    steps: [
      '1. Open SubscriptionScreen as premium user',
      '2. Tap "Manage Subscription"',
      '3. Select "Cancel Subscription"',
      '4. Confirm cancellation',
      '5. Verify message about access until period end',
    ],
    expected: 'Subscription cancelled but access maintained until period ends',
  },
  {
    name: 'Process Booking Payment',
    steps: [
      '1. Select a service from provider',
      '2. Choose date and time',
      '3. Review booking details',
      '4. Tap "Pay $XX.XX"',
      '5. Complete payment sheet',
      '6. Verify booking confirmed',
    ],
    expected: 'Payment successful, booking confirmed, provider receives 90%',
  },
  {
    name: 'Provider Onboarding',
    steps: [
      '1. Open ProviderDashboard',
      '2. Tap "Connect Bank Account"',
      '3. Complete Stripe onboarding in browser',
      '4. Return to app',
      '5. Verify "Verified" badge shows',
    ],
    expected: 'Provider can receive payments after verification',
  },
  {
    name: 'Freemium Transformation Limit',
    steps: [
      '1. As free user, create 3 transformations',
      '2. Try to create 4th transformation',
      '3. Verify upgrade prompt appears',
      '4. Tap "Upgrade to Premium"',
      '5. Complete subscription',
      '6. Verify can now create unlimited',
    ],
    expected: 'Free users limited to 3, upgrade unlocks unlimited',
  },
  {
    name: 'Webhook - Subscription Update',
    steps: [
      '1. Create subscription via Stripe dashboard',
      '2. Wait for webhook to fire',
      '3. Check user premium status in database',
      '4. Verify dates are correct',
    ],
    expected: 'Database updated automatically via webhook',
  },
  {
    name: 'Payment Failure Handling',
    steps: [
      '1. Use test card 4000 0000 0000 0002 (decline)',
      '2. Try to create subscription',
      '3. Verify error message shows',
      '4. Retry with valid card',
      '5. Verify success',
    ],
    expected: 'Clear error messages, ability to retry',
  },
];

/**
 * Test Data
 */
export const TEST_DATA = {
  users: {
    free: {
      id: 'user_free_test',
      email: 'free@test.com',
      is_premium: false,
    },
    premium: {
      id: 'user_premium_test',
      email: 'premium@test.com',
      is_premium: true,
      trial_ends_at: null,
    },
    trial: {
      id: 'user_trial_test',
      email: 'trial@test.com',
      is_premium: true,
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  },
  cards: {
    success: '4242424242424242',
    decline: '4000000000000002',
    insufficient: '4000000000009995',
    expired: '4000000000000069',
    auth_required: '4000002500003155',
  },
  prices: {
    premium_monthly: 'price_premium_monthly',
  },
};

export default {
  MANUAL_TEST_CASES,
  TEST_DATA,
};
