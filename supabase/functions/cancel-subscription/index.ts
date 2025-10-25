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
    const { subscription_id } = await req.json()

    if (!subscription_id) {
      throw new Error('Missing required parameter: subscription_id')
    }

    // Verify subscription belongs to user
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('stripe_customer_id, subscription_id')
      .eq('id', user.id)
      .single()

    if (userError) {
      throw new Error(`Failed to fetch user data: ${userError.message}`)
    }

    if (userData.subscription_id !== subscription_id) {
      throw new Error('Unauthorized: subscription does not belong to user')
    }

    // Get subscription from Stripe to verify it exists and get details
    const subscription = await stripe.subscriptions.retrieve(subscription_id)

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    if (subscription.customer !== userData.stripe_customer_id) {
      throw new Error('Unauthorized: subscription customer mismatch')
    }

    // Cancel subscription at period end (user keeps access until billing period ends)
    const canceledSubscription = await stripe.subscriptions.update(subscription_id, {
      cancel_at_period_end: true,
      metadata: {
        ...subscription.metadata,
        cancelled_by: 'user',
        cancelled_at: new Date().toISOString(),
      }
    })

    // Update user record to reflect cancellation
    const { error: updateError } = await supabaseClient
      .from('users')
      .update({
        subscription_cancelled_at: new Date().toISOString(),
        subscription_expires_at: new Date(canceledSubscription.current_period_end * 1000).toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update user cancellation status:', updateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        subscription: {
          id: canceledSubscription.id,
          cancel_at_period_end: canceledSubscription.cancel_at_period_end,
          current_period_end: canceledSubscription.current_period_end,
        },
        message: 'Subscription cancelled successfully. Access will continue until the end of the billing period.',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Cancel subscription error:', error)
    
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