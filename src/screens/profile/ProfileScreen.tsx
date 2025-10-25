import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import { Ionicons } from '@expo/vector-icons';
import { supabase, User, Transformation, Pet } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { errorTrackingService } from '../../services/errorTracking';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  navigation: any;
  route: {
    params?: {
      userId?: string;
    };
  };
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation, route }) => {
  const [user, setUser] = useState<User | null>(null);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [savedTransformations, setSavedTransformations] = useState<Transformation[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [stats, setStats] = useState({
    transformationsCount: 0,
    followersCount: 0,
    followingCount: 0,
    bookingsCount: 0,
    rating: 0,
  });
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = route.params?.userId;

  useEffect(() => {
    loadProfile();
    analyticsService.logScreenView('Profile');
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      const targetUserId = userId || currentUser?.id;
      setIsOwnProfile(!userId || userId === currentUser?.id);

      if (!targetUserId) return;

      // Load user profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (profileData) {
        setUser(profileData);
        analyticsService.trackProfileViewed(
          targetUserId,
          profileData.is_provider ? 'provider' : 'user'
        );
      }

      // Load transformations
      const { data: transformationsData } = await supabase
        .from('transformations')
        .select(`
          *,
          pets (name, species),
          users (full_name, avatar_url)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (transformationsData) {
        setTransformations(transformationsData);
      }

      // Load saved transformations (only for own profile)
      if (isOwnProfile) {
        const { data: savedData } = await supabase
          .from('saved_transformations')
          .select(`
            transformation_id,
            transformations (
              *,
              pets (name, species),
              users (full_name, avatar_url)
            )
          `)
          .eq('user_id', targetUserId);

        if (savedData) {
          setSavedTransformations(savedData.map(item => item.transformations));
        }
      }

      // Load pets
      const { data: petsData } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (petsData) {
        setPets(petsData);
      }

      // Load stats
      await loadStats(targetUserId);

      // Check if following (for other profiles)
      if (!isOwnProfile && currentUser) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', targetUserId)
          .single();

        setIsFollowing(!!followData);
      }

    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'ProfileScreen.loadProfile',
        userId: targetUserId,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (targetUserId: string) => {
    try {
      const [transformationsCount, followersCount, followingCount] = await Promise.all([
        supabase
          .from('transformations')
          .select('id', { count: 'exact' })
          .eq('user_id', targetUserId),
        supabase
          .from('follows')
          .select('id', { count: 'exact' })
          .eq('following_id', targetUserId),
        supabase
          .from('follows')
          .select('id', { count: 'exact' })
          .eq('follower_id', targetUserId),
      ]);

      setStats(prev => ({
        ...prev,
        transformationsCount: transformationsCount.count || 0,
        followersCount: followersCount.count || 0,
        followingCount: followingCount.count || 0,
      }));

      // Load provider-specific stats if applicable
      if (user?.is_provider) {
        // Add booking and rating stats here
        // This would require additional tables for bookings and reviews
      }
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'ProfileScreen.loadStats',
        userId: targetUserId,
      });
    }
  };

  const handleFollow = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || !user) return;

      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUser.id)
          .eq('following_id', user.id);
        setIsFollowing(false);
        setStats(prev => ({ ...prev, followersCount: prev.followersCount - 1 }));
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: currentUser.id,
            following_id: user.id,
          });
        setIsFollowing(true);
        setStats(prev => ({ ...prev, followersCount: prev.followersCount + 1 }));
        analyticsService.trackFollow(user.id);
      }
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'ProfileScreen.handleFollow',
      });
    }
  };

  const renderTransformationItem = ({ item }: { item: Transformation }) => (
    <TouchableOpacity
      style={styles.transformationItem}
      onPress={() => navigation.navigate('TransformationDetail', { id: item.id })}
    >
      <Image source={{ uri: item.after_image_url }} style={styles.transformationImage} />
      <View style={styles.transformationOverlay}>
        <View style={styles.transformationStats}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color="white" />
            <Text style={styles.statText}>{item.likes_count}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={16} color="white" />
            <Text style={styles.statText}>{item.comments_count}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPetItem = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => navigation.navigate('PetDetail', { id: item.id })}
    >
      <Image
        source={{ uri: item.photo_url || 'https://via.placeholder.com/80' }}
        style={styles.petImage}
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetails}>
          {item.breed} • {item.age ? `${item.age} years old` : 'Age unknown'}
        </Text>
        {item.special_needs && (
          <Text style={styles.petSpecialNeeds}>{item.special_needs}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const ProfileHeader = () => (
    <View style={styles.header}>
      {/* Cover Photo */}
      <View style={styles.coverContainer}>
        <Image
          source={{ uri: user?.cover_url || 'https://via.placeholder.com/400x200' }}
          style={styles.coverImage}
        />
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.editCoverButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.avatar_url || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          {isOwnProfile && (
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.full_name}</Text>
          {user?.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.location}>{user.location}</Text>
            </View>
          )}
          {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
        </View>

        <View style={styles.actionButtons}>
          {isOwnProfile ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={handleFollow}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.transformationsCount}</Text>
          <Text style={styles.statLabel}>Transformations</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.followersCount}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        {user?.is_provider && (
          <>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.bookingsCount}</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </>
        )}
      </View>

      {/* Provider Features */}
      {user?.is_provider && (
        <View style={styles.providerSection}>
          <Text style={styles.sectionTitle}>Services</Text>
          {user.specialties && (
            <View style={styles.specialtiesContainer}>
              {user.specialties.map((specialty, index) => (
                <View key={index} style={styles.specialtyTag}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          )}
          {isOwnProfile && (
            <TouchableOpacity
              style={styles.businessToolsButton}
              onPress={() => navigation.navigate('BusinessTools')}
            >
              <Text style={styles.businessToolsText}>Switch to Business Tools</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container
        renderHeader={ProfileHeader}
        renderTabBar={props => (
          <MaterialTabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
          />
        )}
      >
        <Tabs.Tab name="transformations" label="Transformations">
          <Tabs.FlatList
            data={transformations}
            renderItem={renderTransformationItem}
            numColumns={3}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.transformationsGrid}
          />
        </Tabs.Tab>

        {isOwnProfile && (
          <Tabs.Tab name="saved" label="Saved">
            <Tabs.FlatList
              data={savedTransformations}
              renderItem={renderTransformationItem}
              numColumns={3}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.transformationsGrid}
            />
          </Tabs.Tab>
        )}

        <Tabs.Tab name="pets" label="Pets">
          <Tabs.FlatList
            data={pets}
            renderItem={renderPetItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.petsContainer}
            ListHeaderComponent={
              isOwnProfile ? (
                <TouchableOpacity
                  style={styles.addPetButton}
                  onPress={() => navigation.navigate('MyPets')}
                >
                  <Ionicons name="add" size={24} color="#007AFF" />
                  <Text style={styles.addPetText}>Add Pet</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </Tabs.Tab>
      </Tabs.Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
  },
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  editCoverButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  profileInfo: {
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 4,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  bio: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  actionButtons: {
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  followingButtonText: {
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  providerSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  specialtyTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 14,
    color: '#1976d2',
  },
  businessToolsButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  businessToolsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabIndicator: {
    backgroundColor: '#007AFF',
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  transformationsGrid: {
    padding: 2,
  },
  transformationItem: {
    flex: 1,
    margin: 2,
    aspectRatio: 1,
    position: 'relative',
  },
  transformationImage: {
    width: '100%',
    height: '100%',
  },
  transformationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
  },
  transformationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  petsContainer: {
    padding: 16,
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  addPetText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  petInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  petDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  petSpecialNeeds: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 4,
    fontStyle: 'italic',
  },
});