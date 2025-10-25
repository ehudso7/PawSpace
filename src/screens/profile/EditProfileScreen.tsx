import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { User, Provider, BusinessHours } from '../../types';
import { supabase } from '../../services/supabase';
import AnalyticsService from '../../services/analytics';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<User | Provider | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    phone: '',
    profile_photo: '',
    cover_photo: '',
    business_name: '',
    business_hours: {} as BusinessHours,
    service_areas: [] as string[],
    specialties: [] as string[],
  });

  useEffect(() => {
    loadUserData();
    AnalyticsService.getInstance().logScreenView('EditProfileScreen');
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;
      
      setUser(userData);
      setFormData({
        full_name: userData.full_name || '',
        bio: userData.bio || '',
        location: userData.location || '',
        phone: userData.phone || '',
        profile_photo: userData.profile_photo || '',
        cover_photo: userData.cover_photo || '',
        business_name: (userData as Provider)?.business_name || '',
        business_hours: (userData as Provider)?.business_hours || {} as BusinessHours,
        service_areas: (userData as Provider)?.service_areas || [],
        specialties: (userData as Provider)?.specialties || [],
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    }
  };

  const handleImagePicker = async (type: 'profile' | 'cover') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'profile' ? [1, 1] : [2, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        if (type === 'profile') {
          setFormData(prev => ({ ...prev, profile_photo: imageUri }));
        } else {
          setFormData(prev => ({ ...prev, cover_photo: imageUri }));
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleLocationPicker = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      // In a real app, you'd reverse geocode this to get address
      setFormData(prev => ({ 
        ...prev, 
        location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
      }));
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updateData: any = {
        full_name: formData.full_name,
        bio: formData.bio,
        location: formData.location,
        phone: formData.phone,
        profile_photo: formData.profile_photo,
        cover_photo: formData.cover_photo,
      };

      if (user.user_type === 'provider') {
        updateData.business_name = formData.business_name;
        updateData.business_hours = formData.business_hours;
        updateData.service_areas = formData.service_areas;
        updateData.specialties = formData.specialties;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

      AnalyticsService.getInstance().logEvent('profile_updated', {
        user_type: user.user_type,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderImagePicker = (type: 'profile' | 'cover', currentImage: string) => (
    <TouchableOpacity
      style={type === 'profile' ? styles.imagePicker : styles.coverPicker}
      onPress={() => handleImagePicker(type)}
    >
      {currentImage ? (
        <Image source={{ uri: currentImage }} style={styles.previewImage} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {type === 'profile' ? 'Tap to add photo' : 'Tap to add cover'}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderBusinessHours = () => {
    if (user?.user_type !== 'provider') return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Hours</Text>
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
          <View key={day} style={styles.businessHourRow}>
            <Text style={styles.dayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            <Switch
              value={formData.business_hours[day as keyof BusinessHours]?.closed === false}
              onValueChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  business_hours: {
                    ...prev.business_hours,
                    [day]: {
                      ...prev.business_hours[day as keyof BusinessHours],
                      closed: !value,
                      open: value ? '09:00' : '09:00',
                      close: value ? '17:00' : '17:00',
                    }
                  }
                }));
              }}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Photo</Text>
          {renderImagePicker('profile', formData.profile_photo)}
        </View>

        {/* Cover Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cover Photo</Text>
          {renderImagePicker('cover', formData.cover_photo)}
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.full_name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, full_name: text }))}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Bio (500 characters max)"
            value={formData.bio}
            onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
            multiline
            maxLength={500}
          />

          <TouchableOpacity style={styles.locationButton} onPress={handleLocationPicker}>
            <Text style={styles.locationButtonText}>
              {formData.location ? 'Update Location' : 'Set Location'}
            </Text>
          </TouchableOpacity>
          {formData.location && (
            <Text style={styles.locationText}>Location: {formData.location}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={user?.email || ''}
            editable={false}
            style={[styles.input, styles.disabledInput]}
          />
        </View>

        {/* Provider-specific fields */}
        {user?.user_type === 'provider' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Information</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Business Name"
              value={formData.business_name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, business_name: text }))}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Service Areas (comma-separated)"
              value={formData.service_areas.join(', ')}
              onChangeText={(text) => setFormData(prev => ({ 
                ...prev, 
                service_areas: text.split(',').map(area => area.trim()).filter(Boolean)
              }))}
              multiline
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Specialties (comma-separated)"
              value={formData.specialties.join(', ')}
              onChangeText={(text) => setFormData(prev => ({ 
                ...prev, 
                specialties: text.split(',').map(specialty => specialty.trim()).filter(Boolean)
              }))}
              multiline
            />

            {renderBusinessHours()}
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  coverPicker: {
    width: '100%',
    height: 150,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  locationButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 15,
  },
  businessHourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dayLabel: {
    fontSize: 16,
    color: '#1f2937',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;