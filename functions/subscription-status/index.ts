// deno-lint-ignore-file no-explicit-any
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' as any });

Deno.serve(async (req) => {
  try {
    if (req.method !== 'GET') return new Response('Method Not Allowed', { status: 405 });
    const url = new URL(req.url);
    const userId = url.pathname.split('/').pop();
    if (!userId) return new Response('Missing user ID', { status: 400 });

    // In a real app, read user's subscription state from DB
    // For sample, return free by default
    return new Response(
      JSON.stringify({ is_premium: false, plan: 'free', is_trial: false, can_cancel: false }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e?.message || 'Internal error' }), { status: 500 });
  }
});
