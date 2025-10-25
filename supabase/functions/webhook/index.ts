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

    // Initialize Supabase client with service role key for webhook operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify webhook signature
    const signature = req.headers.get('stripe-signature')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!signature || !webhookSecret) {
      throw new Error('Missing webhook signature or secret')
    }

    const body = await req.text()
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      throw new Error('Invalid webhook signature')
    }

    console.log('Processing webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabaseClient)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabaseClient)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabaseClient)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabaseClient)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabaseClient)
        break

      case 'payment_intent.succeeded':
        await handleBookingPaymentSucceeded(event.data.object as Stripe.PaymentIntent, supabaseClient)
        break

      case 'payment_intent.payment_failed':
        await handleBookingPaymentFailed(event.data.object as Stripe.PaymentIntent, supabaseClient)
        break

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account, supabaseClient)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'Webhook processing failed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  supabaseClient: any
) {
  const userId = subscription.metadata?.user_id
  if (!userId) {
    console.error('No user_id in subscription metadata')
    return
  }

  const isTrialing = subscription.status === 'trialing'
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null

  const { error } = await supabaseClient
    .from('users')
    .update({
      subscription_id: subscription.id,
      is_premium: true,
      subscription_expires_at: currentPeriodEnd.toISOString(),
      trial_ends_at: trialEnd?.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Failed to update user subscription created:', error)
  }
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabaseClient: any
) {
  const userId = subscription.metadata?.user_id
  if (!userId) {
    console.error('No user_id in subscription metadata')
    return
  }

  const isActive = subscription.status === 'active' || subscription.status === 'trialing'
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
  const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null

  const updateData: any = {
    is_premium: isActive,
    subscription_expires_at: currentPeriodEnd.toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (trialEnd) {
    updateData.trial_ends_at = trialEnd.toISOString()
  }

  if (subscription.cancel_at_period_end) {
    updateData.subscription_cancelled_at = new Date().toISOString()
  }

  const { error } = await supabaseClient
    .from('users')
    .update(updateData)
    .eq('id', userId)

  if (error) {
    console.error('Failed to update user subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabaseClient: any
) {
  const userId = subscription.metadata?.user_id
  if (!userId) {
    console.error('No user_id in subscription metadata')
    return
  }

  const { error } = await supabaseClient
    .from('users')
    .update({
      subscription_id: null,
      is_premium: false,
      subscription_expires_at: null,
      trial_ends_at: null,
      subscription_cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    console.error('Failed to update user subscription deleted:', error)
  }
}

async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabaseClient: any
) {
  if (invoice.subscription) {
    // This is a subscription payment
    const subscriptionId = typeof invoice.subscription === 'string' 
      ? invoice.subscription 
      : invoice.subscription.id

    // Find user by subscription ID
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('id')
      .eq('subscription_id', subscriptionId)
      .single()

    if (userError || !userData) {
      console.error('Failed to find user for subscription payment:', userError)
      return
    }

    // Log successful payment
    const { error: logError } = await supabaseClient
      .from('payment_logs')
      .insert({
        user_id: userData.id,
        stripe_invoice_id: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'succeeded',
        type: 'subscription',
        created_at: new Date().toISOString(),
      })

    if (logError) {
      console.error('Failed to log subscription payment:', logError)
    }
  }
}

async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  supabaseClient: any
) {
  if (invoice.subscription) {
    // This is a subscription payment failure
    const subscriptionId = typeof invoice.subscription === 'string' 
      ? invoice.subscription 
      : invoice.subscription.id

    // Find user by subscription ID
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('id, email')
      .eq('subscription_id', subscriptionId)
      .single()

    if (userError || !userData) {
      console.error('Failed to find user for failed subscription payment:', userError)
      return
    }

    // Log failed payment
    const { error: logError } = await supabaseClient
      .from('payment_logs')
      .insert({
        user_id: userData.id,
        stripe_invoice_id: invoice.id,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: 'failed',
        type: 'subscription',
        error_message: 'Payment failed',
        created_at: new Date().toISOString(),
      })

    if (logError) {
      console.error('Failed to log failed subscription payment:', logError)
    }

    // TODO: Send notification to user about failed payment
    console.log(`Subscription payment failed for user ${userData.id}`)
  }
}

async function handleBookingPaymentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabaseClient: any
) {
  const bookingId = paymentIntent.metadata?.booking_id
  if (!bookingId) {
    console.error('No booking_id in payment intent metadata')
    return
  }

  // Update booking status to paid
  const { error: bookingError } = await supabaseClient
    .from('bookings')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (bookingError) {
    console.error('Failed to update booking payment status:', bookingError)
    return
  }

  // Log successful booking payment
  const { error: logError } = await supabaseClient
    .from('payment_logs')
    .insert({
      user_id: paymentIntent.metadata?.customer_id,
      booking_id: bookingId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'succeeded',
      type: 'booking',
      created_at: new Date().toISOString(),
    })

  if (logError) {
    console.error('Failed to log booking payment:', logError)
  }

  // TODO: Send confirmation notifications to customer and provider
  console.log(`Booking payment succeeded for booking ${bookingId}`)
}

async function handleBookingPaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabaseClient: any
) {
  const bookingId = paymentIntent.metadata?.booking_id
  if (!bookingId) {
    console.error('No booking_id in payment intent metadata')
    return
  }

  // Update booking status to payment_failed
  const { error: bookingError } = await supabaseClient
    .from('bookings')
    .update({
      status: 'payment_failed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)

  if (bookingError) {
    console.error('Failed to update booking payment failure status:', bookingError)
    return
  }

  // Log failed booking payment
  const { error: logError } = await supabaseClient
    .from('payment_logs')
    .insert({
      user_id: paymentIntent.metadata?.customer_id,
      booking_id: bookingId,
      stripe_payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'failed',
      type: 'booking',
      error_message: paymentIntent.last_payment_error?.message || 'Payment failed',
      created_at: new Date().toISOString(),
    })

  if (logError) {
    console.error('Failed to log failed booking payment:', logError)
  }

  // TODO: Send notification to customer about failed payment
  console.log(`Booking payment failed for booking ${bookingId}`)
}

async function handleAccountUpdated(
  account: Stripe.Account,
  supabaseClient: any
) {
  // Update provider account status when Stripe Connect account is updated
  const { error } = await supabaseClient
    .from('users')
    .update({
      stripe_account_charges_enabled: account.charges_enabled,
      stripe_account_payouts_enabled: account.payouts_enabled,
      stripe_account_details_submitted: account.details_submitted,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_account_id', account.id)

  if (error) {
    console.error('Failed to update provider account status:', error)
  }
}