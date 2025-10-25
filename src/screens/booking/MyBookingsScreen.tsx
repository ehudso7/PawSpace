import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import { getMyBookings, cancelBooking } from '../../services/bookings';
import type { Booking } from '../../types';
import { BookingCard } from '../../components/booking/BookingCard';

interface Props { navigation: any }

type Tab = 'upcoming' | 'past' | 'cancelled';

export const MyBookingsScreen: React.FC<Props> = ({ navigation }) => {
  const [tab, setTab] = useState<Tab>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (selected: Tab, isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const data = await getMyBookings(selected);
      setBookings(data);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not load bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(tab); }, [tab]);

  const onCancel = (id: string) => {
    Alert.prompt(
      'Cancel Booking',
      'Please provide a reason for cancellation',
      [
        { text: 'Dismiss', style: 'cancel' },
        { text: 'Confirm', onPress: async (reason?: string) => {
          if (!reason) return;
          try { await cancelBooking(id, reason); load(tab); } catch (e: any) { Alert.alert('Error', e?.message || 'Could not cancel'); }
        }},
      ],
      'plain-text'
    );
  };

  const TabButton = ({ value, label }: { value: Tab; label: string }) => (
    <TouchableOpacity onPress={() => setTab(value)} style={[styles.tab, tab === value && styles.tabActive]}>
      <Text style={[styles.tabText, tab === value && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TabButton value="upcoming" label="Upcoming" />
        <TabButton value="past" label="Past" />
        <TabButton value="cancelled" label="Cancelled" />
      </View>
      <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(tab, true); }} />}>
        {bookings.map(b => (
          <BookingCard key={b.id} booking={b} onView={(id) => navigation.navigate('BookingDetail', { id })} onMessage={(pid) => navigation.navigate('Chat', { providerId: pid })} onCancel={onCancel} />
        ))}
        {bookings.length === 0 && !loading && (
          <View style={styles.empty}> 
            <Text style={styles.emptyText}>No bookings</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  tabs: { flexDirection: 'row', backgroundColor: 'white' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#111827' },
  tabText: { color: '#6B7280', fontWeight: '600' },
  tabTextActive: { color: '#111827' },
  empty: { alignItems: 'center', marginTop: 32 },
  emptyText: { color: '#6B7280' },
});

export default MyBookingsScreen;
