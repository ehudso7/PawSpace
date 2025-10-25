import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, TextInput, Text, Avatar, HelperText, Chip, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Pet, Species, VaccinationRecord } from '@/types';
import { usePets } from '@/context/PetsContext';

const speciesOptions: Species[] = ['dog', 'cat', 'other'];

export default function PetModal() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { pets, addPet, updatePet, deletePet } = usePets();
  const petId = route.params?.petId as string | undefined;
  const existing = useMemo(() => pets.find((p) => p.id === petId), [pets, petId]);

  const [photoUri, setPhotoUri] = useState(existing?.photoUri);
  const [name, setName] = useState(existing?.name || '');
  const [species, setSpecies] = useState<Species>(existing?.species || 'dog');
  const [breed, setBreed] = useState(existing?.breed || '');
  const [age, setAge] = useState(existing?.age || '');
  const [weight, setWeight] = useState(existing?.weight || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(existing?.vaccinations || []);

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled) setPhotoUri(res.assets[0].uri);
  };

  const pickVaccination = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: false });
    if (res.canceled) return;
    const asset = res.assets?.[0];
    if (!asset) return;
    setVaccinations([...
      vaccinations,
      { name: asset.name || `record_${vaccinations.length + 1}` , uri: asset.uri }
    ]);
  };

  const onSave = async () => {
    const payload: Omit<Pet, 'id'> = { name, species, breed, age, weight, notes, photoUri, vaccinations };
    if (existing) {
      await updatePet(existing.id, payload);
    } else {
      await addPet(payload);
    }
    navigation.goBack();
  };

  const onDelete = async () => {
    if (existing) {
      await deletePet(existing.id);
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Button onPress={pickPhoto} icon="camera">Choose Photo</Button>
      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        {photoUri ? <Avatar.Image size={96} source={{ uri: photoUri }} /> : <Avatar.Icon size={96} icon="paw" />}
      </View>

      <TextInput label="Pet name" value={name} onChangeText={setName} style={{ marginTop: 8 }} />

      <Text style={{ marginTop: 12 }}>Species</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {speciesOptions.map((opt) => (
          <Chip key={opt} selected={species === opt} onPress={() => setSpecies(opt)}>{opt}</Chip>
        ))}
      </View>

      <TextInput label="Breed" value={breed} onChangeText={setBreed} style={{ marginTop: 12 }} placeholder="Search or type breed" />
      <TextInput label="Age" value={age} onChangeText={setAge} style={{ marginTop: 12 }} />
      <TextInput label="Weight" value={weight} onChangeText={setWeight} style={{ marginTop: 12 }} />
      <TextInput label="Special needs / Notes" value={notes} onChangeText={setNotes} multiline numberOfLines={3} style={{ marginTop: 12 }} />

      <Divider style={{ marginVertical: 12 }} />
      <Text variant="titleMedium">Vaccination Records</Text>
      <Button style={{ marginTop: 8 }} onPress={pickVaccination} icon="file">Upload file</Button>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {vaccinations.map((v, idx) => (
          <Chip key={`${v.uri}-${idx}`} onClose={() => setVaccinations(vaccinations.filter((x) => x !== v))}>{v.name}</Chip>
        ))}
      </View>

      <Button mode="contained" style={{ marginTop: 24 }} onPress={onSave}>Save</Button>
      {existing ? <Button textColor="red" style={{ marginTop: 12 }} onPress={onDelete}>Delete</Button> : null}
    </ScrollView>
  );
}
