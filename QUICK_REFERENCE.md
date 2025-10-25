# 🚀 Quick Reference Card

## Essential Commands

### Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Setup database
supabase db push

# Deploy functions
make deploy
make secrets
```

### Development
```bash
# Run tests
npm test

# Test functions locally
supabase functions serve

# View logs
make logs
```

### Production
```bash
# Deploy all functions
make deploy

# Set secrets
make secrets

# Monitor webhooks
# Check Stripe Dashboard > Developers > Webhooks
```

---

## Key Imports

### Stripe Service
```typescript
import stripeService from './src/services/stripe';

// Create subscription
await stripeService.createSubscription(userId, priceId);

// Process payment
await stripeService.processBookingPayment(bookingData);

// Get status
const status = await stripeService.getSubscriptionStatus(userId);
```

### Subscription Hook
```typescript
import { useSubscription } from './src/hooks/useSubscription';

const { 
  status,           // Full status object
  isPremium,        // Boolean
  isTrialActive,    // Boolean
  checkFeatureAccess,  // (feature) => boolean
  showUpgradePrompt,   // (message) => void
  refreshStatus,    // () => Promise<void>
} = useSubscription(userId);
```

### Components
```typescript
// Subscription Screen
import SubscriptionScreen from './src/screens/profile/SubscriptionScreen';
<SubscriptionScreen userId={user.id} userEmail={user.email} />

// Upgrade Modal
import UpgradePromptModal from './src/components/modals/UpgradePromptModal';
<UpgradePromptModal visible={show} onClose={close} onUpgrade={upgrade} />
```

---

## API Endpoints

### Base URL
```
https://your-project.supabase.co/functions/v1
```

### Endpoints
```
POST   /create-subscription       # Create new subscription
POST   /cancel-subscription       # Cancel existing subscription
GET    /subscription-status/:id   # Get user subscription status
POST   /create-booking-payment    # Process marketplace payment
POST   /onboard-provider          # Onboard new provider
POST   /webhook                   # Stripe webhook handler
```

---

## Environment Variables

### Required
```bash
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID_PREMIUM_MONTHLY=price_xxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

---

## Test Cards

```
Success:         4242 4242 4242 4242
Decline:         4000 0000 0000 0002
Insufficient:    4000 0000 0000 9995
3D Secure:       4000 0025 0000 3155
```

Use any future expiry and any 3-digit CVC.

---

## Pricing

### Subscription
- **Free**: 3 transformations/month
- **Premium**: $4.99/month, unlimited
- **Trial**: 7 days free

### Marketplace
- **Commission**: 10% platform fee
- **Minimum**: $10.00
- **Maximum**: $1,000.00

---

## Feature Access

```typescript
// Check access
if (!checkFeatureAccess('create_transformation')) {
  showUpgradePrompt('Create unlimited transformations');
  return;
}

// Available features
'create_transformation'
'export_without_watermark'
'premium_stickers'
'featured_listing'
'advanced_analytics'
'priority_support'
'ad_free'
```

---

## Database Tables

### users (additions)
```sql
stripe_customer_id          TEXT
stripe_account_id           TEXT
stripe_account_verified     BOOLEAN
is_premium                  BOOLEAN
subscription_expires_at     TIMESTAMP
trial_ends_at              TIMESTAMP
```

### bookings
```sql
id, user_id, provider_id, amount,
payment_intent_id, payment_status,
booking_date, status, etc.
```

### transformations
```sql
id, user_id, original_image_url,
transformed_image_url, status,
has_watermark, created_at, etc.
```

---

## Webhook Events

```typescript
'customer.subscription.created'
'customer.subscription.updated'
'customer.subscription.deleted'
'invoice.payment_succeeded'
'invoice.payment_failed'
'payment_intent.succeeded'
'payment_intent.payment_failed'
'account.updated'
```

---

## Common Patterns

### Create Subscription Flow
```typescript
try {
  const result = await stripeService.createSubscription(
    userId,
    'price_premium_monthly'
  );
  Alert.alert('Success', 'Welcome to Premium!');
  refreshStatus();
} catch (error) {
  Alert.alert('Error', error.message);
}
```

### Check Feature & Gate
```typescript
const handleFeature = () => {
  if (!checkFeatureAccess('premium_stickers')) {
    showUpgradePrompt('Access premium stickers');
    return;
  }
  // Continue with feature
};
```

### Process Booking Payment
```typescript
const result = await stripeService.processBookingPayment({
  amount: booking.price,
  providerId: provider.stripeAccountId,
  providerName: provider.name,
  bookingId: booking.id,
});
```

---

## Utilities

```typescript
import { 
  formatCurrency,        // (50.99) => "$50.99"
  dollarsToCents,        // (50.99) => 5099
  centsToDollars,        // (5099) => 50.99
  calculateCommission,   // (100, 10) => {amount, commission, providerReceives}
  formatDate,            // "2024-01-01" => "January 1, 2024"
  validatePaymentAmount, // (amount, min, max) => {valid, error?}
  parseStripeError,      // (error) => "User-friendly message"
} from './src/utils/payment';
```

---

## Debugging

### Check Stripe Dashboard
1. Dashboard > Payments (view all payments)
2. Dashboard > Subscriptions (view all subscriptions)
3. Dashboard > Webhooks (view webhook logs)
4. Dashboard > Logs (view API logs)

### Check Supabase Logs
```bash
supabase functions logs webhook
supabase functions logs create-subscription
```

### Common Issues
- **Payment sheet not showing**: Check StripeProvider
- **Webhook not firing**: Verify URL and secret
- **Status not updating**: Check webhook events
- **Provider can't receive**: Complete onboarding

---

## File Locations

```
📄 Types:        src/types/payment.ts
📄 Config:       src/config/payment.ts
📄 Utils:        src/utils/payment.ts
📄 Service:      src/services/stripe.ts
📄 Hook:         src/hooks/useSubscription.ts
📄 Screen:       src/screens/profile/SubscriptionScreen.tsx
📄 Modal:        src/components/modals/UpgradePromptModal.tsx
📄 Migration:    supabase/migrations/20231025_add_payment_fields.sql
📁 Functions:    supabase/functions/*/index.ts
```

---

## Documentation

- **Setup Guide**: PAYMENT_SETUP.md
- **Implementation**: IMPLEMENTATION_SUMMARY.md
- **Structure**: PROJECT_STRUCTURE.md
- **Main Docs**: README.md

---

## Support

- **Stripe**: https://stripe.com/docs
- **Supabase**: https://supabase.com/docs
- **React Native Stripe**: https://stripe.dev/stripe-react-native

---

**Quick Start**: `npm install` → `cp .env.example .env` → `make deploy` → Done! 🎉
