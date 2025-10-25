import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuthUser, useProfile } from '@/hooks/useCurrentUser';
import { uploadUriToStorage } from '@/services/storage';
import { supabase } from '@/services/supabase';
import { UserProfile } from '@/types';

export type EditProfileProps = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const EditProfileScreen: React.FC<EditProfileProps> = ({ navigation }) => {
  const userId = useAuthUser();
  const { profile } = useProfile(userId);

  const [fullName, setFullName] = useState(profile?.fullName ?? '');
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl);
  const [coverUrl, setCoverUrl] = useState(profile?.coverUrl);
  const [businessName, setBusinessName] = useState(profile?.businessName ?? '');
  const [businessHours, setBusinessHours] = useState(profile?.businessHours ?? '');
  const [serviceAreas, setServiceAreas] = useState((profile?.serviceAreas ?? []).join(', '));
  const [specialties, setSpecialties] = useState((profile?.specialties ?? []).join(', '));

  async function pickAndUpload(setter: (url: string) => void, type: 'avatar' | 'cover') {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (res.canceled || !res.assets?.length || !userId) return;
    const asset = res.assets[0];
    const url = await uploadUriToStorage({
      bucket: 'public',
      uri: asset.uri,
      path: `${userId}/${type}-${Date.now()}`,
      contentType: asset.mimeType ?? 'image/jpeg',
    });
    setter(url);
  }

  async function onSave() {
    if (!userId) return;
    const updates: Partial<UserProfile> = {
      fullName,
      bio: bio.slice(0, 500),
      phone,
      avatarUrl,
      coverUrl,
      businessName: profile?.role === 'provider' ? businessName : undefined,
      businessHours: profile?.role === 'provider' ? businessHours : undefined,
      serviceAreas: profile?.role === 'provider' ? serviceAreas.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      specialties: profile?.role === 'provider' ? specialties.split(',').map(s => s.trim()).filter(Boolean) : undefined,
    };
    await supabase.from('users').update({
      full_name: updates.fullName,
      bio: updates.bio,
      phone: updates.phone,
      avatar_url: updates.avatarUrl,
      cover_url: updates.coverUrl,
      business_name: updates.businessName,
      business_hours: updates.businessHours,
      service_areas: updates.serviceAreas,
      specialties: updates.specialties,
    }).eq('id', userId);
    navigation.goBack();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Photos</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => pickAndUpload(url => setAvatarUrl(url), 'avatar')}>
          {avatarUrl ? <Image source={{ uri: avatarUrl }} style={styles.avatar} /> : <View style={[styles.avatar, styles.placeholder]} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pickAndUpload(url => setCoverUrl(url), 'cover')}>
          {coverUrl ? <Image source={{ uri: coverUrl }} style={styles.cover}} /> : <View style={[styles.cover, styles.placeholder]} />}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Basic Info</Text>
      <TextInput placeholder="Full name" value={fullName} onChangeText={setFullName} style={styles.input} />
      <TextInput placeholder="Bio (max 500 chars)" value={bio} onChangeText={setBio} style={[styles.input, styles.multiline]} multiline maxLength={500} />
      <TextInput placeholder="Phone number" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Email (from auth)" value={profile?.email ?? ''} editable={false} style={[styles.input, { backgroundColor: '#f3f3f3' }]} />

      {profile?.role === 'provider' && (
        <View>
          <Text style={styles.sectionTitle}>Business</Text>
          <TextInput placeholder="Business name" value={businessName} onChangeText={setBusinessName} style={styles.input} />
          <TextInput placeholder="Business hours" value={businessHours} onChangeText={setBusinessHours} style={styles.input} />
          <TextInput placeholder="Service areas (comma separated)" value={serviceAreas} onChangeText={setServiceAreas} style={styles.input} />
          <TextInput placeholder="Specialties (comma separated)" value={specialties} onChangeText={setSpecialties} style={styles.input} />
        </View>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, marginRight: 12 },
  cover: { width: 120, height: 72, borderRadius: 8 },
  placeholder: { backgroundColor: '#ddd' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginVertical: 6 },
  multiline: { height: 100, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#111', padding: 14, borderRadius: 10, marginTop: 12, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '700' },
});

export default EditProfileScreen;
