import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useSubscription } from '../../hooks/useSubscription';
import { stripeService } from '../../services/stripe';

const PRICE_ID = 'price_xxx'; // TODO: replace with real price ID

export default function SubscriptionScreen({ route }: any) {
  const userId = route?.params?.userId;
  const { status, loading, checkFeatureAccess } = useSubscription(userId);
  const [initializing, setInitializing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Stripe once
    async function init() {
      if (initializing) return;
      try {
        setInitializing(true);
        await stripeService.initialize(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
      } catch (e: any) {
        setError(e.message);
      } finally {
        setInitializing(false);
      }
    }
    init();
  }, []);

  const onStartTrial = useCallback(async () => {
    if (!userId) return;
    try {
      setProcessing(true);
      await stripeService.createSubscription(PRICE_ID, userId);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
  }, [userId]);

  const onManageSubscription = useCallback(async () => {
    try {
      setProcessing(true);
      const res = await fetch('/api/create-portal-session', { method: 'POST' });
      if (!res.ok) throw new Error(await res.text());
      const { url } = await res.json();
      // openURL(url) in a webview or browser
      console.log('Open billing portal:', url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
  }, []);

  const planLabel = status?.is_premium ? 'Premium Plan' : 'Free Plan';
  const renewalDate = status?.expires_at || status?.trial_ends_at;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Current plan card */}
      <View style={{ backgroundColor: '#111827', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{planLabel}</Text>
        {status?.is_premium ? (
          <Text style={{ color: '#9CA3AF', marginTop: 4 }}>Renews on {renewalDate ? new Date(renewalDate).toDateString() : '—'}</Text>
        ) : (
          <Text style={{ color: '#9CA3AF', marginTop: 4 }}>Upgrade to unlock all features</Text>
        )}
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          {!status?.is_premium && (
            <TouchableOpacity onPress={onStartTrial} disabled={processing || initializing} style={{ backgroundColor: '#22C55E', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 }}>
              {processing ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Start 7-day free trial</Text>}
            </TouchableOpacity>
          )}
          {status?.can_cancel && (
            <TouchableOpacity onPress={onManageSubscription} disabled={processing} style={{ marginLeft: 12, backgroundColor: '#374151', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 }}>
              {processing ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white' }}>Manage Subscription</Text>}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Premium benefits */}
      <View style={{ backgroundColor: '#111827', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Premium benefits</Text>
        {[
          '✓ Unlimited transformations (vs 3/month free)',
          '✓ No watermarks on exports',
          '✓ Access to premium stickers and effects',
          '✓ Featured provider listings (for providers)',
          '✓ Advanced analytics',
          '✓ Priority support',
          '✓ Ad-free experience',
        ].map((item) => (
          <Text key={item} style={{ color: '#D1D5DB', marginTop: 8 }}>{item}</Text>
        ))}
      </View>

      {/* Pricing card */}
      <View style={{ backgroundColor: '#111827', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>$4.99/month</Text>
        <Text style={{ color: '#9CA3AF', marginTop: 4 }}>Cancel anytime</Text>
        {!status?.is_premium && (
          <TouchableOpacity onPress={onStartTrial} disabled={processing || initializing} style={{ marginTop: 12, backgroundColor: '#22C55E', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 }}>
            {processing ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Start 7-day free trial</Text>}
          </TouchableOpacity>
        )}
      </View>

      {/* FAQ */}
      <View style={{ backgroundColor: '#111827', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>FAQ</Text>
        <Text style={{ color: '#D1D5DB', marginTop: 8 }}>How does the trial work?</Text>
        <Text style={{ color: '#9CA3AF' }}>You can try Premium free for 7 days. Cancel anytime within the trial to avoid charges.</Text>
        <Text style={{ color: '#D1D5DB', marginTop: 8 }}>How do I cancel?</Text>
        <Text style={{ color: '#9CA3AF' }}>Use the Manage Subscription button to open the billing portal.</Text>
        <Text style={{ color: '#D1D5DB', marginTop: 8 }}>Will I be charged immediately?</Text>
        <Text style={{ color: '#9CA3AF' }}>No. You will be charged at the end of your 7-day trial unless you cancel.</Text>
      </View>

      {error && (
        <View style={{ padding: 12, borderRadius: 8, backgroundColor: '#7F1D1D' }}>
          <Text style={{ color: 'white' }}>{error}</Text>
        </View>
      )}

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
    </ScrollView>
  );
}
