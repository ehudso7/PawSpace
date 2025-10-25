import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Pet } from '../../types';
import { supabase } from '../../services/supabase';
import AnalyticsService from '../../services/analytics';

const MyPetsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPets();
    AnalyticsService.getInstance().logScreenView('MyPetsScreen');
  }, []);

  const loadPets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Error loading pets:', error);
      Alert.alert('Error', 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPet = () => {
    navigation.navigate('AddEditPet' as never, { pet: null });
  };

  const handleEditPet = (pet: Pet) => {
    navigation.navigate('AddEditPet' as never, { pet });
  };

  const handleDeletePet = async (petId: string) => {
    Alert.alert(
      'Delete Pet',
      'Are you sure you want to delete this pet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('pets')
                .delete()
                .eq('id', petId);

              if (error) throw error;

              setPets(prev => prev.filter(pet => pet.id !== petId));
              AnalyticsService.getInstance().logEvent('pet_deleted', { pet_id: petId });
            } catch (error) {
              console.error('Error deleting pet:', error);
              Alert.alert('Error', 'Failed to delete pet');
            }
          },
        },
      ]
    );
  };

  const renderPetCard = (pet: Pet) => (
    <View key={pet.id} style={styles.petCard}>
      <Image
        source={{ uri: pet.photo || 'https://via.placeholder.com/80' }}
        style={styles.petImage}
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petBreed}>{pet.breed}</Text>
        <Text style={styles.petDetails}>
          {pet.age} years old • {pet.weight ? `${pet.weight} lbs` : 'Weight not set'}
        </Text>
        {pet.special_needs && (
          <Text style={styles.specialNeeds} numberOfLines={2}>
            Special needs: {pet.special_needs}
          </Text>
        )}
      </View>
      <View style={styles.petActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditPet(pet)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePet(pet.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading pets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No pets yet</Text>
            <Text style={styles.emptyStateText}>
              Add your first pet to get started with PawSpace
            </Text>
          </View>
        ) : (
          pets.map(renderPetCard)
        )}
      </ScrollView>
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
        <Text style={styles.addButtonText}>+ Add Pet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: 300,
  },
  petCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    marginBottom: 3,
  },
  petDetails: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 5,
  },
  specialNeeds: {
    fontSize: 12,
    color: '#f59e0b',
    fontStyle: 'italic',
  },
  petActions: {
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#6366f1',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyPetsScreen;