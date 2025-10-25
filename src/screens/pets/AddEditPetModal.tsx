import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { supabase } from '@/services/supabase';
import { uploadUriToStorage } from '@/services/storage';
import { useAuthUser } from '@/hooks/useCurrentUser';

export type AddEditPetProps = NativeStackScreenProps<RootStackParamList, 'AddEditPet'>;

const AddEditPetModal: React.FC<AddEditPetProps> = ({ navigation, route }) => {
  const userId = useAuthUser();
  const petId = route.params?.petId;

  const [photoUrl, setPhotoUrl] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [notes, setNotes] = useState('');
  const [vaccinationFiles, setVaccinationFiles] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      if (!petId) return;
      const { data } = await supabase.from('pets').select('*').eq('id', petId).single();
      if (data) {
        setPhotoUrl(data.photo_url ?? undefined);
        setName(data.name ?? '');
        setSpecies((data.species ?? 'dog') as any);
        setBreed(data.breed ?? '');
        setAge(data.age ?? '');
        setWeightKg(String(data.weight_kg ?? ''));
        setNotes(data.notes ?? '');
        setVaccinationFiles(data.vaccination_files ?? []);
      }
    }
    load();
  }, [petId]);

  async function pickPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (res.canceled || !res.assets?.length || !userId) return;
    const asset = res.assets[0];
    const url = await uploadUriToStorage({ bucket: 'public', uri: asset.uri, path: `${userId}/pet-${Date.now()}`, contentType: asset.mimeType ?? 'image/jpeg' });
    setPhotoUrl(url);
  }

  async function pickVaccination() {
    const res = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], multiple: false });
    if (res.canceled || !userId) return;
    const file = Array.isArray(res.assets) ? res.assets[0] : (res as any).assets?.[0];
    if (!file) return;
    const url = await uploadUriToStorage({ bucket: 'public', uri: file.uri, path: `${userId}/vaccination-${Date.now()}`, contentType: file.mimeType ?? 'application/octet-stream' });
    setVaccinationFiles(prev => [...prev, url]);
  }

  async function onSave() {
    if (!userId) return;
    const payload = {
      owner_id: userId,
      name,
      species,
      breed: breed || null,
      age: age || null,
      weight_kg: weightKg ? Number(weightKg) : null,
      notes: notes || null,
      photo_url: photoUrl || null,
      vaccination_files: vaccinationFiles,
    };
    if (petId) {
      await supabase.from('pets').update(payload).eq('id', petId);
    } else {
      await supabase.from('pets').insert(payload);
    }
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={pickPhoto}>
        {photoUrl ? <Image source={{ uri: photoUrl }} style={styles.photo} /> : <View style={[styles.photo, styles.placeholder]} />}
      </TouchableOpacity>
      <TextInput placeholder="Pet name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Species (dog/cat/other)" value={species} onChangeText={(t) => setSpecies((t as any) || 'dog')} style={styles.input} />
      <TextInput placeholder="Breed" value={breed} onChangeText={setBreed} style={styles.input} />
      <TextInput placeholder="Age" value={age} onChangeText={setAge} style={styles.input} />
      <TextInput placeholder="Weight (kg)" value={weightKg} onChangeText={setWeightKg} keyboardType="decimal-pad" style={styles.input} />
      <TextInput placeholder="Special needs/notes" value={notes} onChangeText={setNotes} style={[styles.input, styles.multiline]} multiline />

      <TouchableOpacity onPress={pickVaccination} style={styles.button}>
        <Text style={styles.buttonText}>Upload vaccination record</Text>
      </TouchableOpacity>

      {vaccinationFiles.map((f, idx) => (
        <Text key={idx} style={{ color: '#666', marginTop: 4 }}>File {idx + 1}: {f.slice(0, 30)}...</Text>
      ))}

      <TouchableOpacity onPress={onSave} style={[styles.button, styles.save]}>
        <Text style={[styles.buttonText, { color: '#fff' }]}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  photo: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', backgroundColor: '#eee' },
  placeholder: { backgroundColor: '#ddd' },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 12, marginTop: 10 },
  multiline: { height: 100, textAlignVertical: 'top' },
  button: { borderWidth: 1, borderColor: '#111', borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 12 },
  buttonText: { fontWeight: '700', color: '#111' },
  save: { backgroundColor: '#111', borderColor: '#111' },
});

export default AddEditPetModal;
