// deno-lint-ignore-file no-explicit-any
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' });

Deno.serve(async (req) => {
  try {
    const { customer_id } = await req.json().catch(() => ({ customer_id: undefined }));

    if (!customer_id) {
      return new Response('Missing customer_id', { status: 400 });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url: 'pawspace://subscription',
    });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
