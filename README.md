# PawSpace - Complete Payment System with Stripe

A comprehensive payment system implementation for PawSpace, featuring subscription management, marketplace transactions, and freemium gating.

## 🚀 Features

### Subscription System
- **7-day free trial** for new Premium subscribers
- **Monthly billing** at $4.99/month
- **Automatic renewal** with easy cancellation
- **Trial management** with seamless conversion to paid

### Marketplace Payments
- **Stripe Connect** integration for service providers
- **10% commission** on all marketplace transactions
- **Secure payment processing** with PCI compliance
- **Automatic payouts** to service providers

### Freemium Model
- **Usage-based limits** (3 transformations/month for free users)
- **Feature gating** for premium-only features
- **Upgrade prompts** with seamless subscription flow
- **Real-time usage tracking**

### Premium Benefits
- ✅ Unlimited transformations (vs 3/month free)
- ✅ No watermarks on exports
- ✅ Access to premium stickers and effects
- ✅ Featured provider listings
- ✅ Advanced analytics
- ✅ Priority support
- ✅ Ad-free experience

## 📁 Project Structure

```
src/
├── services/
│   └── stripe.ts              # Stripe service layer
├── hooks/
│   ├── useSubscription.ts     # Subscription management
│   └── useFreemiumGating.ts   # Feature gating logic
├── screens/
│   └── profile/
│       └── SubscriptionScreen.tsx  # Subscription UI
├── types/
│   └── payment.ts             # TypeScript interfaces
├── components/
│   └── common/
│       └── LoadingSpinner.tsx # Reusable components
└── examples/
    └── PaymentExamples.tsx    # Usage examples

supabase/
├── functions/
│   ├── create-subscription/   # Subscription creation
│   ├── cancel-subscription/   # Subscription cancellation
│   ├── create-booking-payment/  # Marketplace payments
│   ├── subscription-status/   # Status checking
│   ├── onboard-provider/      # Provider onboarding
│   └── webhook/              # Stripe webhook handler
└── migrations/
    └── 001_add_payment_system.sql  # Database schema
```

## 🛠 Setup Instructions

### 1. Install Dependencies

```bash
npm install @stripe/stripe-react-native stripe
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook endpoint secret
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for webhooks

### 3. Stripe Dashboard Setup

1. **Create Products & Prices:**
   - Premium Monthly: $4.99/month
   - Set up recurring billing
   - Enable 7-day free trials

2. **Configure Webhooks:**
   Point to: `https://your-project.supabase.co/functions/v1/webhook`
   
   Required events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`

3. **Enable Stripe Connect:**
   - Set up Express accounts for providers
   - Configure application fees (10%)

### 4. Database Setup

Run the migration to create required tables:

```sql
-- Run the migration file
\i supabase/migrations/001_add_payment_system.sql
```

### 5. Deploy Supabase Functions

```bash
# Deploy all functions
supabase functions deploy create-subscription
supabase functions deploy cancel-subscription
supabase functions deploy create-booking-payment
supabase functions deploy subscription-status
supabase functions deploy onboard-provider
supabase functions deploy webhook

# Set environment variables
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

## 💻 Usage Examples

### Basic Subscription Management

```tsx
import { useSubscription } from './src/hooks/useSubscription';

function MyComponent() {
  const { 
    status, 
    createSubscription, 
    cancelSubscription,
    checkFeatureAccess 
  } = useSubscription(userId);

  const handleUpgrade = async () => {
    try {
      await createSubscription();
      // User is now premium!
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  return (
    <div>
      {status?.is_premium ? (
        <button onClick={cancelSubscription}>Cancel Subscription</button>
      ) : (
        <button onClick={handleUpgrade}>Upgrade to Premium</button>
      )}
    </div>
  );
}
```

### Feature Gating

```tsx
import { useFreemiumGating } from './src/hooks/useFreemiumGating';

function CreateTransformation() {
  const { enforceFeatureAccess } = useFreemiumGating(userId);

  const handleCreate = () => {
    enforceFeatureAccess(
      'create_transformation',
      'Create Transformation',
      () => {
        // User has access - proceed with creation
        createTransformation();
      }
    );
  };

  return <button onClick={handleCreate}>Create</button>;
}
```

### Marketplace Payments

```tsx
import stripeService from './src/services/stripe';

async function processBooking() {
  const bookingData = {
    amount: 50.00,
    providerId: 'acct_provider_stripe_id',
    providerName: 'Pet Sitter Pro',
    bookingId: 'booking_123',
  };

  try {
    const result = await stripeService.processBookingPayment(bookingData);
    console.log('Payment successful!', result);
  } catch (error) {
    console.error('Payment failed:', error);
  }
}
```

### Provider Onboarding

```tsx
async function onboardProvider() {
  try {
    const result = await stripeService.onboardProvider(userId, email);
    // Open result.onboardingUrl in webview
    window.open(result.onboardingUrl);
  } catch (error) {
    console.error('Onboarding failed:', error);
  }
}
```

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **JWT token verification** in all Edge Functions
- **Webhook signature verification** for Stripe events
- **User authorization checks** for all operations
- **PCI compliance** through Stripe's secure infrastructure

## 📊 Database Schema

### Key Tables

- **users** - Extended with payment fields (stripe_customer_id, subscription_id, etc.)
- **bookings** - Marketplace transactions with payment tracking
- **payment_logs** - Comprehensive payment history
- **usage_tracking** - Freemium usage limits and tracking
- **services** - Provider service listings
- **reviews** - Customer feedback system

### Key Functions

- `get_user_subscription_status()` - Get current subscription info
- `check_feature_access()` - Validate feature permissions
- `increment_usage()` - Track feature usage for limits

## 🧪 Testing

### Test Cards (Stripe Test Mode)

- **Successful payment:** `4242424242424242`
- **Declined payment:** `4000000000000002`
- **3D Secure required:** `4000002500003155`

### Test Scenarios

1. **Free Trial Flow:**
   - Sign up for premium
   - Verify 7-day trial activation
   - Test trial expiration

2. **Payment Failures:**
   - Test declined cards
   - Verify graceful error handling
   - Check retry mechanisms

3. **Feature Gating:**
   - Test usage limits for free users
   - Verify premium feature access
   - Test upgrade prompts

## 🚀 Deployment

### Production Checklist

- [ ] Switch to Stripe live keys
- [ ] Update webhook endpoints
- [ ] Configure production database
- [ ] Set up monitoring and alerts
- [ ] Test payment flows end-to-end
- [ ] Verify webhook delivery
- [ ] Test provider onboarding
- [ ] Validate subscription management

## 📈 Analytics & Monitoring

Monitor these key metrics:
- Subscription conversion rates
- Trial-to-paid conversion
- Payment success rates
- Feature usage patterns
- Provider onboarding completion
- Customer lifetime value

## 🆘 Support

For issues or questions:
1. Check Stripe Dashboard for payment issues
2. Monitor Supabase logs for function errors
3. Verify webhook delivery in Stripe
4. Check database constraints and RLS policies

## 📄 License

This implementation is part of the PawSpace project. Ensure compliance with Stripe's terms of service and applicable regulations.