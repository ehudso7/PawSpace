import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const [fullName, setFullName] = useState('Alex Johnson');
  const [bio, setBio] = useState('Pet lover and grooming enthusiast');
  const [location, setLocation] = useState('San Francisco, CA');
  const [phone, setPhone] = useState('');
  const [email] = useState('alex@example.com');
  const [businessName, setBusinessName] = useState('Alex Grooming Co.');
  const [businessHours, setBusinessHours] = useState('Mon-Fri 9am-6pm');
  const [serviceAreas, setServiceAreas] = useState('SF, Oakland');
  const [specialties, setSpecialties] = useState('Large breeds, Anxious pets');

  const pickImage = async (type: 'avatar' | 'cover') => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      Alert.alert('Selected ' + type, uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.section}>Photos</Text>
      <View style={styles.row}>
        <Pressable style={styles.btn} onPress={() => pickImage('avatar')}>
          <Text style={styles.btnText}>Upload Profile Photo</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => pickImage('cover')}>
          <Text style={styles.btnText}>Upload Cover Photo</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>Profile</Text>
      <TextInput style={styles.input} placeholder="Full name" value={fullName} onChangeText={setFullName} />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Bio (max 500 chars)"
        value={bio}
        onChangeText={(t) => t.length <= 500 && setBio(t)}
        multiline
      />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Phone number" value={phone} onChangeText={setPhone} />
      <TextInput style={[styles.input, styles.disabled]} placeholder="Email" value={email} editable={false} />

      <Text style={styles.section}>Provider</Text>
      <TextInput style={styles.input} placeholder="Business name" value={businessName} onChangeText={setBusinessName} />
      <TextInput style={styles.input} placeholder="Business hours" value={businessHours} onChangeText={setBusinessHours} />
      <TextInput style={styles.input} placeholder="Service areas" value={serviceAreas} onChangeText={setServiceAreas} />
      <TextInput style={styles.input} placeholder="Specialties" value={specialties} onChangeText={setSpecialties} />

      <Pressable style={[styles.btn, styles.primary]} onPress={() => Alert.alert('Saved')}>
        <Text style={[styles.btnText, { color: '#fff' }]}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 8 },
  section: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  row: { flexDirection: 'row', gap: 12 },
  input: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 8, padding: 12 },
  disabled: { backgroundColor: '#f3f4f6' },
  btn: { backgroundColor: '#e5e7eb', padding: 12, borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: '#007AFF' },
  btnText: { fontWeight: '700' },
});
