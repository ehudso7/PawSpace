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
    const { user_id, email } = await req.json()

    if (!user_id || !email) {
      throw new Error('Missing required parameters: user_id, email')
    }

    // Verify user_id matches authenticated user
    if (user.id !== user_id) {
      throw new Error('Unauthorized: user_id mismatch')
    }

    // Check if user already has a Stripe Connect account
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('stripe_account_id, is_provider')
      .eq('id', user_id)
      .single()

    if (userError) {
      throw new Error(`Failed to fetch user data: ${userError.message}`)
    }

    let accountId = userData?.stripe_account_id

    // Create Stripe Connect account if doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US', // You might want to make this configurable
        email: email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual', // Default to individual, can be updated later
        metadata: {
          user_id: user_id,
          created_via: 'pawspace_app',
        },
      })

      accountId = account.id

      // Update user with Stripe account ID
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({
          stripe_account_id: accountId,
          is_provider: true,
          provider_onboarding_started_at: new Date().toISOString(),
        })
        .eq('id', user_id)

      if (updateError) {
        console.error('Failed to update user with Stripe account ID:', updateError)
        throw new Error('Failed to save provider account information')
      }
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${Deno.env.get('APP_URL') || 'pawspace://'}provider-onboarding?refresh=true`,
      return_url: `${Deno.env.get('APP_URL') || 'pawspace://'}provider-dashboard?onboarding=complete`,
      type: 'account_onboarding',
    })

    // Check current account status
    const account = await stripe.accounts.retrieve(accountId)

    return new Response(
      JSON.stringify({
        accountId: accountId,
        onboardingUrl: accountLink.url,
        accountStatus: {
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          details_submitted: account.details_submitted,
        },
        message: account.details_submitted 
          ? 'Provider account is already set up' 
          : 'Complete the onboarding process to start receiving payments',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Provider onboarding error:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An unexpected error occurred during provider onboarding',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})