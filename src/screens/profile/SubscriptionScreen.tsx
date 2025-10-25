import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from 'react-native';
import { useSubscription } from '../../hooks/useSubscription';
import { stripeService } from '../../services/stripe';

const PRICE_ID = 'price_xxx'; // TODO: replace with real Stripe Price ID

export const SubscriptionScreen: React.FC<{ userId: string }> = ({ userId }) => {
  const { status, loading, error, refresh } = useSubscription(userId);
  const [upgrading, setUpgrading] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);

  const planLabel = useMemo(() => {
    if (!status) return 'Free Plan';
    return status.is_premium ? 'Premium Plan' : 'Free Plan';
  }, [status]);

  const expiryText = useMemo(() => {
    if (!status) return '';
    if (status.is_trial && status.trial_ends_at) return `Trial ends ${new Date(status.trial_ends_at).toLocaleDateString()}`;
    if (status.expires_at) return `Renews on ${new Date(status.expires_at).toLocaleDateString()}`;
    return '';
  }, [status]);

  const startTrial = async () => {
    try {
      setUpgrading(true);
      await stripeService.createSubscription({ priceId: PRICE_ID, userId });
      await refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setUpgrading(false);
    }
  };

  const manageSubscription = async () => {
    try {
      setOpeningPortal(true);
      const { url } = await stripeService.openBillingPortal(userId);
      await Linking.openURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setOpeningPortal(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>{planLabel}</Text>
        {!!expiryText && <Text style={{ color: '#666', marginTop: 4 }}>{expiryText}</Text>}
        <TouchableOpacity onPress={manageSubscription} disabled={openingPortal} style={{ marginTop: 12, padding: 10, backgroundColor: '#f3f4f6', borderRadius: 8 }}>
          {openingPortal ? <ActivityIndicator /> : <Text>Manage Subscription</Text>}
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Premium benefits</Text>
        {[
          'Unlimited transformations (vs 3/month free)',
          'No watermarks on exports',
          'Access to premium stickers and effects',
          'Featured provider listings (for providers)',
          'Advanced analytics',
          'Priority support',
          'Ad-free experience',
        ].map((item) => (
          <View key={item} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
            <Text style={{ marginRight: 8 }}>✓</Text>
            <Text>{item}</Text>
          </View>
        ))}
      </View>

      <View style={{ backgroundColor: '#171717', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ color: 'white', fontSize: 26, fontWeight: '800' }}>$4.99/month</Text>
        <Text style={{ color: '#d1d5db', marginBottom: 16 }}>Cancel anytime</Text>
        <TouchableOpacity onPress={startTrial} disabled={upgrading} style={{ backgroundColor: '#6C47FF', padding: 12, borderRadius: 8, alignItems: 'center' }}>
          {upgrading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: 'white', fontWeight: '600' }}>Start 7-day free trial</Text>}
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={{ padding: 12 }}>
          <ActivityIndicator />
        </View>
      )}
      {error && (
        <View style={{ padding: 12 }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      )}

      <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>FAQ</Text>
        {[
          { q: 'How does the trial work?', a: 'You get full premium access for 7 days. Cancel anytime.' },
          { q: 'How do I cancel?', a: 'Use the Manage Subscription button to open the billing portal.' },
          { q: 'Will I be charged immediately?', a: "No. You'll only be charged after the trial unless you cancel." },
        ].map((item) => (
          <View key={item.q} style={{ marginVertical: 6 }}>
            <Text style={{ fontWeight: '600' }}>{item.q}</Text>
            <Text style={{ color: '#555' }}>{item.a}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
