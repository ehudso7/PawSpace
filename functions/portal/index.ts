// deno-lint-ignore-file no-explicit-any
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' as any });

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const { user_id, return_url } = await req.json();
    if (!user_id) return new Response('Missing user_id', { status: 400 });

    // TODO: lookup stripe_customer_id by user_id in DB
    // For demo, create a customer per request
    const customer = await stripe.customers.create({ metadata: { user_id } });

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: return_url || 'pawspace://subscription',
    });

    return new Response(JSON.stringify({ url: session.url }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e?.message || 'Internal error' }), { status: 500 });
  }
});
