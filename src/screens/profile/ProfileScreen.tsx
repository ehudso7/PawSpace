import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FlatGrid } from 'react-native-super-grid';
import { Rating } from 'react-native-ratings';

import { RootStackParamList, User, Provider, Transformation, Pet } from '../../types';
import { supabase } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { errorTrackingService } from '../../services/errorTracking';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation, route }: Props) {
  const { userId } = route.params || {};
  const [user, setUser] = useState<User | Provider | null>(null);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [savedTransformations, setSavedTransformations] = useState<Transformation[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [activeTab, setActiveTab] = useState<'transformations' | 'saved' | 'pets'>('transformations');
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        navigation.goBack();
        return;
      }

      const targetUserId = userId || currentUser.id;
      setIsOwnProfile(targetUserId === currentUser.id);

      // Load user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (userError) {
        throw userError;
      }

      setUser(userData);

      // Load transformations
      const { data: transformationsData } = await supabase
        .from('transformations')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      setTransformations(transformationsData || []);

      // Load saved transformations
      const { data: savedData } = await supabase
        .from('saved_transformations')
        .select(`
          transformations (*)
        `)
        .eq('user_id', currentUser.id);

      setSavedTransformations(savedData?.map(item => item.transformations).filter(Boolean) || []);

      // Load pets
      const { data: petsData } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', targetUserId);

      setPets(petsData || []);

      // Track profile view
      analyticsService.logProfileView(targetUserId, currentUser.id);

    } catch (error) {
      errorTrackingService.captureException(error as Error, 'ProfileScreen.loadProfile');
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleAddPet = () => {
    navigation.navigate('AddEditPet');
  };

  const handleEditPet = (petId: string) => {
    navigation.navigate('AddEditPet', { petId });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Cover Photo */}
      <View style={styles.coverPhotoContainer}>
        {user?.cover_photo_url ? (
          <Image source={{ uri: user.cover_photo_url }} style={styles.coverPhoto} />
        ) : (
          <View style={styles.coverPhotoPlaceholder}>
            <Ionicons name="camera" size={40} color="#ccc" />
          </View>
        )}
      </View>

      {/* Avatar and Info */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarContainer}>
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={40} color="#ccc" />
            </View>
          )}
          {isOwnProfile && (
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.name}>{user?.full_name}</Text>
        {user?.location && <Text style={styles.location}>{user.location}</Text>}
        {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}

        {isOwnProfile && (
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{transformations.length}</Text>
          <Text style={styles.statLabel}>Transformations</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
      </View>

      {/* Provider-specific sections */}
      {user?.user_type === 'provider' && (
        <View style={styles.providerSections}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Services Offered</Text>
            <Text style={styles.sectionContent}>
              {(user as Provider).specialties?.join(', ') || 'No services listed'}
            </Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Total Bookings</Text>
            <Text style={styles.sectionContent}>
              {(user as Provider).total_bookings || 0}
            </Text>
          </View>
          
          {(user as Provider).rating && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rating</Text>
              <Rating
                type="star"
                ratingCount={5}
                imageSize={20}
                readonly
                startingValue={(user as Provider).rating}
                style={styles.rating}
              />
            </View>
          )}

          {isOwnProfile && (
            <TouchableOpacity style={styles.businessToolsButton}>
              <Text style={styles.businessToolsText}>Switch to Business Tools</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'transformations' && styles.activeTab]}
        onPress={() => setActiveTab('transformations')}
      >
        <Text style={[styles.tabText, activeTab === 'transformations' && styles.activeTabText]}>
          Transformations
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
        onPress={() => setActiveTab('saved')}
      >
        <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
          Saved
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'pets' && styles.activeTab]}
        onPress={() => setActiveTab('pets')}
      >
        <Text style={[styles.tabText, activeTab === 'pets' && styles.activeTabText]}>
          Pets
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTransformations = () => (
    <FlatGrid
      itemDimension={width / 3 - 20}
      data={transformations}
      style={styles.grid}
      spacing={10}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.transformationCard}>
          <Image
            source={{ uri: item.after_photos[0] }}
            style={styles.transformationImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    />
  );

  const renderSaved = () => (
    <FlatGrid
      itemDimension={width / 3 - 20}
      data={savedTransformations}
      style={styles.grid}
      spacing={10}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.transformationCard}>
          <Image
            source={{ uri: item.after_photos[0] }}
            style={styles.transformationImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}
    />
  );

  const renderPets = () => (
    <View style={styles.petsContainer}>
      {isOwnProfile && (
        <TouchableOpacity style={styles.addPetButton} onPress={handleAddPet}>
          <Ionicons name="add" size={24} color="#007AFF" />
          <Text style={styles.addPetText}>Add Pet</Text>
        </TouchableOpacity>
      )}
      
      {pets.map((pet) => (
        <TouchableOpacity
          key={pet.id}
          style={styles.petCard}
          onPress={() => isOwnProfile && handleEditPet(pet.id)}
        >
          <Image
            source={{ uri: pet.photo_url || 'https://via.placeholder.com/100' }}
            style={styles.petImage}
          />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed}</Text>
            <Text style={styles.petAge}>{pet.age} years old</Text>
          </View>
          {isOwnProfile && (
            <TouchableOpacity style={styles.petEditButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'transformations':
        return renderTransformations();
      case 'saved':
        return renderSaved();
      case 'pets':
        return renderPets();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderHeader()}
        {renderTabs()}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
  },
  coverPhotoContainer: {
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPhotoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -50,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  providerSections: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    alignItems: 'flex-start',
  },
  businessToolsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  businessToolsText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  grid: {
    padding: 10,
  },
  transformationCard: {
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
  },
  transformationImage: {
    width: '100%',
    height: '100%',
  },
  petsContainer: {
    padding: 20,
  },
  addPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 15,
  },
  addPetText: {
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  petAge: {
    fontSize: 12,
    color: '#999',
  },
  petEditButton: {
    padding: 5,
  },
});
