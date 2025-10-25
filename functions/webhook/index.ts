import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@12.9.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2022-11-15',
});

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return new Response(
        JSON.stringify({ error: 'Missing Stripe signature' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event, supabaseClient);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event, supabaseClient);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event, supabaseClient);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event, supabaseClient);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event, supabaseClient);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event, supabaseClient);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event, supabaseClient);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Webhook error:', error);
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

// Handle subscription created
async function handleSubscriptionCreated(event: Stripe.Event, supabaseClient: any) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  try {
    // Get user by Stripe customer ID
    const { data: user } = await supabaseClient
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // Update user subscription status
    await supabaseClient
      .from('users')
      .update({
        is_premium: true,
        subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_ends_at: subscription.trial_end 
          ? new Date(subscription.trial_end * 1000).toISOString() 
          : null,
      })
      .eq('id', user.id);

    console.log('Subscription created for user:', user.id);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(event: Stripe.Event, supabaseClient: any) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  try {
    // Get user by Stripe customer ID
    const { data: user } = await supabaseClient
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
    const isTrialing = subscription.status === 'trialing';

    // Update user subscription status
    await supabaseClient
      .from('users')
      .update({
        is_premium: isActive,
        subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_ends_at: isTrialing && subscription.trial_end 
          ? new Date(subscription.trial_end * 1000).toISOString() 
          : null,
      })
      .eq('id', user.id);

    console.log('Subscription updated for user:', user.id, 'Status:', subscription.status);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(event: Stripe.Event, supabaseClient: any) {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = subscription.customer as string;

  try {
    // Get user by Stripe customer ID
    const { data: user } = await supabaseClient
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // Update user subscription status
    await supabaseClient
      .from('users')
      .update({
        is_premium: false,
        subscription_expires_at: null,
        trial_ends_at: null,
      })
      .eq('id', user.id);

    console.log('Subscription deleted for user:', user.id);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

// Handle payment succeeded
async function handlePaymentSucceeded(event: Stripe.Event, supabaseClient: any) {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = invoice.customer as string;

  try {
    // Get user by Stripe customer ID
    const { data: user } = await supabaseClient
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // Log successful payment
    console.log('Payment succeeded for user:', user.id, 'Amount:', invoice.amount_paid);
    
    // You could add payment history tracking here
    await supabaseClient
      .from('payment_history')
      .insert({
        user_id: user.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'succeeded',
        stripe_invoice_id: invoice.id,
        created_at: new Date().toISOString(),
      });

  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

// Handle payment failed
async function handlePaymentFailed(event: Stripe.Event, supabaseClient: any) {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = invoice.customer as string;

  try {
    // Get user by Stripe customer ID
    const { data: user } = await supabaseClient
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!user) {
      console.error('User not found for customer:', customerId);
      return;
    }

    // Log failed payment
    console.log('Payment failed for user:', user.id, 'Amount:', invoice.amount_due);
    
    // You could add payment history tracking here
    await supabaseClient
      .from('payment_history')
      .insert({
        user_id: user.id,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: 'failed',
        stripe_invoice_id: invoice.id,
        created_at: new Date().toISOString(),
      });

  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Handle payment intent succeeded (for booking payments)
async function handlePaymentIntentSucceeded(event: Stripe.Event, supabaseClient: any) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const bookingId = paymentIntent.metadata?.booking_id;

  if (!bookingId) {
    console.log('Payment intent succeeded but no booking ID found');
    return;
  }

  try {
    // Update booking status to confirmed
    await supabaseClient
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_intent_id: paymentIntent.id,
        payment_status: 'succeeded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    console.log('Booking payment succeeded:', bookingId);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

// Handle payment intent failed (for booking payments)
async function handlePaymentIntentFailed(event: Stripe.Event, supabaseClient: any) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const bookingId = paymentIntent.metadata?.booking_id;

  if (!bookingId) {
    console.log('Payment intent failed but no booking ID found');
    return;
  }

  try {
    // Update booking status to payment_failed
    await supabaseClient
      .from('bookings')
      .update({
        status: 'payment_failed',
        payment_intent_id: paymentIntent.id,
        payment_status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    console.log('Booking payment failed:', bookingId);
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}