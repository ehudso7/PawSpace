import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function AddEditPetModal() {
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [vaccFiles, setVaccFiles] = useState<string[]>([]);

  const speciesOptions = useMemo(() => ['dog', 'cat', 'other'] as const, []);

  const pickPhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled) {
      setPhotoUri(res.assets[0].uri);
    }
  };

  const pickVaccination = async () => {
    const res = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (res.type === 'success') {
      setVaccFiles((f) => [...f, res.uri]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.section}>Pet Photo</Text>
      <Pressable style={styles.btn} onPress={pickPhoto}><Text style={styles.btnText}>{photoUri ? 'Change Photo' : 'Upload Photo'}</Text></Pressable>

      <Text style={styles.section}>Basic Info</Text>
      <TextInput style={styles.input} placeholder="Pet name" value={name} onChangeText={setName} />
      <View style={styles.row}>
        {speciesOptions.map((s) => (
          <Pressable key={s} style={[styles.chip, species === s && styles.chipActive]} onPress={() => setSpecies(s)}>
            <Text style={[styles.chipText, species === s && styles.chipTextActive]}>{s}</Text>
          </Pressable>
        ))}
      </View>
      <TextInput style={styles.input} placeholder="Breed (searchable dropdown TBD)" value={breed} onChangeText={setBreed} />
      <View style={styles.row}> 
        <TextInput style={[styles.input, styles.half]} placeholder="Age (years)" keyboardType="numeric" value={age} onChangeText={setAge} />
        <TextInput style={[styles.input, styles.half]} placeholder="Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
      </View>
      <TextInput style={[styles.input, { height: 100 }]} placeholder="Special needs/notes" value={notes} onChangeText={setNotes} multiline />

      <Text style={styles.section}>Vaccination records</Text>
      <Pressable style={styles.btn} onPress={pickVaccination}><Text style={styles.btnText}>Upload file</Text></Pressable>
      {vaccFiles.map((f, i) => (
        <Text key={i} style={{ color: '#666' }}>{f}</Text>
      ))}

      <Pressable style={[styles.btn, styles.primary]} onPress={() => Alert.alert('Saved pet')}>
        <Text style={[styles.btnText, { color: '#fff' }]}>Save</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  section: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, padding: 12 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  half: { flex: 1 },
  btn: { backgroundColor: '#e5e7eb', padding: 12, borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: '#007AFF' },
  btnText: { fontWeight: '700' },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: '#e5e5e5' },
  chipActive: { backgroundColor: '#007AFF22', borderColor: '#007AFF' },
  chipText: { color: '#111827' },
  chipTextActive: { color: '#007AFF', fontWeight: '700' },
});
