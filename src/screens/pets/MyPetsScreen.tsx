import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { supabase } from '@/services/supabase';
import { useAuthUser } from '@/hooks/useCurrentUser';
import { Pet } from '@/types';

export type MyPetsProps = NativeStackScreenProps<RootStackParamList, 'MyPets'>;

const MyPetsScreen: React.FC<MyPetsProps> = ({ navigation }) => {
  const userId = useAuthUser();
  const [pets, setPets] = useState<Pet[]>([]);

  async function loadPets() {
    if (!userId) return;
    const { data } = await supabase.from('pets').select('*').eq('owner_id', userId).order('created_at', { ascending: false });
    setPets(
      (data ?? []).map((p: any) => ({
        id: p.id,
        ownerId: p.owner_id,
        name: p.name,
        species: p.species,
        breed: p.breed,
        age: p.age,
        weightKg: p.weight_kg,
        notes: p.notes,
        photoUrl: p.photo_url,
        vaccinationFiles: p.vaccination_files ?? [],
      }))
    );
  }

  useEffect(() => {
    loadPets();
  }, [userId]);

  async function onDelete(id: string) {
    Alert.alert('Delete pet', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await supabase.from('pets').delete().eq('id', id);
          loadPets();
        }
      }
    ]);
  }

  const renderItem = ({ item }: { item: Pet }) => (
    <View style={styles.card}>
      {item.photoUrl ? <Image source={{ uri: item.photoUrl }} style={styles.photo} /> : <View style={[styles.photo, styles.photoPlaceholder]} />}
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{item.species}{item.breed ? ` • ${item.breed}` : ''}{item.age ? ` • ${item.age}` : ''}</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('AddEditPet', { petId: item.id })} style={styles.iconBtn}>
        <MaterialIcons name="edit" size={20} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.iconBtn}>
        <MaterialIcons name="delete" size={20} color="#b00020" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={pets}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text>No pets yet.</Text>}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddEditPet')}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 12, marginBottom: 12 },
  photo: { width: 56, height: 56, borderRadius: 8, marginRight: 12 },
  photoPlaceholder: { backgroundColor: '#ddd' },
  name: { fontWeight: '700' },
  meta: { color: '#666', marginTop: 2 },
  iconBtn: { padding: 8 },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: '#111', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 2 }
});

export default MyPetsScreen;
