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

    // Get user's Stripe account ID
    const { data: userData } = await supabaseClient
      .from('users')
      .select('stripe_account_id')
      .eq('id', user.id)
      .single();

    if (!userData?.stripe_account_id) {
      return new Response(
        JSON.stringify({
          has_account: false,
          onboarding_complete: false,
          can_receive_payments: false,
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    try {
      // Get account details from Stripe
      const account = await stripe.accounts.retrieve(userData.stripe_account_id);
      
      const onboardingComplete = account.details_submitted;
      const canReceivePayments = account.charges_enabled && account.payouts_enabled;
      
      // Get account requirements
      const requirements = account.requirements;
      const missingRequirements = requirements?.currently_due || [];
      const pastDueRequirements = requirements?.past_due || [];

      return new Response(
        JSON.stringify({
          has_account: true,
          account_id: account.id,
          onboarding_complete: onboardingComplete,
          can_receive_payments: canReceivePayments,
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          missing_requirements: missingRequirements,
          past_due_requirements: pastDueRequirements,
          account_status: account.details_submitted ? 'complete' : 'incomplete',
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (stripeError) {
      console.error('Error fetching Stripe account:', stripeError);
      
      return new Response(
        JSON.stringify({
          has_account: true,
          account_id: userData.stripe_account_id,
          onboarding_complete: false,
          can_receive_payments: false,
          error: 'Failed to fetch account status',
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error('Error checking provider status:', error);
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