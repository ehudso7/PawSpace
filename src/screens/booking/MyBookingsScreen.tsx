import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { getMyBookings } from '../../services/bookings';
import { Booking } from '../../types';
import { Avatar } from '../../components/Avatar';
import { formatCurrency } from '../../utils/currency';

interface Props {
  route?: { params?: { tab?: 'upcoming' | 'past' | 'cancelled' } };
  navigation: any;
}

const tabs: Array<{ key: 'upcoming' | 'past' | 'cancelled'; label: string }> = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
];

export const MyBookingsScreen: React.FC<Props> = ({ route, navigation }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>(route?.params?.tab || 'upcoming');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | undefined>();

  async function load(): Promise<void> {
    setLoading(true);
    setError(undefined);
    try {
      const data = await getMyBookings(activeTab);
      const sorted = [...data].sort((a, b) => {
        const ta = new Date(a.appointment_time).getTime();
        const tb = new Date(b.appointment_time).getTime();
        if (activeTab === 'upcoming') {
          return ta - tb; // soonest first
        }
        return tb - ta; // most recent first for past/cancelled
      });
      setBookings(sorted);
    } catch (err: any) {
      setError(err?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [activeTab]);

  function renderStatus(status: Booking['status']): string {
    if (status === 'confirmed') return 'Confirmed';
    if (status === 'completed') return 'Completed';
    if (status === 'cancelled') return 'Cancelled';
    return 'Pending';
  }

  function BookingCard({ item }: { item: Booking }): JSX.Element {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('BookingDetail', { id: item.id })} style={{ padding: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Avatar uri={item.provider.avatar_url} name={item.provider.name} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700' }}>{item.provider.name}</Text>
            <Text style={{ color: '#666' }}>{item.service.name}</Text>
            <Text style={{ color: '#666' }}>{new Date(item.appointment_time).toLocaleString()}</Text>
          </View>
          <View>
            <Text style={{ fontWeight: '700', textAlign: 'right' }}>{formatCurrency(item.total_price, item.service.currency)}</Text>
            <Text style={{ color: '#111827', backgroundColor: '#e5e7eb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-end' }}>{renderStatus(item.status)}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.navigate('BookingDetail', { id: item.id })} style={{ padding: 10, backgroundColor: '#f1f5f9', borderRadius: 8 }}>
            <Text>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Chat', { userId: item.provider_id })} style={{ padding: 10, backgroundColor: '#f1f5f9', borderRadius: 8 }}>
            <Text>Message Provider</Text>
          </TouchableOpacity>
          {activeTab === 'upcoming' && (
            <TouchableOpacity onPress={() => navigation.navigate('CancelBooking', { id: item.id })} style={{ padding: 10, backgroundColor: '#fee2e2', borderRadius: 8 }}>
              <Text style={{ color: '#991b1b' }}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f7fb' }}>
      <View style={{ flexDirection: 'row', padding: 12, backgroundColor: '#fff' }}>
        {tabs.map((t) => (
          <TouchableOpacity key={t.key} onPress={() => setActiveTab(t.key)} style={{ flex: 1, padding: 12, backgroundColor: activeTab === t.key ? '#111827' : '#f1f5f9', borderRadius: 8, marginHorizontal: 4 }}>
            <Text style={{ color: activeTab === t.key ? '#fff' : '#111827', textAlign: 'center' }}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ padding: 16, flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>{error}</Text>
          </View>
        ) : (
          <FlatList data={bookings} keyExtractor={(b) => b.id} renderItem={({ item }) => <BookingCard item={item} />} />
        )}
      </View>
    </View>
  );
};

export default MyBookingsScreen;
