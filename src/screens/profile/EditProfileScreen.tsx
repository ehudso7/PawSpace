import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function EditProfileScreen() {
  const { user, refresh } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState(user?.location || '');
  const [phone, setPhone] = useState('');
  const [email] = useState('');
  const [avatar, setAvatar] = useState<string | null>(user?.avatar_url || null);
  const [cover, setCover] = useState<string | null>(user?.cover_url || null);

  const pickImage = async (setter: (uri: string) => void) => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true });
    if (!res.canceled && res.assets[0]) setter(res.assets[0].uri);
  };

  const detectLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({});
    setLocation(`${loc.coords.latitude.toFixed(4)}, ${loc.coords.longitude.toFixed(4)}`);
  };

  const save = async () => {
    if (!user) return;
    let avatarPath = avatar;
    let coverPath = cover;

    if (avatar && avatar.startsWith('file://')) {
      avatarPath = `avatars/${user.id}.jpg`;
      await supabase.storage.from('public').upload(avatarPath, { uri: avatar, type: 'image/jpeg', name: 'avatar.jpg' } as any, { upsert: true });
    }
    if (cover && cover.startsWith('file://')) {
      coverPath = `covers/${user.id}.jpg`;
      await supabase.storage.from('public').upload(coverPath, { uri: cover, type: 'image/jpeg', name: 'cover.jpg' } as any, { upsert: true });
    }

    await supabase.from('users').update({ full_name: fullName, bio, location, phone, avatar_url: avatarPath, cover_url: coverPath }).eq('id', user.id);
    await refresh();
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Edit Profile</Text>
      <TouchableOpacity onPress={() => pickImage(uri => setCover(uri))} style={{ marginTop: 12 }}>
        <Text style={{ color: '#007AFF' }}>Upload Cover Photo</Text>
      </TouchableOpacity>
      {!!cover && <Image source={{ uri: cover.startsWith('file://') ? cover : supabase.storage.from('public').getPublicUrl(cover).data.publicUrl }} style={{ width: '100%', height: 120, marginTop: 8 }} />}

      <TouchableOpacity onPress={() => pickImage(uri => setAvatar(uri))} style={{ marginTop: 12 }}>
        <Text style={{ color: '#007AFF' }}>Upload Profile Photo</Text>
      </TouchableOpacity>
      {!!avatar && <Image source={{ uri: avatar.startsWith('file://') ? avatar : supabase.storage.from('public').getPublicUrl(avatar).data.publicUrl }} style={{ width: 80, height: 80, borderRadius: 40, marginTop: 8 }} />}

      <Text style={{ marginTop: 12 }}>Full name</Text>
      <TextInput value={fullName} onChangeText={setFullName} placeholder="Full name" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }} />

      <Text style={{ marginTop: 12 }}>Bio</Text>
      <TextInput value={bio} onChangeText={setBio} placeholder="Bio" multiline maxLength={500} style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, minHeight: 80 }} />

      <Text style={{ marginTop: 12 }}>Location</Text>
      <TextInput value={location} onChangeText={setLocation} placeholder="City, State" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }} />
      <TouchableOpacity onPress={detectLocation} style={{ marginTop: 4 }}><Text style={{ color: '#007AFF' }}>Use current location</Text></TouchableOpacity>

      <Text style={{ marginTop: 12 }}>Phone number</Text>
      <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8 }} />

      <Text style={{ marginTop: 12 }}>Email (read-only)</Text>
      <TextInput value={email} editable={false} placeholder="Email" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 8, backgroundColor: '#f5f5f5' }} />

      {/* Provider-specific fields would go here (business name, hours, areas, specialties) */}

      <TouchableOpacity onPress={save} style={{ marginTop: 16, backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
