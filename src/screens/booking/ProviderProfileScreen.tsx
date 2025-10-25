import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ImageBackground, Linking, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { ProviderProfile, Service } from '../../types/booking';
import { getProviderProfile } from '../../services/providers';
import ServiceSelectorSheet from '../../components/booking/ServiceSelectorSheet';

const HEADER_MAX_HEIGHT = 280;
const AVATAR_SIZE = 96;

const TabButton = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <Pressable onPress={onPress} style={{ paddingVertical: 12, paddingHorizontal: 16 }}>
    <Text style={{ color: active ? '#fff' : colors.textMuted, fontWeight: active ? '700' : '500' }}>{label}</Text>
    {active && <View style={{ height: 2, backgroundColor: colors.primary, marginTop: 6, borderRadius: 2 }} />}
  </Pressable>
);

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
    <Text style={{ color: colors.textMuted }}>{label}</Text>
    <Text style={{ color: '#fff', marginLeft: 16, flexShrink: 1, textAlign: 'right' }}>{value || '-'}</Text>
  </View>
);

type Params = { providerId: string };

export const ProviderProfileScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, Params>, string>>();
  const { providerId } = route.params as Params;
  const nav = useNavigation<any>();

  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'About' | 'Services' | 'Portfolio' | 'Reviews'>('About');
  const [sheetOpen, setSheetOpen] = useState(false);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    getProviderProfile(providerId)
      .then((p) => active && setProfile(p))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [providerId]);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const height = interpolate(scrollOffset.value, [0, HEADER_MAX_HEIGHT], [HEADER_MAX_HEIGHT, 96], Extrapolation.CLAMP);
    return { height };
  });

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scrollOffset.value, [0, HEADER_MAX_HEIGHT], [HEADER_MAX_HEIGHT - AVATAR_SIZE / 2, 16], Extrapolation.CLAMP);
    const scale = interpolate(scrollOffset.value, [0, 120], [1, 0.8], Extrapolation.CLAMP);
    return { transform: [{ translateY }, { scale }] };
  });

  const Header = () => (
    <Animated.View style={[styles.header, headerAnimatedStyle]}>
      <ImageBackground
        source={{ uri: profile?.cover_photo_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop' }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
      </ImageBackground>
    </Animated.View>
  );

  const HeaderOverlay = () => (
    <Animated.View style={[styles.headerOverlay]}> 
      <Animated.Image
        source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/300' }}
        style={[styles.avatar, avatarAnimatedStyle]}
      />
      <View style={{ paddingHorizontal: 16, marginTop: AVATAR_SIZE / 2 + 8 }}>
        <Text style={styles.name}>{profile?.full_name || 'Provider'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: colors.textMuted }}>⭐ {profile?.rating?.toFixed(1) ?? '0.0'} ({profile?.total_reviews ?? 0})</Text>
          <View style={{ width: 2, height: 2, backgroundColor: colors.textMuted, borderRadius: 1 }} />
          <Text style={{ color: colors.textMuted }}>{profile?.total_bookings ?? 0} bookings</Text>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {profile?.services?.slice(0, 4).map((s) => (
            <View key={s.id} style={styles.badge}><Text style={{ color: colors.text, fontSize: 12 }}>{s.category || s.title}</Text></View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <Pressable style={[styles.ghostBtn]} onPress={() => Share.share({ message: `Check out ${profile?.full_name}` })}>
            <Text style={{ color: '#fff' }}>Share</Text>
          </Pressable>
          <Pressable style={[styles.primaryBtn]} onPress={() => Linking.openURL('sms:') }>
            <Text style={{ color: '#fff' }}>Message</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );

  const AboutTab = () => (
    <View style={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>About</Text>
      <Text style={{ color: colors.text, marginTop: 6 }}>{profile?.bio || 'No bio provided.'}</Text>

      <View style={[styles.card, { marginTop: 16 }]}> 
        <Text style={styles.cardTitle}>Location</Text>
        <InfoRow label="City" value={profile?.location?.city} />
        <InfoRow label="Country" value={profile?.location?.country} />
        {profile?.location?.lat && profile?.location?.lng && (
          <View style={{ marginTop: 12 }}>
            <Image
              source={{ uri: `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${profile.location.lng},${profile.location.lat}&z=13&l=map&size=450,200&pt=${profile.location.lng},${profile.location.lat},pm2rdm` }}
              style={{ width: '100%', height: 160, borderRadius: 10 }}
            />
          </View>
        )}
      </View>

      <View style={[styles.card, { marginTop: 16 }]}> 
        <Text style={styles.cardTitle}>Business hours</Text>
        {Object.entries(profile?.business_hours || {}).map(([day, window]) => (
          <InfoRow key={day} label={day} value={window ? `${(window as any).open} - ${(window as any).close}` : '-'} />
        ))}
      </View>

      <View style={[styles.card, { marginTop: 16 }]}> 
        <Text style={styles.cardTitle}>Contact</Text>
        <InfoRow label="Email" value={profile?.email} />
        <InfoRow label="Phone" value={profile?.phone} />
        <InfoRow label="Website" value={profile?.website} />
      </View>

      <View style={{ height: 12 }} />
    </View>
  );

  const ServicesTab = () => (
    <View style={{ padding: 16 }}>
      {profile?.services?.map((s) => (
        <View key={s.id} style={[styles.card, { marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.cardTitle}>{s.title}</Text>
            {!!s.description && <Text style={{ color: colors.textMuted, marginTop: 4 }}>{s.description}</Text>}
            <Text style={{ color: colors.textMuted, marginTop: 4 }}>{s.durationMinutes} min</Text>
          </View>
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {new Intl.NumberFormat(undefined, { style: 'currency', currency: s.currency || 'USD' }).format((s.priceCents || 0) / 100)}
          </Text>
        </View>
      ))}
    </View>
  );

  const PortfolioTab = () => (
    <View style={{ padding: 8, flexDirection: 'row', flexWrap: 'wrap' }}>
      {profile?.portfolio_items?.map((item) => (
        <Image key={item.id} source={{ uri: item.afterImageUrl }} style={{ width: (Dimensions.get('window').width - 32) / 3, height: 120, margin: 4, borderRadius: 8 }} />
      ))}
    </View>
  );

  const ReviewsTab = () => (
    <View style={{ padding: 16 }}>
      <Text style={styles.sectionTitle}>Reviews</Text>
      {profile?.reviews && profile.reviews.length > 0 ? (
        profile.reviews.map((r) => (
          <View key={r.id} style={[styles.card, { marginTop: 12 }]}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>{r.reviewer_name || 'Anonymous'}</Text>
              <Text style={{ color: colors.textMuted }}>⭐ {r.rating.toFixed(1)}</Text>
            </View>
            <Text style={{ color: colors.text, marginTop: 8 }}>{r.comment}</Text>
            <Text style={{ color: colors.textMuted, marginTop: 8, fontSize: 12 }}>{new Date(r.created_at).toLocaleDateString()}</Text>
          </View>
        ))
      ) : (
        <Text style={{ color: colors.textMuted, marginTop: 8 }}>No reviews yet.</Text>
      )}
    </View>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'About':
        return <AboutTab />;
      case 'Services':
        return <ServicesTab />;
      case 'Portfolio':
        return <PortfolioTab />;
      case 'Reviews':
        return <ReviewsTab />;
      default:
        return null;
    }
  };

  const onSelectService = (service: Service) => {
    setSheetOpen(false);
    nav.navigate('BookingCalendarScreen' as never, {
      providerId: providerId,
      service: {
        id: service.id,
        title: service.title,
        durationMinutes: service.durationMinutes,
        priceCents: service.priceCents,
        currency: service.currency,
      },
    } as never);
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: 110 }}>
        <Header />
        <HeaderOverlay />

        <View style={styles.tabsRow}>
          {(['About', 'Services', 'Portfolio', 'Reviews'] as const).map((t) => (
            <TabButton key={t} label={t} active={activeTab === t} onPress={() => setActiveTab(t)} />
          ))}
        </View>

        {loading ? (
          <View style={{ padding: 16 }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          renderTab()
        )}
      </Animated.ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={[styles.cta]} onPress={() => setSheetOpen(true)}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Book Service</Text>
        </Pressable>
      </View>

      {sheetOpen && (
        <ServiceSelectorSheet
          services={profile?.services || []}
          onClose={() => setSheetOpen(false)}
          onSelectService={onSelectService}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { height: HEADER_MAX_HEIGHT, backgroundColor: colors.card },
  headerOverlay: { position: 'absolute', left: 0, right: 0, top: 0 },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    position: 'absolute',
    left: 16,
    borderWidth: 2,
    borderColor: colors.card,
  },
  name: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 16 },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  cardTitle: { color: '#fff', fontWeight: '700' },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  cta: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  ghostBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
});

export default ProviderProfileScreen;
