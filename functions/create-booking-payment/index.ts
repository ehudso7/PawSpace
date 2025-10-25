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

    const { 
      amount, 
      provider_stripe_account_id, 
      application_fee_amount, 
      booking_id 
    } = await req.json();

    if (!amount || !provider_stripe_account_id || !booking_id) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: amount, provider_stripe_account_id, booking_id' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify the booking exists and belongs to the user
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('*, provider:providers(*)')
      .eq('id', booking_id)
      .eq('user_id', user.id)
      .single();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found or unauthorized' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify provider has Stripe account
    if (booking.provider.stripe_account_id !== provider_stripe_account_id) {
      return new Response(
        JSON.stringify({ error: 'Provider Stripe account mismatch' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get or create customer for the user
    let customer;
    const { data: userData } = await supabaseClient
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userData?.stripe_customer_id) {
      customer = await stripe.customers.retrieve(userData.stripe_customer_id);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });

      await supabaseClient
        .from('users')
        .update({ stripe_customer_id: customer.id })
        .eq('id', user.id);
    }

    // Create payment intent with Stripe Connect
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'usd',
      customer: customer.id,
      application_fee_amount: Math.round(application_fee_amount),
      transfer_data: {
        destination: provider_stripe_account_id,
      },
      metadata: {
        booking_id,
        user_id: user.id,
        provider_id: booking.provider.id,
      },
      description: `Booking payment for ${booking.provider.name}`,
    });

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error creating booking payment:', error);
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