import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, User, Provider, BusinessHours } from '../../types';
import { supabase } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { errorTrackingService } from '../../services/errorTracking';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

interface Props {
  navigation: EditProfileScreenNavigationProp;
}

export default function EditProfileScreen({ navigation }: Props) {
  const [user, setUser] = useState<User | Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverPhotoUrl, setCoverPhotoUrl] = useState('');
  
  // Provider-specific fields
  const [businessName, setBusinessName] = useState('');
  const [serviceAreas, setServiceAreas] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { open: '09:00', close: '17:00', closed: false },
    tuesday: { open: '09:00', close: '17:00', closed: false },
    wednesday: { open: '09:00', close: '17:00', closed: false },
    thursday: { open: '09:00', close: '17:00', closed: false },
    friday: { open: '09:00', close: '17:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '10:00', close: '16:00', closed: true },
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        navigation.goBack();
        return;
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error) throw error;

      setUser(userData);
      setFullName(userData.full_name || '');
      setBio(userData.bio || '');
      setLocation(userData.location || '');
      setPhone(userData.phone || '');
      setAvatarUrl(userData.avatar_url || '');
      setCoverPhotoUrl(userData.cover_photo_url || '');
      
      if (userData.user_type === 'provider') {
        setBusinessName(userData.business_name || '');
        setServiceAreas(userData.service_areas || []);
        setSpecialties(userData.specialties || []);
        setBusinessHours(userData.business_hours || businessHours);
      }

    } catch (error) {
      errorTrackingService.captureException(error as Error, 'EditProfileScreen.loadUserProfile');
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (type: 'avatar' | 'cover') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'avatar' ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        
        // Upload to Supabase storage
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: `${type}_${Date.now()}.jpg`,
        } as any);

        const { data: { user: currentUser } } = await supabase.auth.getUser();
        const fileName = `${currentUser?.id}/${type}_${Date.now()}.jpg`;
        
        const { data, error } = await supabase.storage
          .from('profile-images')
          .upload(fileName, formData);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName);

        if (type === 'avatar') {
          setAvatarUrl(publicUrl);
        } else {
          setCoverPhotoUrl(publicUrl);
        }
      }
    } catch (error) {
      errorTrackingService.captureException(error as Error, 'EditProfileScreen.pickImage');
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // Reverse geocoding to get address
      const address = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (address.length > 0) {
        const addr = address[0];
        const locationString = `${addr.city}, ${addr.region}`;
        setLocation(locationString);
      }
    } catch (error) {
      errorTrackingService.captureException(error as Error, 'EditProfileScreen.getCurrentLocation');
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const addServiceArea = () => {
    Alert.prompt(
      'Add Service Area',
      'Enter a service area:',
      (text) => {
        if (text && text.trim()) {
          setServiceAreas([...serviceAreas, text.trim()]);
        }
      }
    );
  };

  const removeServiceArea = (index: number) => {
    setServiceAreas(serviceAreas.filter((_, i) => i !== index));
  };

  const addSpecialty = () => {
    Alert.prompt(
      'Add Specialty',
      'Enter a specialty:',
      (text) => {
        if (text && text.trim()) {
          setSpecialties([...specialties, text.trim()]);
        }
      }
    );
  };

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      const updateData: any = {
        full_name: fullName,
        bio: bio,
        location: location,
        phone: phone,
        avatar_url: avatarUrl,
        cover_photo_url: coverPhotoUrl,
        updated_at: new Date().toISOString(),
      };

      if (user?.user_type === 'provider') {
        updateData.business_name = businessName;
        updateData.service_areas = serviceAreas;
        updateData.specialties = specialties;
        updateData.business_hours = businessHours;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', currentUser.id);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

      analyticsService.logEvent('profile_updated', {
        user_type: user?.user_type,
        has_avatar: !!avatarUrl,
        has_cover_photo: !!coverPhotoUrl,
      });

    } catch (error) {
      errorTrackingService.captureException(error as Error, 'EditProfileScreen.saveProfile');
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const renderImagePicker = (type: 'avatar' | 'cover', currentUrl: string, onPress: () => void) => (
    <TouchableOpacity style={styles.imagePicker} onPress={onPress}>
      {currentUrl ? (
        <Image source={{ uri: currentUrl }} style={styles.imagePreview} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="camera" size={30} color="#ccc" />
        </View>
      )}
      <View style={styles.imageOverlay}>
        <Ionicons name="camera" size={16} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  const renderBusinessHours = () => {
    if (user?.user_type !== 'provider') return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Hours</Text>
        {Object.entries(businessHours).map(([day, hours]) => (
          <View key={day} style={styles.hoursRow}>
            <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            <Switch
              value={!hours.closed}
              onValueChange={(value) => {
                setBusinessHours({
                  ...businessHours,
                  [day]: { ...hours, closed: !value }
                });
              }}
            />
            {!hours.closed && (
              <View style={styles.timeInputs}>
                <TextInput
                  style={styles.timeInput}
                  value={hours.open}
                  onChangeText={(text) => {
                    setBusinessHours({
                      ...businessHours,
                      [day]: { ...hours, open: text }
                    });
                  }}
                  placeholder="09:00"
                />
                <Text style={styles.timeSeparator}>-</Text>
                <TextInput
                  style={styles.timeInput}
                  value={hours.close}
                  onChangeText={(text) => {
                    setBusinessHours({
                      ...businessHours,
                      [day]: { ...hours, close: text }
                    });
                  }}
                  placeholder="17:00"
                />
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={saveProfile} disabled={saving}>
            <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cover Photo */}
        <View style={styles.coverPhotoSection}>
          <Text style={styles.label}>Cover Photo</Text>
          {renderImagePicker('cover', coverPhotoUrl, () => pickImage('cover'))}
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Text style={styles.label}>Profile Photo</Text>
          {renderImagePicker('avatar', avatarUrl, () => pickImage('avatar'))}
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio (500 characters max)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              multiline
              maxLength={500}
            />
            <Text style={styles.charCount}>{bio.length}/500</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.locationInput}>
              <TextInput
                style={[styles.input, styles.locationTextInput]}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter your location"
              />
              <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                <Ionicons name="location" size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={user?.email || ''}
              editable={false}
              placeholder="Email (verified via auth)"
            />
            <Text style={styles.helpText}>Email cannot be changed</Text>
          </View>
        </View>

        {/* Provider-specific fields */}
        {user?.user_type === 'provider' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Business Name</Text>
                <TextInput
                  style={styles.input}
                  value={businessName}
                  onChangeText={setBusinessName}
                  placeholder="Enter your business name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Service Areas</Text>
                <TouchableOpacity style={styles.addButton} onPress={addServiceArea}>
                  <Ionicons name="add" size={20} color="#007AFF" />
                  <Text style={styles.addButtonText}>Add Service Area</Text>
                </TouchableOpacity>
                {serviceAreas.map((area, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{area}</Text>
                    <TouchableOpacity onPress={() => removeServiceArea(index)}>
                      <Ionicons name="close" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Specialties</Text>
                <TouchableOpacity style={styles.addButton} onPress={addSpecialty}>
                  <Ionicons name="add" size={20} color="#007AFF" />
                  <Text style={styles.addButtonText}>Add Specialty</Text>
                </TouchableOpacity>
                {specialties.map((specialty, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{specialty}</Text>
                    <TouchableOpacity onPress={() => removeSpecialty(index)}>
                      <Ionicons name="close" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {renderBusinessHours()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
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
  saveButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonDisabled: {
    color: '#ccc',
  },
  coverPhotoSection: {
    padding: 20,
    alignItems: 'center',
  },
  avatarSection: {
    padding: 20,
    alignItems: 'center',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextInput: {
    flex: 1,
    marginRight: 10,
  },
  locationButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  imagePicker: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: 200,
    height: 100,
  },
  imagePlaceholder: {
    width: 200,
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  tagText: {
    flex: 1,
    fontSize: 14,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayText: {
    fontSize: 16,
    width: 80,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 60,
    textAlign: 'center',
  },
  timeSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
  },
});
