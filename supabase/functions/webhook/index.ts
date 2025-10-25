import Stripe from 'https://esm.sh/stripe@14.5.0';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');
  const body = await req.text();
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Initialize Supabase client with service role key for admin access
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user by customer ID
        const { data: userData } = await supabaseClient
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userData) {
          const isPremium = subscription.status === 'active' || subscription.status === 'trialing';
          const expiresAt = new Date(subscription.current_period_end * 1000);

          await supabaseClient
            .from('users')
            .update({
              is_premium: isPremium,
              subscription_expires_at: expiresAt.toISOString(),
              trial_ends_at: subscription.trial_end 
                ? new Date(subscription.trial_end * 1000).toISOString() 
                : null,
            })
            .eq('id', userData.id);

          console.log(`Updated subscription for user ${userData.id}: ${subscription.status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user by customer ID
        const { data: userData } = await supabaseClient
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userData) {
          await supabaseClient
            .from('users')
            .update({
              is_premium: false,
              subscription_expires_at: null,
              trial_ends_at: null,
            })
            .eq('id', userData.id);

          console.log(`Removed premium for user ${userData.id}`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Get user by customer ID
        const { data: userData } = await supabaseClient
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userData) {
          // Log successful payment
          console.log(`Payment succeeded for user ${userData.id}: $${invoice.amount_paid / 100}`);

          // Ensure premium status is active
          await supabaseClient
            .from('users')
            .update({
              is_premium: true,
            })
            .eq('id', userData.id);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Get user by customer ID
        const { data: userData } = await supabaseClient
          .from('users')
          .select('id, email')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userData) {
          console.error(`Payment failed for user ${userData.id}`);
          
          // TODO: Send notification to user about failed payment
          // You could integrate with an email service here
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.booking_id;

        if (bookingId) {
          // Update booking payment status
          await supabaseClient
            .from('bookings')
            .update({
              payment_status: 'paid',
              paid_at: new Date().toISOString(),
            })
            .eq('id', bookingId);

          console.log(`Booking ${bookingId} payment succeeded`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const bookingId = paymentIntent.metadata.booking_id;

        if (bookingId) {
          // Update booking payment status
          await supabaseClient
            .from('bookings')
            .update({
              payment_status: 'failed',
            })
            .eq('id', bookingId);

          console.error(`Booking ${bookingId} payment failed`);
        }
        break;
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account;
        
        // Update provider's account status if charges are enabled
        if (account.charges_enabled) {
          await supabaseClient
            .from('users')
            .update({
              stripe_account_verified: true,
            })
            .eq('stripe_account_id', account.id);

          console.log(`Provider account ${account.id} verified`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Webhook processing failed',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
