// deno-lint-ignore-file no-explicit-any
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' });

Deno.serve(async (req) => {
  try {
    const { amount, provider_stripe_account_id, application_fee_amount, booking_id } = await req.json();

    if (!amount || !provider_stripe_account_id) {
      return new Response('Missing amount or provider_stripe_account_id', { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      application_fee_amount,
      transfer_data: {
        destination: provider_stripe_account_id,
      },
      metadata: booking_id ? { booking_id } : undefined,
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
