import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, Pet } from '../../types';
import { supabase } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { errorTrackingService } from '../../services/errorTracking';

type MyPetsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyPets'>;

interface Props {
  navigation: MyPetsScreenNavigationProp;
}

export default function MyPetsScreen({ navigation }: Props) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigation.goBack();
        return;
      }

      const { data: petsData, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPets(petsData || []);

    } catch (error) {
      errorTrackingService.captureException(error as Error, 'MyPetsScreen.loadPets');
      Alert.alert('Error', 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  const handleAddPet = () => {
    navigation.navigate('AddEditPet');
  };

  const handleEditPet = (petId: string) => {
    navigation.navigate('AddEditPet', { petId });
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

      setPets(pets.filter(pet => pet.id !== petId));
      
      analyticsService.logEvent('pet_deleted', {
        pet_id: petId,
      });

    } catch (error) {
      errorTrackingService.captureException(error as Error, 'MyPetsScreen.deletePet');
      Alert.alert('Error', 'Failed to delete pet');
    }
  };

  const renderPetCard = ({ item: pet }: { item: Pet }) => (
    <TouchableOpacity
      style={styles.petCard}
      onPress={() => handleEditPet(pet.id)}
    >
      <Image
        source={{ uri: pet.photo_url || 'https://via.placeholder.com/100' }}
        style={styles.petImage}
      />
      
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petBreed}>{pet.breed}</Text>
        <Text style={styles.petAge}>{pet.age} years old</Text>
        {pet.weight && (
          <Text style={styles.petWeight}>{pet.weight} lbs</Text>
        )}
        {pet.special_needs && (
          <Text style={styles.petSpecialNeeds} numberOfLines={2}>
            Special needs: {pet.special_needs}
          </Text>
        )}
      </View>

      <View style={styles.petActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditPet(pet.id)}
        >
          <Ionicons name="create-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeletePet(pet)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="paw-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No Pets Yet</Text>
      <Text style={styles.emptySubtitle}>
        Add your first pet to get started with transformations
      </Text>
      <TouchableOpacity style={styles.addFirstPetButton} onPress={handleAddPet}>
        <Text style={styles.addFirstPetText}>Add Your First Pet</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading pets...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

      {pets.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={pets}
          renderItem={renderPetCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    fontWeight: '600',
    marginBottom: 5,
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  petAge: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  petWeight: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  petSpecialNeeds: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  petActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  addFirstPetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  addFirstPetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
