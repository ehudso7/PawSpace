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
    const { price_id, user_id } = await req.json()

    if (!price_id || !user_id) {
      throw new Error('Missing required parameters: price_id, user_id')
    }

    // Verify user_id matches authenticated user
    if (user.id !== user_id) {
      throw new Error('Unauthorized: user_id mismatch')
    }

    // Check if user already has a customer ID
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', user_id)
      .single()

    if (userError) {
      throw new Error(`Failed to fetch user data: ${userError.message}`)
    }

    let customerId = userData?.stripe_customer_id

    // Create or retrieve customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email || user.email,
        metadata: { 
          user_id: user_id,
          created_via: 'pawspace_app'
        },
      })
      
      customerId = customer.id

      // Update user with customer ID
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user_id)

      if (updateError) {
        console.error('Failed to update user with customer ID:', updateError)
      }
    }

    // Check for existing active subscription
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    if (existingSubscriptions.data.length > 0) {
      throw new Error('User already has an active subscription')
    }

    // Create subscription with 7-day trial
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: price_id }],
      trial_period_days: 7,
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        user_id: user_id,
        created_via: 'pawspace_app'
      },
    })

    // Update user subscription status in database
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 7)

    const { error: subscriptionUpdateError } = await supabaseClient
      .from('users')
      .update({
        is_premium: true,
        trial_ends_at: trialEndsAt.toISOString(),
        subscription_id: subscription.id,
      })
      .eq('id', user_id)

    if (subscriptionUpdateError) {
      console.error('Failed to update user subscription status:', subscriptionUpdateError)
    }

    const paymentIntent = subscription.latest_invoice?.payment_intent

    return new Response(
      JSON.stringify({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
        customerId: customerId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Create subscription error:', error)
    
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