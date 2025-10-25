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
import { useNavigation } from '@react-navigation/native';
import { User, Provider, Pet, Transformation } from '../../types';
import { supabase } from '../../services/supabase';
import AnalyticsService from '../../services/analytics';

const { width } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<User | Provider | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [savedTransformations, setSavedTransformations] = useState<Transformation[]>([]);
  const [activeTab, setActiveTab] = useState<'transformations' | 'saved' | 'pets'>('transformations');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    AnalyticsService.getInstance().logScreenView('ProfileScreen');
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Load user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userError) throw userError;
      setUser(userData);

      // Load pets
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', authUser.id);

      if (!petsError) setPets(petsData || []);

      // Load transformations
      const { data: transformationsData, error: transformationsError } = await supabase
        .from('transformations')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (!transformationsError) setTransformations(transformationsData || []);

      // Load saved transformations
      const { data: savedData, error: savedError } = await supabase
        .from('saved_transformings')
        .select('transformations(*)')
        .eq('user_id', authUser.id);

      if (!savedError && savedData) {
        setSavedTransformations(savedData.map(item => item.transformations).filter(Boolean));
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile' as never);
  };

  const handleViewPets = () => {
    navigation.navigate('MyPets' as never);
  };

  const handleSettings = () => {
    navigation.navigate('Settings' as never);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Cover Photo */}
      <View style={styles.coverPhotoContainer}>
        <Image
          source={{ uri: user?.cover_photo || 'https://via.placeholder.com/400x200' }}
          style={styles.coverPhoto}
        />
        <TouchableOpacity style={styles.editCoverButton}>
          <Text style={styles.editCoverText}>Edit Cover</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar and Info */}
      <View style={styles.profileInfo}>
        <TouchableOpacity style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.profile_photo || 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <View style={styles.editAvatarBadge}>
            <Text style={styles.editAvatarText}>✏️</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.userDetails}>
          <Text style={styles.userName}>{user?.full_name || 'User Name'}</Text>
          <Text style={styles.userLocation}>{user?.location || 'Location'}</Text>
          <Text style={styles.userBio}>{user?.bio || 'No bio yet'}</Text>
        </View>

        <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
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
  );

  const renderProviderStats = () => {
    if (user?.user_type !== 'provider') return null;
    const provider = user as Provider;

    return (
      <View style={styles.providerStatsContainer}>
        <View style={styles.providerStatItem}>
          <Text style={styles.providerStatNumber}>{provider.total_bookings || 0}</Text>
          <Text style={styles.providerStatLabel}>Total Bookings</Text>
        </View>
        <View style={styles.providerStatItem}>
          <Text style={styles.providerStatNumber}>{provider.rating || 0}</Text>
          <Text style={styles.providerStatLabel}>Rating</Text>
        </View>
        <View style={styles.providerStatItem}>
          <Text style={styles.providerStatNumber}>${provider.revenue || 0}</Text>
          <Text style={styles.providerStatLabel}>Revenue</Text>
        </View>
        <TouchableOpacity style={styles.businessToolsButton}>
          <Text style={styles.businessToolsText}>Business Tools</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
    <View style={styles.gridContainer}>
      {transformations.map((transformation) => (
        <TouchableOpacity key={transformation.id} style={styles.transformationCard}>
          <Image
            source={{ uri: transformation.after_photo }}
            style={styles.transformationImage}
          />
          <Text style={styles.transformationTitle}>{transformation.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSaved = () => (
    <View style={styles.gridContainer}>
      {savedTransformations.map((transformation) => (
        <TouchableOpacity key={transformation.id} style={styles.transformationCard}>
          <Image
            source={{ uri: transformation.after_photo }}
            style={styles.transformationImage}
          />
          <Text style={styles.transformationTitle}>{transformation.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPets = () => (
    <View style={styles.petsContainer}>
      {pets.map((pet) => (
        <TouchableOpacity key={pet.id} style={styles.petCard}>
          <Image
            source={{ uri: pet.photo || 'https://via.placeholder.com/80' }}
            style={styles.petImage}
          />
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed}</Text>
            <Text style={styles.petAge}>{pet.age} years old</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.addPetButton} onPress={handleViewPets}>
        <Text style={styles.addPetButtonText}>+ Add Pet</Text>
      </TouchableOpacity>
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
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {renderStats()}
      {renderProviderStats()}
      {renderTabs()}
      {renderContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    position: 'relative',
    height: 200,
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  editCoverButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  editCoverText: {
    color: '#fff',
    fontSize: 12,
  },
  profileInfo: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarText: {
    color: '#fff',
    fontSize: 16,
  },
  userDetails: {
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  userLocation: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 10,
  },
  userBio: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 300,
  },
  editProfileButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  providerStatsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  providerStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  providerStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  providerStatLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  businessToolsButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  businessToolsText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 16,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#6366f1',
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  transformationCard: {
    width: (width - 40) / 2,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transformationImage: {
    width: '100%',
    height: 150,
  },
  transformationTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  petsContainer: {
    padding: 20,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  petBreed: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  petAge: {
    fontSize: 12,
    color: '#9ca3af',
  },
  addPetButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addPetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;