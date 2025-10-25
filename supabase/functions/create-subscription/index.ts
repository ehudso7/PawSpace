// deno-lint-ignore-file no-explicit-any
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' });

Deno.serve(async (req) => {
  try {
    const { price_id, user_id } = await req.json();

    if (!price_id || !user_id) {
      return new Response('Missing price_id or user_id', { status: 400 });
    }

    // TODO: get or create customer for user
    const customer = await stripe.customers.create({ metadata: { user_id } });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price_id }],
      trial_period_days: 7,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const clientSecret = (subscription.latest_invoice as any)?.payment_intent?.client_secret;

    return new Response(
      JSON.stringify({ subscriptionId: subscription.id, clientSecret }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
