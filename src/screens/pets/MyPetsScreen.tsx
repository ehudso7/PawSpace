import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase, Pet } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { errorTrackingService } from '../../services/errorTracking';
import { AddEditPetModal } from './AddEditPetModal';

interface MyPetsScreenProps {
  navigation: any;
}

export const MyPetsScreen: React.FC<MyPetsScreenProps> = ({ navigation }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  useEffect(() => {
    loadPets();
    analyticsService.logScreenView('MyPets');
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: petsData, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPets(petsData || []);
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'MyPetsScreen.loadPets',
      });
      Alert.alert('Error', 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    setSelectedPet(null);
    setModalVisible(true);
  };

  const handleEditPet = (pet: Pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const handleDeletePet = (pet: Pet) => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePet(pet.id),
        },
      ]
    );
  };

  const deletePet = async (petId: string) => {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;

      setPets(prev => prev.filter(pet => pet.id !== petId));
      analyticsService.logEvent('pet_deleted', { pet_id: petId });
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'MyPetsScreen.deletePet',
        petId,
      });
      Alert.alert('Error', 'Failed to delete pet');
    }
  };

  const handlePetSaved = (savedPet: Pet) => {
    if (selectedPet) {
      // Update existing pet
      setPets(prev => prev.map(pet => pet.id === savedPet.id ? savedPet : pet));
    } else {
      // Add new pet
      setPets(prev => [savedPet, ...prev]);
    }
    setModalVisible(false);
    setSelectedPet(null);
  };

  const renderPetItem = ({ item }: { item: Pet }) => (
    <View style={styles.petCard}>
      <Image
        source={{ uri: item.photo_url || 'https://via.placeholder.com/80' }}
        style={styles.petImage}
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petDetails}>
          {item.species.charAt(0).toUpperCase() + item.species.slice(1)}
          {item.breed && ` • ${item.breed}`}
        </Text>
        {item.age && (
          <Text style={styles.petAge}>
            {item.age} {item.age === 1 ? 'year' : 'years'} old
          </Text>
        )}
        {item.weight && (
          <Text style={styles.petWeight}>{item.weight} lbs</Text>
        )}
        {item.special_needs && (
          <Text style={styles.petSpecialNeeds}>⚠️ {item.special_needs}</Text>
        )}
      </View>
      <View style={styles.petActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditPet(item)}
        >
          <Ionicons name="pencil" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeletePet(item)}
        >
          <Ionicons name="trash" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="paw" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No pets yet</Text>
      <Text style={styles.emptySubtitle}>
        Add your first pet to get started with transformations
      </Text>
      <TouchableOpacity style={styles.addFirstPetButton} onPress={handleAddPet}>
        <Text style={styles.addFirstPetText}>Add Your First Pet</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Pets</Text>
        <TouchableOpacity onPress={handleAddPet}>
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading pets...</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPetItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddEditPetModal
        visible={modalVisible}
        pet={selectedPet}
        onClose={() => {
          setModalVisible(false);
          setSelectedPet(null);
        }}
        onSave={handlePetSaved}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
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
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  petAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  petWeight: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  petSpecialNeeds: {
    fontSize: 12,
    color: '#ff6b6b',
    fontStyle: 'italic',
    marginTop: 4,
  },
  petActions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginVertical: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  addFirstPetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstPetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});