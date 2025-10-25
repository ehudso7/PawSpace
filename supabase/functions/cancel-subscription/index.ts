// deno-lint-ignore-file no-explicit-any
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' });

Deno.serve(async (req) => {
  try {
    const { subscription_id } = await req.json();
    if (!subscription_id) return new Response('Missing subscription_id', { status: 400 });

    const deleted = await stripe.subscriptions.cancel(subscription_id);
    return new Response(JSON.stringify({ id: deleted.id, status: deleted.status }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
