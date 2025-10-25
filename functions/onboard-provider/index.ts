// deno-lint-ignore-file no-explicit-any
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' as any });

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    const { email, user_id, refresh_url, return_url } = await req.json();
    if (!email || !user_id) return new Response('Missing email or user_id', { status: 400 });

    const account = await stripe.accounts.create({ type: 'express', country: 'US', email });

    const link = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: refresh_url || 'pawspace://provider-onboarding',
      return_url: return_url || 'pawspace://provider-dashboard',
      type: 'account_onboarding',
    });

    // TODO: persist account.id to user's stripe_account_id

    return new Response(JSON.stringify({ accountId: account.id, url: link.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e?.message || 'Internal error' }), { status: 500 });
  }
});
