import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import Avatar from '@/components/Avatar';
import CoverPhoto from '@/components/CoverPhoto';
import StatRow from '@/components/StatRow';
import TabBar from '@/components/TabBar';
import { UserProfile } from '@/types';
import { useNavigation } from '@react-navigation/native';

const mockPosts = Array.from({ length: 12 }).map((_, i) => ({ id: String(i), uri: `https://picsum.photos/seed/${i}/300/300` }));
const mockSaved = Array.from({ length: 8 }).map((_, i) => ({ id: `s${i}`, uri: `https://picsum.photos/seed/s${i}/300/300` }));
const mockPets = [
  { id: 'p1', name: 'Buddy', breed: 'Golden Retriever', age: 3, photo: 'https://picsum.photos/seed/dog/200/200' },
  { id: 'p2', name: 'Mittens', breed: 'Tabby', age: 2, photo: 'https://picsum.photos/seed/cat/200/200' },
];

export default function ProfileScreen() {
  const nav = useNavigation<any>();
  // Demo profile; integrate with backend auth/profile store later
  const [profile] = useState<UserProfile>({
    id: 'demo-user',
    fullName: 'Alex Johnson',
    bio: 'Pet lover and grooming enthusiast',
    location: 'San Francisco, CA',
    email: 'alex@example.com',
    role: 'provider',
    avatarUrl: undefined,
    coverUrl: undefined,
    followersCount: 231,
    followingCount: 180,
    transformationsCount: 42,
    providerInfo: {
      servicesOffered: ['Full Groom', 'Bath & Brush', 'Nail Trim'],
      totalBookings: 120,
      rating: 4.8,
      reviewsCount: 87,
      revenueToDate: 12345,
      businessName: 'Alex Grooming Co.',
      businessHours: 'Mon-Fri 9am-6pm',
      serviceAreas: ['SF', 'Oakland'],
      specialties: ['Large breeds', 'Anxious pets'],
    },
  });

  const [activeTab, setActiveTab] = useState<'transformations' | 'saved' | 'pets'>('transformations');
  const isProvider = profile.role === 'provider';

  const tabs = useMemo(
    () => [
      { key: 'transformations', title: 'Transformations' },
      { key: 'saved', title: 'Saved' },
      { key: 'pets', title: 'Pets' },
    ],
    []
  );

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View>
          <CoverPhoto uri={profile.coverUrl} editable onEditPress={() => nav.navigate('EditProfile')} />
          <View style={styles.headerContent}>
            <View style={styles.headerRow}>
              <Avatar uri={profile.avatarUrl} editable onEditPress={() => nav.navigate('EditProfile')} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name}>{profile.fullName}</Text>
                {profile.location ? <Text style={styles.subtle}>{profile.location}</Text> : null}
              </View>
              <Pressable style={styles.editBtn} onPress={() => nav.navigate('EditProfile')}>
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </Pressable>
            </View>
            {profile.bio ? <Text style={{ marginTop: 8 }}>{profile.bio}</Text> : null}
          </View>
          <StatRow
            transformations={profile.transformationsCount ?? 0}
            following={profile.followingCount ?? 0}
            followers={profile.followersCount ?? 0}
          />
          {isProvider && (
            <View style={styles.providerSection}>
              <Text style={styles.sectionTitle}>Services offered</Text>
              <Text style={styles.subtle}>{profile.providerInfo?.servicesOffered?.join(', ') || '—'}</Text>

              <View style={styles.providerStats}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{profile.providerInfo?.totalBookings ?? 0}</Text>
                  <Text>Total bookings</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{profile.providerInfo?.rating ?? 0}</Text>
                  <Text>Rating ({profile.providerInfo?.reviewsCount ?? 0})</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>${profile.providerInfo?.revenueToDate ?? 0}</Text>
                  <Text>Revenue</Text>
                </View>
              </View>

              <Pressable style={styles.secondaryBtn} onPress={() => {}}>
                <Text style={styles.secondaryBtnText}>Switch to Business Tools</Text>
              </Pressable>
            </View>
          )}
          <TabBar tabs={tabs} activeKey={activeTab} onTabChange={(k) => setActiveTab(k as any)} />
          {activeTab === 'transformations' && (
            <View style={styles.grid}>
              {mockPosts.map((p) => (
                <Image key={p.id} source={{ uri: p.uri }} style={styles.gridItem} />
              ))}
            </View>
          )}
          {activeTab === 'saved' && (
            <View style={styles.grid}>
              {mockSaved.map((p) => (
                <Image key={p.id} source={{ uri: p.uri }} style={styles.gridItem} />
              ))}
            </View>
          )}
          {activeTab === 'pets' && (
            <View style={{ padding: 16 }}>
              <Pressable style={styles.primaryBtn} onPress={() => nav.navigate('MyPets')}>
                <Text style={styles.primaryBtnText}>Manage Pets</Text>
              </Pressable>
              <View style={{ height: 12 }} />
              {mockPets.map((pet) => (
                <View key={pet.id} style={styles.petCard}>
                  <Image source={{ uri: pet.photo }} style={styles.petAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.subtle}>{pet.breed} • {pet.age}y</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      }
      renderItem={null}
      keyExtractor={() => '0'}
    />
  );
}

const styles = StyleSheet.create({
  headerContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 20, fontWeight: '700' },
  subtle: { color: '#666' },
  editBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#eee', borderRadius: 8 },
  editBtnText: { fontWeight: '600' },
  providerSection: { padding: 16, gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  providerStats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 16, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '33.3333%', aspectRatio: 1 },
  primaryBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: { backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  secondaryBtnText: { color: '#111827', fontWeight: '700' },
  petCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  petAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
  petName: { fontWeight: '700' },
});
