import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuthUser, useProfile } from '@/hooks/useCurrentUser';
import { UserProfile } from '@/types';

const gridSize = Math.floor(Dimensions.get('window').width / 3);

export type ProfileProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const tabs = ['Transformations', 'Saved', 'Pets'] as const;

type TabKey = typeof tabs[number];

const ProfileScreen: React.FC<ProfileProps> = ({ route, navigation }) => {
  const authUserId = useAuthUser();
  const viewingUserId = route.params?.userId ?? authUserId;
  const { profile } = useProfile(viewingUserId);
  const [activeTab, setActiveTab] = useState<TabKey>('Transformations');

  const isOwnProfile = viewingUserId === authUserId;

  const ownerStats = profile?.stats ?? { transformations: 0, following: 0, followers: 0 };

  const header = useMemo(() => (
    <View>
      {profile?.coverUrl ? (
        <Image source={{ uri: profile.coverUrl }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]} />
      )}
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => isOwnProfile && navigation.navigate('EditProfile')}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]} />
          )}
          {isOwnProfile && (
            <View style={styles.editBadge}>
              <MaterialIcons name="edit" size={16} color="#fff" />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{profile?.fullName ?? 'User'}</Text>
          {!!profile?.location?.address && (
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={16} color="#666" />
              <Text style={styles.locationText}>{profile.location.address}</Text>
            </View>
          )}
        </View>
        {isOwnProfile && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
              <MaterialIcons name="edit" size={18} color="#fff" />
              <Text style={styles.editButtonText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')}>
              <MaterialIcons name="settings" size={18} color="#333" />
            </TouchableOpacity>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{ownerStats.transformations}</Text>
            <Text style={styles.statLabel}>Transformations</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{ownerStats.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{ownerStats.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        {/* Provider sections */}
        {profile?.role === 'provider' && (
          <View style={styles.providerSection}>
            {profile.businessName && <Text style={styles.providerTitle}>{profile.businessName}</Text>}
            {!!profile.specialties?.length && (
              <Text style={styles.providerLine}>Specialties: {profile.specialties.join(', ')}</Text>
            )}
            {!!profile.serviceAreas?.length && (
              <Text style={styles.providerLine}>Service areas: {profile.serviceAreas.join(', ')}</Text>
            )}
            {profile.stats?.totalBookings !== undefined && (
              <Text style={styles.providerLine}>Total bookings: {profile.stats.totalBookings}</Text>
            )}
            {profile.stats?.rating !== undefined && (
              <Text style={styles.providerLine}>Rating: {profile.stats.rating?.toFixed(1)} ({profile.stats.reviewsCount ?? 0})</Text>
            )}
            {isOwnProfile && profile.stats?.revenue !== undefined && (
              <Text style={styles.providerLine}>Revenue: ${profile.stats.revenue?.toFixed(2)}</Text>
            )}
            {isOwnProfile && (
              <TouchableOpacity style={styles.businessToolsButton}>
                <Text style={styles.businessToolsText}>Switch to Business Tools</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map(t => (
            <TouchableOpacity key={t} onPress={() => setActiveTab(t)} style={styles.tabButton}>
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  ), [profile, activeTab, isOwnProfile]);

  const renderGridItem = () => (
    <View style={{ width: gridSize, height: gridSize, backgroundColor: '#eee', margin: 1 }} />
  );

  const petsList = (
    <View style={{ padding: 16 }}>
      <TouchableOpacity style={styles.addPetButton} onPress={() => navigation.navigate('MyPets')}>
        <MaterialIcons name="pets" size={18} color="#fff" />
        <Text style={styles.addPetText}>Manage Pets</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      ListHeaderComponent={header}
      data={activeTab === 'Pets' ? [] : new Array(21).fill(null)}
      keyExtractor={(_, i) => String(i)}
      numColumns={activeTab === 'Transformations' || activeTab === 'Saved' ? 3 : 1}
      renderItem={activeTab === 'Pets' ? undefined : renderGridItem}
      ListEmptyComponent={activeTab === 'Pets' ? petsList : undefined}
    />
  );
};

const styles = StyleSheet.create({
  cover: { width: '100%', height: 140, backgroundColor: '#ddd' },
  coverPlaceholder: { backgroundColor: '#e9e9e9' },
  headerContent: { paddingHorizontal: 16, marginTop: -40 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff' },
  avatarPlaceholder: { backgroundColor: '#ccc' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0008',
    padding: 4,
    borderRadius: 12,
  },
  nameRow: { marginTop: 8 },
  name: { fontSize: 20, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { color: '#666', marginLeft: 4 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  editButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  editButtonText: { color: '#fff', marginLeft: 6, fontWeight: '600' },
  settingsButton: { marginLeft: 8, padding: 8, backgroundColor: '#eee', borderRadius: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 16, fontWeight: '700' },
  statLabel: { color: '#666' },
  providerSection: { paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#eee' },
  providerTitle: { fontSize: 16, fontWeight: '700', marginTop: 6 },
  providerLine: { marginTop: 4, color: '#333' },
  businessToolsButton: { marginTop: 10, backgroundColor: '#f2f2f2', padding: 10, borderRadius: 8, alignItems: 'center' },
  businessToolsText: { fontWeight: '600' },
  tabsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#eee' },
  tabButton: { paddingVertical: 6 },
  tabText: { color: '#666' },
  tabTextActive: { color: '#111', fontWeight: '700' },
  addPetButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 12, borderRadius: 8 },
  addPetText: { color: '#fff', marginLeft: 8, fontWeight: '600' },
});

export default ProfileScreen;
