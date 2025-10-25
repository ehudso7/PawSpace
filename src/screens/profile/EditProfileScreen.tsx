import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, Modal } from 'react-native';
import { Button, TextInput, Text, useTheme, HelperText, Switch, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { useAuth } from '@/context/AuthContext';

export default function EditProfileScreen() {
  const { currentUser, updateProfile } = useAuth();
  const theme = useTheme();
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email] = useState(currentUser?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl);
  const [coverUrl, setCoverUrl] = useState(currentUser?.coverUrl);
  const [mapVisible, setMapVisible] = useState(false);
  const [locationName, setLocationName] = useState(currentUser?.location?.name || '');
  const [coords, setCoords] = useState({
    latitude: currentUser?.location?.latitude ?? 37.7749,
    longitude: currentUser?.location?.longitude ?? -122.4194,
  });

  const isProvider = currentUser?.userType === 'provider';
  const [businessName, setBusinessName] = useState(currentUser?.providerDetails?.businessName || '');
  const [businessHours, setBusinessHours] = useState(currentUser?.providerDetails?.businessHours || '');
  const [serviceAreas, setServiceAreas] = useState<string[]>(currentUser?.providerDetails?.serviceAreas || []);
  const [specialties, setSpecialties] = useState<string[]>(currentUser?.providerDetails?.specialties || []);

  const pickImage = async (setter: (uri: string) => void) => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!res.canceled) setter(res.assets[0].uri);
  };

  const onSave = async () => {
    const updates = {
      fullName,
      bio: bio.slice(0, 500),
      phone,
      avatarUrl,
      coverUrl,
      location: { latitude: coords.latitude, longitude: coords.longitude, name: locationName },
      providerDetails: isProvider ? { businessName, businessHours, serviceAreas, specialties } : undefined,
    };
    await updateProfile(updates);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text variant="titleMedium">Photos</Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>Avatar</Text>
          <Image source={{ uri: avatarUrl || 'https://picsum.photos/seed/avatar/200' }} style={styles.avatar} />
          <Button onPress={() => pickImage((u) => setAvatarUrl(u))}>Change</Button>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text>Cover</Text>
          <Image source={{ uri: coverUrl || 'https://picsum.photos/seed/cover/400/200' }} style={styles.cover} />
          <Button onPress={() => pickImage((u) => setCoverUrl(u))}>Change</Button>
        </View>
      </View>

      <TextInput label="Full name" value={fullName} onChangeText={setFullName} style={{ marginTop: 12 }} />
      <TextInput label="Bio" value={bio} onChangeText={setBio} multiline numberOfLines={4} style={{ marginTop: 12 }} />
      <HelperText type={bio.length > 500 ? 'error' : 'info'}>{bio.length}/500</HelperText>

      <TextInput label="Location name" value={locationName} onChangeText={setLocationName} style={{ marginTop: 12 }} right={<TextInput.Icon icon="map" onPress={() => setMapVisible(true)} />} />

      <TextInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ marginTop: 12 }} />
      <TextInput label="Email" value={email} disabled style={{ marginTop: 12 }} />

      {isProvider && (
        <View style={{ marginTop: 16 }}>
          <Text variant="titleMedium">Business</Text>
          <TextInput label="Business name" value={businessName} onChangeText={setBusinessName} style={{ marginTop: 12 }} />
          <TextInput label="Business hours" value={businessHours} onChangeText={setBusinessHours} style={{ marginTop: 12 }} />

          <Text style={{ marginTop: 12 }}>Service areas</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {serviceAreas.map((s, i) => (
              <Chip key={`${s}-${i}`} onClose={() => setServiceAreas(serviceAreas.filter((x) => x !== s))}>{s}</Chip>
            ))}
          </View>
          <TextInput placeholder="Add area (press add)" right={<TextInput.Icon icon="plus" onPress={() => setServiceAreas([...serviceAreas, `Area ${serviceAreas.length + 1}`])} />} />

          <Text style={{ marginTop: 12 }}>Specialties</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {specialties.map((s, i) => (
              <Chip key={`${s}-${i}`} onClose={() => setSpecialties(specialties.filter((x) => x !== s))}>{s}</Chip>
            ))}
          </View>
          <TextInput placeholder="Add specialty (press add)" right={<TextInput.Icon icon="plus" onPress={() => setSpecialties([...specialties, `Specialty ${specialties.length + 1}`])} />} />
        </View>
      )}

      <Button mode="contained" style={{ marginTop: 24 }} onPress={onSave}>Save</Button>

      <Modal visible={mapVisible} animationType="slide" onRequestClose={() => setMapVisible(false)}>
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{ latitude: coords.latitude, longitude: coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
            onPress={(e: MapPressEvent) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setCoords({ latitude, longitude });
            }}
          >
            <Marker coordinate={{ latitude: coords.latitude, longitude: coords.longitude }} />
          </MapView>
          <View style={{ padding: 12 }}>
            <Button mode="contained" onPress={() => setMapVisible(false)}>Done</Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 80, height: 80, borderRadius: 40, marginTop: 8 },
  cover: { width: 160, height: 90, borderRadius: 8, marginTop: 8 },
});
