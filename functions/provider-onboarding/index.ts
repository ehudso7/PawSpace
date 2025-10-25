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

    const { user_id, email } = await req.json();

    if (!user_id || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, email' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify user_id matches the authenticated user
    if (user.id !== user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID mismatch' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user already has a Stripe account
    const { data: existingUser } = await supabaseClient
      .from('users')
      .select('stripe_account_id')
      .eq('id', user_id)
      .single();

    if (existingUser?.stripe_account_id) {
      // Check if account is already onboarded
      try {
        const account = await stripe.accounts.retrieve(existingUser.stripe_account_id);
        
        if (account.details_submitted) {
          return new Response(
            JSON.stringify({ 
              error: 'Account already onboarded',
              account_id: existingUser.stripe_account_id,
              onboarding_complete: true 
            }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      } catch (error) {
        console.error('Error checking existing account:', error);
        // Continue with creating new account
      }
    }

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US', // You might want to make this dynamic based on user location
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        user_id: user_id,
        app_name: 'PawSpace',
      },
    });

    // Update user record with Stripe account ID
    await supabaseClient
      .from('users')
      .update({ stripe_account_id: account.id })
      .eq('id', user_id);

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${Deno.env.get('APP_URL')}/provider-onboarding?refresh=true`,
      return_url: `${Deno.env.get('APP_URL')}/provider-dashboard?success=true`,
      type: 'account_onboarding',
    });

    return new Response(
      JSON.stringify({
        onboarding_url: accountLink.url,
        account_id: account.id,
        onboarding_complete: false,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error creating provider onboarding:', error);
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