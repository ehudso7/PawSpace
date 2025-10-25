export interface SubscriptionResult {
  subscriptionId: string;
}

export type PlanName = 'free' | 'premium';

export interface SubscriptionStatus {
  is_premium: boolean;
  plan: PlanName;
  expires_at?: string | null;
  is_trial: boolean;
  trial_ends_at?: string | null;
  can_cancel: boolean;
  stripe_customer_id?: string | null;
  subscription_id?: string | null;
}

export interface BookingPaymentData {
  amount: number; // USD dollars
  providerId: string; // Stripe Connect account id (acct_*)
  providerName: string; // Display name for merchant
  bookingId: string; // Internal booking id
}

export interface PaymentResult {
  paymentIntentId: string;
  status: 'succeeded' | 'processing' | 'requires_payment_method' | 'canceled' | 'requires_action' | 'requires_confirmation' | 'unknown';
}

export type PremiumFeature =
  | 'create_transformation'
  | 'no_watermark'
  | 'premium_assets'
  | 'featured_listings'
  | 'advanced_analytics'
  | 'priority_support'
  | 'ad_free';
