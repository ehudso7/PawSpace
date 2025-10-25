# PawSpace Payment System

Complete Stripe payment implementation for subscriptions and marketplace transactions.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @stripe/stripe-react-native
```

For Supabase Edge Functions, Stripe is imported via ESM:
```typescript
import Stripe from 'https://esm.sh/stripe@14.5.0';
```

### 2. Stripe Configuration

1. **Create Stripe Account**
   - Sign up at https://stripe.com
   - Get your API keys from https://dashboard.stripe.com/apikeys

2. **Create Products and Prices**
   - Go to https://dashboard.stripe.com/products
   - Create a product named "Premium Subscription"
   - Add a price: $4.99/month with 7-day trial
   - Copy the price ID (starts with `price_`)

3. **Configure Webhook Endpoint**
   - Go to https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://your-project.supabase.co/functions/v1/webhook`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `account.updated`
   - Copy the webhook signing secret (starts with `whsec_`)

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Webhook signing secret
- `STRIPE_PRICE_ID_PREMIUM_MONTHLY`: Price ID for premium subscription
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for webhooks)

### 4. Database Migration

Run the migration to add payment fields:

```bash
supabase db push
```

Or apply the migration file directly:

```bash
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/20231025_add_payment_fields.sql
```

### 5. Deploy Supabase Edge Functions

```bash
# Deploy all functions
supabase functions deploy create-subscription
supabase functions deploy cancel-subscription
supabase functions deploy subscription-status
supabase functions deploy create-booking-payment
supabase functions deploy onboard-provider
supabase functions deploy webhook

# Set environment secrets
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set SUPABASE_URL=https://...
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
supabase secrets set APP_URL=pawspace://
```

### 6. Initialize Stripe in Your App

In your main App component:

```typescript
import { StripeProvider } from '@stripe/stripe-react-native';
import stripeService from './src/services/stripe';

function App() {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  
  useEffect(() => {
    stripeService.initialize(publishableKey, 'PawSpace');
  }, []);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.pawspace"
    >
      {/* Your app content */}
    </StripeProvider>
  );
}
```

## Features Implemented

### 1. Subscription Management

**Screen**: `src/screens/profile/SubscriptionScreen.tsx`

Features:
- Current plan display (Free/Premium)
- 7-day free trial
- Premium benefits showcase
- Pricing card with clear CTA
- FAQ section
- Subscription management (cancel, view billing)

**Hook**: `src/hooks/useSubscription.ts`

Usage:
```typescript
const { status, isPremium, checkFeatureAccess, showUpgradePrompt } = useSubscription(userId);

// Check if user can use a feature
if (!checkFeatureAccess('create_transformation')) {
  showUpgradePrompt('Create unlimited transformations');
  return;
}
```

### 2. Freemium Gating

Free tier limits:
- 3 transformations per month
- Watermarks on exports
- No premium stickers/effects
- No featured listings
- Ads enabled

Premium features (all unlimited):
- Unlimited transformations
- No watermarks
- Premium stickers and effects
- Featured provider listings
- Advanced analytics
- Priority support
- Ad-free experience

### 3. Marketplace Transactions

**Service**: `src/services/stripe.ts`

Process booking payments with 10% marketplace commission:

```typescript
await stripeService.processBookingPayment({
  amount: 50.00, // $50
  providerId: 'acct_xxx', // Provider's Stripe Connect account
  providerName: 'Pet Grooming Services',
  bookingId: 'booking_123',
});
```

Funds flow:
- Customer pays $50
- Platform keeps $5 (10% commission)
- Provider receives $45

### 4. Provider Onboarding (Stripe Connect)

**Service**: `src/services/providerOnboarding.ts`

Allow providers to receive payments:

```typescript
import providerOnboardingService from './src/services/providerOnboarding';

await providerOnboardingService.startOnboarding({
  userId: 'user_123',
  email: 'provider@example.com',
  country: 'US',
  onSuccess: () => console.log('Onboarding complete'),
  onError: (error) => console.error(error),
});
```

### 5. Webhook Handling

**Function**: `supabase/functions/webhook/index.ts`

Automatically handles:
- Subscription creation/updates
- Subscription cancellation
- Payment success/failure
- Provider account verification

## Edge Functions

### create-subscription
Creates a new subscription with 7-day free trial.

**Endpoint**: `POST /functions/v1/create-subscription`

**Body**:
```json
{
  "price_id": "price_premium_monthly",
  "user_id": "user_123"
}
```

**Response**:
```json
{
  "subscriptionId": "sub_xxx",
  "clientSecret": "pi_xxx_secret_xxx"
}
```

### cancel-subscription
Cancels subscription at period end.

**Endpoint**: `POST /functions/v1/cancel-subscription`

**Body**:
```json
{
  "subscription_id": "sub_xxx",
  "user_id": "user_123"
}
```

### subscription-status
Gets user's subscription status.

**Endpoint**: `GET /functions/v1/subscription-status/{user_id}`

**Response**:
```json
{
  "is_premium": true,
  "plan": "premium",
  "expires_at": "2024-01-01T00:00:00Z",
  "is_trial": true,
  "trial_ends_at": "2023-12-25T00:00:00Z",
  "can_cancel": true,
  "transformations_used": 5,
  "transformations_limit": 999999
}
```

### create-booking-payment
Creates payment intent for marketplace transaction.

**Endpoint**: `POST /functions/v1/create-booking-payment`

**Body**:
```json
{
  "amount": 5000,
  "provider_stripe_account_id": "acct_xxx",
  "application_fee_amount": 500,
  "booking_id": "booking_123"
}
```

### onboard-provider
Starts Stripe Connect onboarding for providers.

**Endpoint**: `POST /functions/v1/onboard-provider`

**Body**:
```json
{
  "user_id": "user_123",
  "email": "provider@example.com",
  "country": "US"
}
```

## Database Schema

### users table additions:
- `stripe_customer_id`: Stripe customer ID for subscriptions
- `stripe_account_id`: Stripe Connect account ID (for providers)
- `stripe_account_verified`: Whether provider account is verified
- `is_premium`: Premium subscription status
- `subscription_expires_at`: When subscription period ends
- `trial_ends_at`: When free trial ends
- `subscription_cancelled_at`: When user cancelled (for tracking)

### New tables:
- `bookings`: Service bookings between users and providers
- `transformations`: Photo transformations (for usage tracking)
- `services`: Services offered by providers

## Usage Examples

### Display Subscription Screen

```typescript
import SubscriptionScreen from './src/screens/profile/SubscriptionScreen';

<SubscriptionScreen 
  userId={currentUser.id}
  userEmail={currentUser.email}
  navigation={navigation}
/>
```

### Check Feature Access

```typescript
import { useSubscription } from './src/hooks/useSubscription';

const MyComponent = () => {
  const { checkFeatureAccess, showUpgradePrompt } = useSubscription(userId);
  
  const handleCreateTransformation = () => {
    if (!checkFeatureAccess('create_transformation')) {
      showUpgradePrompt('Create unlimited transformations');
      return;
    }
    
    // Continue with creation
  };
};
```

### Process Booking Payment

```typescript
import stripeService from './src/services/stripe';

const handleBooking = async () => {
  try {
    const result = await stripeService.processBookingPayment({
      amount: bookingAmount,
      providerId: provider.stripe_account_id,
      providerName: provider.business_name,
      bookingId: booking.id,
    });
    
    console.log('Payment successful:', result.paymentIntent.id);
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

### Show Upgrade Prompt

```typescript
import UpgradePromptModal from './src/components/modals/UpgradePromptModal';

const [showUpgrade, setShowUpgrade] = useState(false);

<UpgradePromptModal
  visible={showUpgrade}
  onClose={() => setShowUpgrade(false)}
  onUpgrade={() => {
    setShowUpgrade(false);
    navigation.navigate('Subscription');
  }}
  highlightFeature="Export without watermarks"
/>
```

## Testing

### Test Mode
Use Stripe test keys (starting with `pk_test_` and `sk_test_`) for development.

### Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

Use any future expiration date and any 3-digit CVC.

### Webhook Testing
Use Stripe CLI to forward webhooks to local environment:

```bash
stripe listen --forward-to https://your-project.supabase.co/functions/v1/webhook
```

## Security Considerations

1. **Never expose secret keys** - Only use publishable key in frontend
2. **Validate webhooks** - Always verify webhook signatures
3. **Use RLS policies** - Database access is restricted by user
4. **Secure Edge Functions** - Require authentication headers
5. **Handle errors gracefully** - Don't expose sensitive error details

## Support

For issues with:
- Stripe integration: https://stripe.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- Payment flows: Check webhook logs in Stripe dashboard

## License

MIT
