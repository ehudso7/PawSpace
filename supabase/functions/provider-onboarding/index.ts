// deno-lint-ignore-file no-explicit-any
import Stripe from 'stripe';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2024-06-20' });

Deno.serve(async (req) => {
  try {
    const { email } = await req.json();
    if (!email) return new Response('Missing email', { status: 400 });

    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email,
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'pawspace://provider-onboarding',
      return_url: 'pawspace://provider-dashboard',
      type: 'account_onboarding',
    });

    return new Response(JSON.stringify({ url: accountLink.url, accountId: account.id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
});
