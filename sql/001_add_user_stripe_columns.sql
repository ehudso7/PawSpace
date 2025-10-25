-- Add Stripe-related columns to users table
alter table if exists public.users
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_account_id text,
  add column if not exists is_premium boolean default false,
  add column if not exists subscription_expires_at timestamptz,
  add column if not exists trial_ends_at timestamptz;