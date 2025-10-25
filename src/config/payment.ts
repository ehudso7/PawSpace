/**
 * Payment Configuration
 * Centralized configuration for payment system
 */

export const PAYMENT_CONFIG = {
  // Stripe Configuration
  stripe: {
    publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    merchantDisplayName: 'PawSpace',
    merchantIdentifier: 'merchant.com.pawspace', // For Apple Pay
  },

  // Pricing
  pricing: {
    premiumMonthly: {
      amount: 4.99,
      interval: 'month' as const,
      priceId: process.env.STRIPE_PRICE_ID_PREMIUM_MONTHLY || 'price_premium_monthly',
      trialDays: 7,
    },
  },

  // Marketplace
  marketplace: {
    commissionPercent: 10, // Platform takes 10%
    minBookingAmount: 10.00, // Minimum $10
    maxBookingAmount: 1000.00, // Maximum $1000
  },

  // Freemium Limits
  freemium: {
    transformationsPerMonth: 3,
    hasWatermark: true,
    premiumStickersEnabled: false,
    featuredListingsEnabled: false,
    advancedAnalyticsEnabled: false,
    prioritySupportEnabled: false,
    adsEnabled: true,
  },

  // Premium Features
  premium: {
    transformationsPerMonth: 999999, // Unlimited
    hasWatermark: false,
    premiumStickersEnabled: true,
    featuredListingsEnabled: true,
    advancedAnalyticsEnabled: true,
    prioritySupportEnabled: true,
    adsEnabled: false,
  },

  // API Endpoints
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:54321/functions/v1',
    endpoints: {
      createSubscription: '/create-subscription',
      cancelSubscription: '/cancel-subscription',
      subscriptionStatus: '/subscription-status',
      createBookingPayment: '/create-booking-payment',
      onboardProvider: '/onboard-provider',
      webhook: '/webhook',
    },
  },

  // Deep Links
  deepLinks: {
    subscriptionReturn: 'pawspace://subscription-return',
    bookingPaymentReturn: 'pawspace://booking-payment-return',
    providerOnboarding: 'pawspace://provider-onboarding',
    providerDashboard: 'pawspace://provider-dashboard',
  },
};

export default PAYMENT_CONFIG;
