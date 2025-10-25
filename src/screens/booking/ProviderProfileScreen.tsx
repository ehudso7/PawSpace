import React, { useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import { ProviderProfile, Service } from '../../types/booking';
import { formatCurrency, formatDuration } from '../../utils/format';

interface ProviderProfileScreenProps {
  provider: ProviderProfile; // ideally fetched before navigation
  onSelectService?: (service: Service) => void;
  onMessage?: () => void;
  onShareLink?: (provider: ProviderProfile) => Promise<void>;
}

const HEADER_MAX = 280;
const AVATAR_SIZE = 112;

export const ProviderProfileScreen: React.FC<ProviderProfileScreenProps> = ({ provider, onSelectService, onMessage, onShareLink }) => {
  const scrollY = useSharedValue(0);
  const [tab, setTab] = useState<'About' | 'Services' | 'Portfolio' | 'Reviews'>('About');
  const sheetRef = useRef<BottomSheet>(null);
  const { width } = useWindowDimensions();

  const onShare = async () => {
    if (onShareLink) {
      await onShareLink(provider);
    } else {
      await Share.share({ message: `Check out ${provider.full_name}` });
    }
  };

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(scrollY.value, [0, HEADER_MAX], [HEADER_MAX, 96], Extrapolation.CLAMP),
  }));

  const coverTranslate = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, HEADER_MAX], [0, -40], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(scrollY.value, [-HEADER_MAX, 0], [1.4, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, HEADER_MAX], [0, -48], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(scrollY.value, [0, HEADER_MAX], [1, 0.8], Extrapolation.CLAMP),
      },
    ],
  }));

  const onOpenServices = () => sheetRef.current?.expand();

  const serviceItem = ({ item }: { item: Service }) => (
    <Pressable
      onPress={() => onSelectService?.(item)}
      style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}
    >
      <Text style={{ fontWeight: '600', fontSize: 16 }}>{item.title}</Text>
      <Text style={{ color: '#6B7280', marginTop: 4 }}>{formatDuration(item.duration_minutes)}</Text>
      <Text style={{ marginTop: 4 }}>{formatCurrency(item.price_cents, item.currency)}</Text>
    </Pressable>
  );

  const StickyBar = useMemo(() => (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
      }}
    >
      <Pressable
        onPress={onOpenServices}
        style={{ backgroundColor: '#0A84FF', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Book Service</Text>
      </Pressable>
    </View>
  ), []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <Animated.View style={[{ width: '100%', overflow: 'hidden' }, headerStyle]}>
        <Animated.Image
          source={{ uri: provider.cover_photo_url || 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=1600&auto=format&fit=crop' }}
          style={[{ width: '100%', height: HEADER_MAX, resizeMode: 'cover' }, coverTranslate]}
        />
      </Animated.View>

      {/* Content */}
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Avatar + Name Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: -AVATAR_SIZE / 2 }}>
          <Animated.View style={[{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, overflow: 'hidden', borderWidth: 3, borderColor: 'white' }, avatarStyle]}>
            <Image
              source={{ uri: provider.avatar_url || 'https://i.pravatar.cc/300' }}
              style={{ width: '100%', height: '100%' }}
            />
          </Animated.View>
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text style={{ fontSize: 22, fontWeight: '800' }}>{provider.full_name}</Text>
            <Text style={{ color: '#6B7280', marginTop: 2 }}>⭐ {provider.rating.toFixed(1)} ({provider.total_reviews})</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {(provider.services || []).slice(0, 3).map((s) => (
                <View key={s.id} style={{ backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 }}>
                  <Text style={{ fontSize: 12, color: '#374151' }}>{s.title}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable onPress={onMessage} style={{ backgroundColor: '#111827', padding: 10, borderRadius: 10 }}>
              <Text style={{ color: 'white' }}>Message</Text>
            </Pressable>
            <Pressable onPress={onShare} style={{ backgroundColor: '#111827', padding: 10, borderRadius: 10 }}>
              <Text style={{ color: 'white' }}>Share</Text>
            </Pressable>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginTop: 16 }}>
          {(['About', 'Services', 'Portfolio', 'Reviews'] as const).map((t) => (
            <Pressable key={t} onPress={() => setTab(t)} style={{ marginRight: 16 }}>
              <Text style={{ fontWeight: tab === t ? '800' : '600', color: tab === t ? '#111827' : '#6B7280' }}>{t}</Text>
              {tab === t && <View style={{ height: 2, backgroundColor: '#111827', marginTop: 6 }} />}
            </Pressable>
          ))}
        </View>

        {/* Tab content */}
        {tab === 'About' && (
          <View style={{ padding: 16, gap: 12 }}>
            <Text style={{ color: '#374151' }}>{provider.bio}</Text>
            {provider.location?.address && (
              <Text style={{ color: '#111827' }}>Location: {provider.location.address}</Text>
            )}
            {provider.contact_phone && (
              <Pressable onPress={() => Linking.openURL(`tel:${provider.contact_phone}`)}>
                <Text style={{ color: '#0A84FF' }}>Call {provider.contact_phone}</Text>
              </Pressable>
            )}
            {provider.contact_email && (
              <Pressable onPress={() => Linking.openURL(`mailto:${provider.contact_email}`)}>
                <Text style={{ color: '#0A84FF' }}>Email {provider.contact_email}</Text>
              </Pressable>
            )}
            {/* Map placeholder */}
            <View style={{ height: 160, backgroundColor: '#E5E7EB', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Map preview</Text>
            </View>
            {/* Business hours */}
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: '700', marginBottom: 8 }}>Business Hours</Text>
              {Object.entries(provider.business_hours || {}).filter(([k]) => k !== 'timezone').map(([day, hours]) => (
                <Text key={day} style={{ color: '#374151' }}>{day}: {(hours as any)?.open ?? '—'} - {(hours as any)?.close ?? '—'}</Text>
              ))}
            </View>
          </View>
        )}

        {tab === 'Services' && (
          <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
            {(provider.services || []).map((s) => (
              <View key={s.id} style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={{ fontWeight: '700' }}>{s.title}</Text>
                    {s.description ? <Text style={{ color: '#6B7280', marginTop: 4 }}>{s.description}</Text> : null}
                    <Text style={{ color: '#6B7280', marginTop: 4 }}>{formatDuration(s.duration_minutes)}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: '800' }}>{formatCurrency(s.price_cents, s.currency)}</Text>
                    <Pressable onPress={() => onSelectService?.(s)} style={{ marginTop: 8, backgroundColor: '#0A84FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}>
                      <Text style={{ color: 'white', fontWeight: '700' }}>Select</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {tab === 'Portfolio' && (
          <View style={{ padding: 8, flexDirection: 'row', flexWrap: 'wrap' }}>
            {(provider.portfolio_items || []).map((p) => (
              <Image key={p.id} source={{ uri: p.after_photo_url || p.before_photo_url || 'https://picsum.photos/200' }} style={{ width: width / 3 - 12, height: width / 3 - 12, borderRadius: 8, margin: 4 }} />
            ))}
          </View>
        )}

        {tab === 'Reviews' && (
          <View style={{ padding: 16 }}>
            {(provider.reviews || []).map((r) => (
              <View key={r.id} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
                <Text style={{ fontWeight: '700' }}>⭐ {r.rating.toFixed(1)}</Text>
                {r.comment ? <Text style={{ color: '#374151', marginTop: 4 }}>{r.comment}</Text> : null}
                <Text style={{ color: '#9CA3AF', marginTop: 4 }}>{new Date(r.created_at).toLocaleDateString()}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.ScrollView>

      {/* Sticky bottom bar */}
      {StickyBar}

      {/* Service Selector Sheet */}
      <BottomSheet ref={sheetRef} index={-1} snapPoints={[360, '90%']} enablePanDownToClose>
        <View style={{ paddingHorizontal: 16, paddingBottom: 24 }}>
          <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12 }}>Select a Service</Text>
          <FlatList
            data={provider.services}
            keyExtractor={(item) => item.id}
            renderItem={serviceItem}
            ListEmptyComponent={() => (
              <View style={{ paddingVertical: 16 }}>
                <Text style={{ color: '#6B7280' }}>No services available.</Text>
              </View>
            )}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default ProviderProfileScreen;
