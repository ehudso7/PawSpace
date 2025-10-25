import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Transformation, Pet } from '../../types';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { TransformationCard } from '../../components/TransformationCard';
import { PetCard } from '../../components/PetCard';
import { supabase } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  navigation: any;
  route: any;
}

type TabType = 'transformations' | 'saved' | 'pets';

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const userId = route.params?.userId;
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('transformations');
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [savedTransformations, setSavedTransformations] = useState<Transformation[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  useEffect(() => {
    analyticsService.trackProfileView(userId, isOwnProfile);
  }, [userId, isOwnProfile]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const targetUserId = userId || currentUser?.id;
      const isOwn = targetUserId === currentUser?.id;
      setIsOwnProfile(isOwn);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (profileError) throw profileError;
      setUser(profileData);

      // Check if following (if not own profile)
      if (!isOwn && currentUser) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', targetUserId)
          .single();
        
        setIsFollowing(!!followData);
      }

      // Load initial tab data
      await loadTabData('transformations', targetUserId);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tab: TabType, targetUserId: string) => {
    try {
      if (tab === 'transformations') {
        const { data, error } = await supabase
          .from('transformations')
          .select('*, user:users(*), pet:pets(*), provider:users!provider_id(*)')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTransformations(data || []);
      } else if (tab === 'saved') {
        const { data, error } = await supabase
          .from('saved_transformations')
          .select('*, transformation:transformations(*, user:users(*), pet:pets(*))')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSavedTransformations(data?.map(s => s.transformation) || []);
      } else if (tab === 'pets') {
        const { data, error } = await supabase
          .from('pets')
          .select('*')
          .eq('user_id', targetUserId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPets(data || []);
      }
    } catch (error) {
      console.error('Error loading tab data:', error);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (user) {
      loadTabData(tab, user.id);
    }
  };

  const handleFollow = async () => {
    if (!user) return;

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', user.id);
        
        analyticsService.logEvent('unfollow_user', { user_id: user.id });
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: currentUser.id,
            following_id: user.id,
          });
        
        analyticsService.logEvent('follow_user', { user_id: user.id });
      }

      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const renderHeader = () => {
    if (!user) return null;

    return (
      <View style={styles.header}>
        {/* Cover Photo */}
        {user.cover_photo_url ? (
          <Image source={{ uri: user.cover_photo_url }} style={styles.coverPhoto} />
        ) : (
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.coverPhoto}
          />
        )}

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Avatar
            uri={user.avatar_url}
            name={user.full_name}
            size={100}
            editable={isOwnProfile}
            onPress={isOwnProfile ? () => navigation.navigate('EditProfile') : undefined}
          />
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.full_name}</Text>
          {user.location && (
            <Text style={styles.location}>📍 {user.location}</Text>
          )}
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <TouchableOpacity style={styles.stat}>
            <Text style={styles.statValue}>{user.transformations_count || 0}</Text>
            <Text style={styles.statLabel}>Transformations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stat}>
            <Text style={styles.statValue}>{user.followers_count || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stat}>
            <Text style={styles.statValue}>{user.following_count || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {isOwnProfile ? (
            <Button
              title="Edit Profile"
              onPress={() => navigation.navigate('EditProfile')}
              variant="outline"
              fullWidth
            />
          ) : (
            <>
              <Button
                title={isFollowing ? 'Following' : 'Follow'}
                onPress={handleFollow}
                variant={isFollowing ? 'outline' : 'primary'}
                style={{ flex: 1 }}
              />
              <Button
                title="Message"
                onPress={() => navigation.navigate('Chat', { userId: user.id })}
                variant="outline"
                style={{ flex: 1, marginLeft: SPACING.sm }}
              />
            </>
          )}
        </View>

        {/* Provider Section */}
        {user.user_type === 'provider' && (
          <View style={styles.providerSection}>
            <View style={styles.providerStats}>
              <View style={styles.providerStat}>
                <Text style={styles.providerStatValue}>
                  ⭐ {user.rating?.toFixed(1) || 'N/A'}
                </Text>
                <Text style={styles.providerStatLabel}>Rating</Text>
              </View>
              <View style={styles.providerStat}>
                <Text style={styles.providerStatValue}>
                  {user.total_bookings || 0}
                </Text>
                <Text style={styles.providerStatLabel}>Bookings</Text>
              </View>
              {isOwnProfile && user.revenue && (
                <View style={styles.providerStat}>
                  <Text style={styles.providerStatValue}>
                    ${user.revenue.toLocaleString()}
                  </Text>
                  <Text style={styles.providerStatLabel}>Revenue</Text>
                </View>
              )}
            </View>

            {user.specialties && user.specialties.length > 0 && (
              <View style={styles.specialties}>
                {user.specialties.map((specialty, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            )}

            {isOwnProfile && (
              <Button
                title="Switch to Business Tools"
                onPress={() => navigation.navigate('BusinessTools')}
                variant="secondary"
                size="sm"
                fullWidth
                style={{ marginTop: SPACING.md }}
              />
            )}
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'transformations' && styles.tabActive]}
            onPress={() => handleTabChange('transformations')}
          >
            <Text style={[styles.tabText, activeTab === 'transformations' && styles.tabTextActive]}>
              Transformations
            </Text>
          </TouchableOpacity>
          {isOwnProfile && (
            <TouchableOpacity
              style={[styles.tab, activeTab === 'saved' && styles.tabActive]}
              onPress={() => handleTabChange('saved')}
            >
              <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
                Saved
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pets' && styles.tabActive]}
            onPress={() => handleTabChange('pets')}
          >
            <Text style={[styles.tabText, activeTab === 'pets' && styles.tabTextActive]}>
              Pets
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (activeTab === 'transformations') {
      return (
        <FlatList
          data={transformations}
          renderItem={({ item }) => (
            <TransformationCard
              transformation={item}
              onPress={() =>
                navigation.navigate('TransformationDetail', { id: item.id })
              }
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.grid}
          contentContainerStyle={styles.gridContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No transformations yet</Text>
            </View>
          }
        />
      );
    } else if (activeTab === 'saved') {
      return (
        <FlatList
          data={savedTransformations}
          renderItem={({ item }) => (
            <TransformationCard
              transformation={item}
              onPress={() =>
                navigation.navigate('TransformationDetail', { id: item.id })
              }
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.grid}
          contentContainerStyle={styles.gridContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No saved transformations</Text>
            </View>
          }
        />
      );
    } else if (activeTab === 'pets') {
      return (
        <View style={styles.petsContainer}>
          {isOwnProfile && (
            <Button
              title="+ Add Pet"
              onPress={() => navigation.navigate('AddEditPet')}
              variant="primary"
              fullWidth
              style={{ marginBottom: SPACING.md }}
            />
          )}
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onPress={() => navigation.navigate('PetDetail', { id: pet.id })}
              onEdit={
                isOwnProfile
                  ? () => navigation.navigate('AddEditPet', { petId: pet.id })
                  : undefined
              }
              onDelete={
                isOwnProfile
                  ? () => handleDeletePet(pet.id)
                  : undefined
              }
            />
          ))}
          {pets.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {isOwnProfile ? 'Add your first pet' : 'No pets yet'}
              </Text>
            </View>
          )}
        </View>
      );
    }
  };

  const handleDeletePet = async (petId: string) => {
    try {
      await supabase.from('pets').delete().eq('id', petId);
      setPets(pets.filter((p) => p.id !== petId));
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {renderHeader()}
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.primary,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  userInfo: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  location: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  bio: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  providerSection: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  providerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  providerStat: {
    alignItems: 'center',
  },
  providerStatValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  providerStatLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs / 2,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  specialtyTag: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  specialtyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  grid: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  gridContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  petsContainer: {
    padding: SPACING.lg,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
});
