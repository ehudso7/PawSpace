import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.9.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT token
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error('User not authenticated')
    }

    // Parse request body
    const { 
      amount, 
      provider_stripe_account_id, 
      application_fee_amount, 
      booking_id,
      description 
    } = await req.json()

    if (!amount || !provider_stripe_account_id || !booking_id) {
      throw new Error('Missing required parameters: amount, provider_stripe_account_id, booking_id')
    }

    // Validate amount (minimum $0.50)
    if (amount < 50) {
      throw new Error('Amount must be at least $0.50')
    }

    // Validate application fee (should be reasonable percentage)
    const calculatedFee = Math.round(amount * 0.10) // 10%
    const feeAmount = application_fee_amount || calculatedFee

    if (feeAmount > amount * 0.20) { // Max 20% fee
      throw new Error('Application fee cannot exceed 20% of the total amount')
    }

    // Verify booking exists and belongs to user
    const { data: bookingData, error: bookingError } = await supabaseClient
      .from('bookings')
      .select('id, customer_id, provider_id, amount, status')
      .eq('id', booking_id)
      .eq('customer_id', user.id)
      .single()

    if (bookingError || !bookingData) {
      throw new Error('Booking not found or unauthorized')
    }

    if (bookingData.status === 'paid') {
      throw new Error('Booking has already been paid')
    }

    // Verify provider has valid Stripe account
    const { data: providerData, error: providerError } = await supabaseClient
      .from('users')
      .select('stripe_account_id, email')
      .eq('id', bookingData.provider_id)
      .single()

    if (providerError || !providerData?.stripe_account_id) {
      throw new Error('Provider is not set up to receive payments')
    }

    if (providerData.stripe_account_id !== provider_stripe_account_id) {
      throw new Error('Provider Stripe account ID mismatch')
    }

    // Verify the connected account is valid
    try {
      const account = await stripe.accounts.retrieve(provider_stripe_account_id)
      if (!account.charges_enabled || !account.payouts_enabled) {
        throw new Error('Provider account is not fully set up to receive payments')
      }
    } catch (error) {
      throw new Error('Invalid provider Stripe account')
    }

    // Create payment intent with Stripe Connect
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      application_fee_amount: feeAmount,
      transfer_data: {
        destination: provider_stripe_account_id,
      },
      metadata: {
        booking_id: booking_id,
        customer_id: user.id,
        provider_id: bookingData.provider_id,
        created_via: 'pawspace_app'
      },
      description: description || `PawSpace booking payment - Booking #${booking_id}`,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Update booking with payment intent ID
    const { error: updateError } = await supabaseClient
      .from('bookings')
      .update({
        payment_intent_id: paymentIntent.id,
        status: 'payment_pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking_id)

    if (updateError) {
      console.error('Failed to update booking with payment intent:', updateError)
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        applicationFee: feeAmount,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Create booking payment error:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})