import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract user ID from URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const user_id = pathParts[pathParts.length - 1];

    if (!user_id) {
      throw new Error('Missing user_id in path');
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user subscription data
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select(`
        is_premium,
        subscription_expires_at,
        trial_ends_at,
        stripe_customer_id
      `)
      .eq('id', user_id)
      .single();

    if (userError) {
      throw new Error('User not found');
    }

    // Get transformations count for current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const { count: transformationsUsed, error: countError } = await supabaseClient
      .from('transformations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .gte('created_at', firstDayOfMonth.toISOString());

    if (countError) {
      console.error('Error counting transformations:', countError);
    }

    // Determine if user is in trial
    const now_ts = Date.now();
    const trialEndsAt = userData.trial_ends_at ? new Date(userData.trial_ends_at).getTime() : null;
    const isTrial = trialEndsAt ? now_ts < trialEndsAt : false;

    // Determine if subscription can be cancelled
    const canCancel = userData.is_premium && userData.stripe_customer_id;

    // Build subscription status response
    const subscriptionStatus = {
      is_premium: userData.is_premium || false,
      plan: userData.is_premium ? 'premium' : 'free',
      expires_at: userData.subscription_expires_at || undefined,
      is_trial: isTrial,
      trial_ends_at: userData.trial_ends_at || undefined,
      can_cancel: canCancel,
      transformations_used: transformationsUsed || 0,
      transformations_limit: userData.is_premium ? 999999 : 3, // Unlimited for premium
    };

    return new Response(
      JSON.stringify(subscriptionStatus),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error getting subscription status:', error);
    
    // Return default free status on error
    return new Response(
      JSON.stringify({
        is_premium: false,
        plan: 'free',
        is_trial: false,
        can_cancel: false,
        transformations_used: 0,
        transformations_limit: 3,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  }
});
