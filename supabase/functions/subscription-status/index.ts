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

    // Extract user_id from URL path
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/')
    const user_id = pathParts[pathParts.length - 1]

    if (!user_id) {
      throw new Error('Missing user_id parameter')
    }

    // Verify user_id matches authenticated user
    if (user.id !== user_id) {
      throw new Error('Unauthorized: user_id mismatch')
    }

    // Get user data from database
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select(`
        stripe_customer_id,
        subscription_id,
        is_premium,
        subscription_expires_at,
        trial_ends_at,
        subscription_cancelled_at
      `)
      .eq('id', user_id)
      .single()

    if (userError) {
      throw new Error(`Failed to fetch user data: ${userError.message}`)
    }

    // Default status for free users
    let subscriptionStatus = {
      is_premium: false,
      plan: 'free' as const,
      is_trial: false,
      can_cancel: false,
      customer_id: userData?.stripe_customer_id,
    }

    // If user has a subscription ID, get details from Stripe
    if (userData?.subscription_id && userData?.stripe_customer_id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(userData.subscription_id)
        
        const now = new Date()
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
        const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
        
        // Determine if user is in trial
        const isInTrial = trialEnd && now < trialEnd
        
        // Determine if subscription is active
        const isActive = subscription.status === 'active' || subscription.status === 'trialing'
        
        // Check if subscription is cancelled but still active
        const isCancelled = subscription.cancel_at_period_end || userData.subscription_cancelled_at
        
        subscriptionStatus = {
          is_premium: isActive,
          plan: isActive ? 'premium' : 'free',
          expires_at: currentPeriodEnd.toISOString(),
          is_trial: Boolean(isInTrial),
          trial_ends_at: trialEnd?.toISOString(),
          can_cancel: isActive && !isCancelled,
          subscription_id: subscription.id,
          customer_id: userData.stripe_customer_id,
        }

        // Update local database if there's a mismatch
        if (userData.is_premium !== isActive) {
          const { error: updateError } = await supabaseClient
            .from('users')
            .update({
              is_premium: isActive,
              subscription_expires_at: currentPeriodEnd.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', user_id)

          if (updateError) {
            console.error('Failed to sync user subscription status:', updateError)
          }
        }

      } catch (stripeError) {
        console.error('Error fetching subscription from Stripe:', stripeError)
        
        // If subscription doesn't exist in Stripe, clean up local data
        if (stripeError.code === 'resource_missing') {
          const { error: cleanupError } = await supabaseClient
            .from('users')
            .update({
              subscription_id: null,
              is_premium: false,
              subscription_expires_at: null,
              trial_ends_at: null,
              subscription_cancelled_at: null,
            })
            .eq('id', user_id)

          if (cleanupError) {
            console.error('Failed to cleanup invalid subscription data:', cleanupError)
          }
        }
      }
    }

    return new Response(
      JSON.stringify(subscriptionStatus),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Subscription status error:', error)
    
    // Return default free status on error
    return new Response(
      JSON.stringify({
        is_premium: false,
        plan: 'free',
        is_trial: false,
        can_cancel: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 with error info rather than failing completely
      }
    )
  }
})