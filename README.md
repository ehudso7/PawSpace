# PawSpace Payment System

A complete Stripe payment system implementation with subscriptions and marketplace transactions for React Native and Supabase.

## Features

### 🎯 Core Payment Features
- **Subscription Management**: Create, manage, and cancel premium subscriptions
- **Marketplace Transactions**: Process payments between users and service providers
- **Stripe Connect**: Provider onboarding for marketplace payments
- **Freemium Gating**: Feature access control based on subscription status
- **7-day Free Trial**: Automatic trial period for new subscriptions

### 💳 Payment Processing
- **Secure Payment Processing**: Stripe-powered payment handling
- **Multiple Payment Methods**: Support for cards and other Stripe payment methods
- **Application Fees**: 10% commission on marketplace transactions
- **Webhook Handling**: Real-time subscription and payment status updates
- **Error Handling**: Comprehensive error handling and user feedback

### 🎨 User Interface
- **Subscription Screen**: Beautiful subscription management interface
- **Payment Flow**: Streamlined booking payment process
- **Loading States**: Professional loading indicators
- **Error Boundaries**: Graceful error handling
- **Responsive Design**: Mobile-optimized interface

## Architecture

### Frontend (React Native)
- **Stripe React Native SDK**: Payment processing
- **Custom Hooks**: `useSubscription`, `usePayment`
- **Error Handling**: Comprehensive error management
- **TypeScript**: Full type safety

### Backend (Supabase Edge Functions)
- **Subscription Management**: Create, cancel, and check subscription status
- **Payment Processing**: Handle booking payments with Stripe Connect
- **Webhook Handling**: Process Stripe webhook events
- **Provider Onboarding**: Stripe Connect account creation

### Database Schema
- **Users Table**: Stripe customer and account IDs
- **Subscriptions**: Track subscription status and history
- **Bookings**: Marketplace transaction records
- **Payment History**: Complete payment audit trail

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your Stripe and Supabase credentials
   ```

3. **Database Setup**
   ```bash
   # Run the migration to add Stripe fields
   psql -d your_database -f database/migrations/add_stripe_fields.sql
   ```

4. **Deploy Edge Functions**
   ```bash
   # Deploy to Supabase
   supabase functions deploy create-subscription
   supabase functions deploy cancel-subscription
   supabase functions deploy create-booking-payment
   supabase functions deploy subscription-status
   supabase functions deploy webhook
   supabase functions deploy provider-onboarding
   supabase functions deploy check-provider-status
   ```

## Configuration

### Stripe Setup
1. Create a Stripe account and get your API keys
2. Set up webhook endpoints pointing to your Supabase function
3. Create a subscription price in Stripe Dashboard
4. Update the `price_premium_monthly` ID in the database

### Supabase Setup
1. Create a new Supabase project
2. Run the database migrations
3. Set up Row Level Security policies
4. Deploy the Edge Functions

## Usage

### Subscription Management
```typescript
import { useSubscription } from './hooks/useSubscription';

const { 
  status, 
  createSubscription, 
  cancelSubscription,
  checkFeatureAccess 
} = useSubscription(userId);

// Check if user can access a feature
if (!checkFeatureAccess('unlimited_transformations')) {
  showUpgradePrompt('Unlimited transformations');
}
```

### Payment Processing
```typescript
import { usePayment } from './hooks/usePayment';

const { processBookingPayment } = usePayment();

const bookingData = {
  amount: 50.00,
  providerId: 'acct_provider123',
  providerName: 'Pet Grooming Service',
  bookingId: 'booking_456'
};

const result = await processBookingPayment(bookingData);
```

### Provider Onboarding
```typescript
import { stripeService } from './services/stripe';

const onboardingUrl = await stripeService.onboardProvider(userId, email);
// Open onboardingUrl in a webview
```

## API Endpoints

### Subscription Endpoints
- `POST /functions/v1/create-subscription` - Create new subscription
- `POST /functions/v1/cancel-subscription` - Cancel subscription
- `GET /functions/v1/subscription-status/{userId}` - Get subscription status

### Payment Endpoints
- `POST /functions/v1/create-booking-payment` - Process booking payment
- `POST /functions/v1/provider-onboarding` - Start provider onboarding
- `GET /functions/v1/check-provider-status` - Check provider account status

### Webhook Endpoint
- `POST /functions/v1/webhook` - Handle Stripe webhook events

## Database Schema

### Users Table
```sql
ALTER TABLE users 
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_account_id TEXT,
ADD COLUMN is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN subscription_expires_at TIMESTAMPTZ,
ADD COLUMN trial_ends_at TIMESTAMPTZ;
```

### Additional Tables
- `subscription_plans` - Available subscription plans
- `user_subscriptions` - User subscription history
- `bookings` - Marketplace transactions
- `payment_history` - Payment audit trail
- `providers` - Service provider accounts

## Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Automatic retry with user feedback
- **Payment Errors**: Stripe-specific error messages
- **Validation Errors**: Clear validation feedback
- **Error Boundaries**: Graceful error recovery

## Security

- **Row Level Security**: Database access control
- **JWT Authentication**: Secure API access
- **Webhook Verification**: Stripe signature validation
- **Input Validation**: Server-side validation

## Testing

1. **Unit Tests**: Test individual components and hooks
2. **Integration Tests**: Test payment flows end-to-end
3. **Stripe Test Mode**: Use Stripe test cards for development

## Deployment

1. **Frontend**: Deploy to Expo or build native apps
2. **Backend**: Deploy Edge Functions to Supabase
3. **Database**: Run migrations on production database
4. **Webhooks**: Configure Stripe webhook endpoints

## Support

For issues and questions:
1. Check the error logs in Supabase Dashboard
2. Verify Stripe webhook delivery
3. Test with Stripe test cards
4. Review the comprehensive error handling

## License

MIT License - see LICENSE file for details.