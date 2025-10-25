import Stripe from 'https://esm.sh/stripe@14.5.0';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
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
    const { user_id, email, country = 'US' } = await req.json();

    if (!user_id || !email) {
      throw new Error('Missing required fields: user_id and email');
    }

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

    // Check if user already has a Stripe Connect account
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('stripe_account_id')
      .eq('id', user_id)
      .single();

    if (userError) {
      throw new Error('User not found');
    }

    let accountId = userData.stripe_account_id;

    // Create Stripe Connect account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: country,
        email: email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        metadata: {
          user_id: user_id,
        },
      });

      accountId = account.id;

      // Update user with account ID
      await supabaseClient
        .from('users')
        .update({ 
          stripe_account_id: accountId,
          stripe_account_verified: false,
        })
        .eq('id', user_id);
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${Deno.env.get('APP_URL') || 'pawspace://'}provider-onboarding?refresh=true`,
      return_url: `${Deno.env.get('APP_URL') || 'pawspace://'}provider-dashboard`,
      type: 'account_onboarding',
    });

    return new Response(
      JSON.stringify({
        accountId: accountId,
        onboardingUrl: accountLink.url,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error onboarding provider:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
