import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12.9.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2022-11-15',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the JWT token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get user's subscription data from database
    const { data: userData, error: userDataError } = await supabaseClient
      .from('users')
      .select('is_premium, subscription_expires_at, trial_ends_at, stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userDataError || !userData) {
      return new Response(
        JSON.stringify({ error: 'User data not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If user has Stripe customer ID, get latest subscription from Stripe
    let stripeSubscription = null;
    if (userData.stripe_customer_id) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: userData.stripe_customer_id,
          status: 'all',
          limit: 1,
        });
        
        if (subscriptions.data.length > 0) {
          stripeSubscription = subscriptions.data[0];
        }
      } catch (stripeError) {
        console.error('Error fetching Stripe subscription:', stripeError);
        // Continue with database data if Stripe fails
      }
    }

    // Determine subscription status
    const now = new Date();
    const isTrial = userData.trial_ends_at && new Date(userData.trial_ends_at) > now;
    const isPremium = userData.is_premium || isTrial;
    
    // Check if subscription is active in Stripe
    const isStripeActive = stripeSubscription && 
      (stripeSubscription.status === 'active' || stripeSubscription.status === 'trialing');

    // Determine if user can cancel
    const canCancel = stripeSubscription && 
      stripeSubscription.status === 'active' && 
      !stripeSubscription.cancel_at_period_end;

    // Get expiration date
    let expiresAt = userData.subscription_expires_at;
    if (stripeSubscription) {
      if (stripeSubscription.status === 'trialing') {
        expiresAt = new Date(stripeSubscription.trial_end * 1000).toISOString();
      } else if (stripeSubscription.status === 'active') {
        expiresAt = new Date(stripeSubscription.current_period_end * 1000).toISOString();
      }
    }

    const subscriptionStatus = {
      is_premium: isPremium && isStripeActive,
      plan: isPremium && isStripeActive ? 'premium' : 'free',
      expires_at: expiresAt,
      is_trial: isTrial,
      trial_ends_at: userData.trial_ends_at,
      can_cancel: canCancel,
      subscription_id: stripeSubscription?.id,
    };

    return new Response(
      JSON.stringify(subscriptionStatus),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});