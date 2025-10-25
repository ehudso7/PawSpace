-- Add Stripe-related fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT,
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_stripe_account_id ON users(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_users_is_premium ON users(is_premium);

-- Create payment_history table for tracking payments
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL, -- 'succeeded', 'failed', 'pending'
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for payment_history
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at);

-- Update bookings table to include payment fields
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending', -- 'pending', 'succeeded', 'failed'
ADD COLUMN IF NOT EXISTS amount INTEGER, -- Amount in cents
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'usd';

-- Add indexes for bookings payment fields
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent_id ON bookings(payment_intent_id);

-- Create providers table if it doesn't exist (for service providers)
CREATE TABLE IF NOT EXISTS providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  stripe_account_id TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add indexes for providers
CREATE INDEX IF NOT EXISTS idx_providers_user_id ON providers(user_id);
CREATE INDEX IF NOT EXISTS idx_providers_stripe_account_id ON providers(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_providers_is_verified ON providers(is_verified);

-- Create subscription_plans table for managing different plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  interval TEXT NOT NULL, -- 'month', 'year'
  stripe_price_id TEXT NOT NULL UNIQUE,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default subscription plan
INSERT INTO subscription_plans (name, description, price, currency, interval, stripe_price_id, features)
VALUES (
  'Premium Monthly',
  'PawSpace Premium Monthly Subscription',
  499, -- $4.99 in cents
  'usd',
  'month',
  'price_premium_monthly', -- This should be replaced with actual Stripe price ID
  '["unlimited_transformations", "no_watermarks", "premium_stickers", "featured_listings", "advanced_analytics", "priority_support", "ad_free"]'::jsonb
) ON CONFLICT (stripe_price_id) DO NOTHING;

-- Create user_subscriptions table for tracking subscription history
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id TEXT NOT NULL, -- Stripe subscription ID
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'unpaid'
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for user_subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_subscription_id ON user_subscriptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- Add RLS policies for new tables
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Payment history policies
CREATE POLICY "Users can view their own payment history" ON payment_history
  FOR SELECT USING (auth.uid() = user_id);

-- Providers policies
CREATE POLICY "Users can view all providers" ON providers
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own provider profile" ON providers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own provider profile" ON providers
  FOR UPDATE USING (auth.uid() = user_id);

-- Subscription plans policies
CREATE POLICY "Anyone can view active subscription plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

-- User subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);