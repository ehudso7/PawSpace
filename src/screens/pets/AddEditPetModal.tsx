import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Pet, Species } from '@/types';

export function AddEditPetModal() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const petId: string | undefined = route.params?.id;

  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [vaccFiles, setVaccFiles] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user || !petId) return;
      const { data } = await supabase.from('pets').select('*').eq('id', petId).single();
      const pet = data as Pet | null;
      if (pet) {
        setName(pet.name);
        setSpecies(pet.species);
        setBreed(pet.breed || '');
        setAge(pet.age || '');
        setWeight(pet.weight || '');
        setNotes(pet.notes || '');
        setPhoto(pet.photo_url || null);
        setVaccFiles(pet.vaccination_files || []);
      }
    };
    load();
  }, [user?.id, petId]);

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true });
    if (!res.canceled && res.assets[0]) setPhoto(res.assets[0].uri);
  };

  const pickVaccinationFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (res.assets && res.assets.length > 0) {
      for (const asset of res.assets) {
        const path = `vaccinations/${user?.id}/${Date.now()}-${asset.name}`;
        await supabase.storage.from('public').upload(path, { uri: asset.uri, type: asset.mimeType || 'application/octet-stream', name: asset.name } as any);
        setVaccFiles(prev => [...prev, path]);
      }
    }
  };

  const save = async () => {
    if (!user) return;
    let photoPath = photo;
    if (photo && photo.startsWith('file://')) {
      photoPath = `pets/${user.id}-${Date.now()}.jpg`;
      await supabase.storage.from('public').upload(photoPath, { uri: photo, type: 'image/jpeg', name: 'pet.jpg' } as any);
    }
    const payload = { user_id: user.id, name, species, breed, age, weight, notes, photo_url: photoPath, vaccination_files: vaccFiles } as Partial<Pet>;
    if (petId) {
      await supabase.from('pets').update(payload).eq('id', petId);
    } else {
      await supabase.from('pets').insert(payload);
    }
    navigation.goBack();
  };

  const remove = async () => {
    if (!petId) return;
    await supabase.from('pets').delete().eq('id', petId);
    navigation.goBack();
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{petId ? 'Edit Pet' : 'Add Pet'}</Text>
      <TouchableOpacity onPress={pickPhoto} style={{ marginTop: 12 }}>
        <Text style={{ color: '#007AFF' }}>Pick Photo</Text>
      </TouchableOpacity>
      {!!photo && <Image source={{ uri: photo.startsWith('file://') ? photo : supabase.storage.from('public').getPublicUrl(photo).data.publicUrl }} style={{ width: 120, height: 120, borderRadius: 8, marginTop: 8 }} />}

      <Text style={{ marginTop: 12 }}>Pet name</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }} />

      <Text style={{ marginTop: 12 }}>Species (dog/cat/other)</Text>
      <TextInput value={species} onChangeText={t => setSpecies((t as Species) || 'other')} placeholder="dog" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }} />

      <Text style={{ marginTop: 12 }}>Breed</Text>
      <TextInput value={breed} onChangeText={setBreed} placeholder="Breed" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }} />

      <Text style={{ marginTop: 12 }}>Age</Text>
      <TextInput value={age} onChangeText={setAge} placeholder="Age" keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }} />

      <Text style={{ marginTop: 12 }}>Weight</Text>
      <TextInput value={weight} onChangeText={setWeight} placeholder="Weight" keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }} />

      <Text style={{ marginTop: 12 }}>Special needs/notes</Text>
      <TextInput value={notes} onChangeText={setNotes} placeholder="Notes" multiline style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, minHeight: 80 }} />

      <TouchableOpacity onPress={pickVaccinationFile} style={{ marginTop: 12 }}>
        <Text style={{ color: '#007AFF' }}>Upload Vaccination Records</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={save} style={{ marginTop: 16, backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>{petId ? 'Save Changes' : 'Add Pet'}</Text>
      </TouchableOpacity>

      {!!petId && (
        <TouchableOpacity onPress={remove} style={{ marginTop: 8, backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Delete Pet</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
