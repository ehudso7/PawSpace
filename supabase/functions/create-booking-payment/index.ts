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
    const { amount, provider_stripe_account_id, application_fee_amount, booking_id } = await req.json();

    if (!amount || !provider_stripe_account_id || !booking_id) {
      throw new Error('Missing required fields');
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

    // Verify the provider's Stripe account exists and is valid
    const { data: providerData, error: providerError } = await supabaseClient
      .from('users')
      .select('stripe_account_id, email')
      .eq('stripe_account_id', provider_stripe_account_id)
      .single();

    if (providerError || !providerData) {
      throw new Error('Provider not found or not configured for payments');
    }

    // Create payment intent with Stripe Connect
    // This transfers funds to the provider minus the application fee (10%)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Already in cents
      currency: 'usd',
      application_fee_amount: application_fee_amount, // 10% commission
      transfer_data: {
        destination: provider_stripe_account_id,
      },
      metadata: {
        booking_id: booking_id,
        provider_account_id: provider_stripe_account_id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update booking with payment intent ID
    await supabaseClient
      .from('bookings')
      .update({
        payment_intent_id: paymentIntent.id,
        payment_status: 'pending',
      })
      .eq('id', booking_id);

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating booking payment:', error);
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
