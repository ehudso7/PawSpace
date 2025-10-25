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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { supabase, User } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { errorTrackingService } from '../../services/errorTracking';

interface EditProfileScreenProps {
  navigation: any;
}

const validationSchema = Yup.object().shape({
  full_name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  bio: Yup.string().max(500, 'Bio must be less than 500 characters'),
  phone: Yup.string().matches(/^\+?[\d\s-()]+$/, 'Invalid phone number format'),
  business_name: Yup.string().when('is_provider', {
    is: true,
    then: schema => schema.required('Business name is required for providers'),
  }),
});

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [coverUri, setCoverUri] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
    analyticsService.logScreenView('EditProfile');
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (userData) {
        setUser(userData);
        setAvatarUri(userData.avatar_url);
        setCoverUri(userData.cover_url);
      }
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'EditProfileScreen.loadUserProfile',
      });
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

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        if (type === 'avatar') {
          setAvatarUri(imageUri);
        } else {
          setCoverUri(imageUri);
        }
      }
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'EditProfileScreen.pickImage',
        type,
      });
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadImage = async (uri: string, path: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'EditProfileScreen.uploadImage',
        path,
      });
      return null;
    }
  };

  const pickLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to set your location');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (address[0]) {
        const { city, region, country } = address[0];
        return `${city}, ${region}, ${country}`;
      }
      return null;
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'EditProfileScreen.pickLocation',
      });
      Alert.alert('Error', 'Failed to get location');
      return null;
    }
  };

  const handleSave = async (values: any) => {
    try {
      setSaving(true);
      if (!user) return;

      let avatarUrl = user.avatar_url;
      let coverUrl = user.cover_url;

      // Upload new images if selected
      if (avatarUri && avatarUri !== user.avatar_url) {
        const uploadedAvatarUrl = await uploadImage(avatarUri, 'avatars');
        if (uploadedAvatarUrl) avatarUrl = uploadedAvatarUrl;
      }

      if (coverUri && coverUri !== user.cover_url) {
        const uploadedCoverUrl = await uploadImage(coverUri, 'covers');
        if (uploadedCoverUrl) coverUrl = uploadedCoverUrl;
      }

      // Update user profile
      const { error } = await supabase
        .from('users')
        .update({
          full_name: values.full_name,
          bio: values.bio,
          location: values.location,
          phone: values.phone,
          avatar_url: avatarUrl,
          cover_url: coverUrl,
          business_name: values.business_name,
          business_hours: values.business_hours,
          service_areas: values.service_areas ? values.service_areas.split(',').map((s: string) => s.trim()) : null,
          specialties: values.specialties ? values.specialties.split(',').map((s: string) => s.trim()) : null,
        })
        .eq('id', user.id);

      if (error) throw error;

      analyticsService.logEvent('profile_updated', {
        user_id: user.id,
        is_provider: user.is_provider,
      });

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'EditProfileScreen.handleSave',
      });
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <Formik
        initialValues={{
          full_name: user.full_name || '',
          bio: user.bio || '',
          location: user.location || '',
          phone: user.phone || '',
          business_name: user.business_name || '',
          business_hours: user.business_hours || '',
          service_areas: user.service_areas?.join(', ') || '',
          specialties: user.specialties?.join(', ') || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Cover Photo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cover Photo</Text>
              <TouchableOpacity
                style={styles.coverContainer}
                onPress={() => pickImage('cover')}
              >
                <Image
                  source={{ uri: coverUri || 'https://via.placeholder.com/400x200' }}
                  style={styles.coverImage}
                />
                <View style={styles.imageOverlay}>
                  <Ionicons name="camera" size={24} color="white" />
                  <Text style={styles.imageOverlayText}>Change Cover</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Profile Photo */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile Photo</Text>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() => pickImage('avatar')}
              >
                <Image
                  source={{ uri: avatarUri || 'https://via.placeholder.com/120' }}
                  style={styles.avatarImage}
                />
                <View style={styles.avatarOverlay}>
                  <Ionicons name="camera" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={[styles.input, errors.full_name && touched.full_name && styles.inputError]}
                  value={values.full_name}
                  onChangeText={handleChange('full_name')}
                  onBlur={handleBlur('full_name')}
                  placeholder="Enter your full name"
                />
                {errors.full_name && touched.full_name && (
                  <Text style={styles.errorText}>{errors.full_name}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={[styles.textArea, errors.bio && touched.bio && styles.inputError]}
                  value={values.bio}
                  onChangeText={handleChange('bio')}
                  onBlur={handleBlur('bio')}
                  placeholder="Tell us about yourself (500 characters max)"
                  multiline
                  numberOfLines={4}
                  maxLength={500}
                />
                <Text style={styles.characterCount}>{values.bio.length}/500</Text>
                {errors.bio && touched.bio && (
                  <Text style={styles.errorText}>{errors.bio}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Location</Text>
                <View style={styles.locationInputContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={values.location}
                    onChangeText={handleChange('location')}
                    onBlur={handleBlur('location')}
                    placeholder="Enter your location"
                  />
                  <TouchableOpacity
                    style={styles.locationButton}
                    onPress={async () => {
                      const location = await pickLocation();
                      if (location) {
                        setFieldValue('location', location);
                      }
                    }}
                  >
                    <Ionicons name="location" size={20} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={[styles.input, errors.phone && touched.phone && styles.inputError]}
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
                {errors.phone && touched.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={user.email}
                  editable={false}
                />
                <Text style={styles.helperText}>Email cannot be changed</Text>
              </View>
            </View>

            {/* Provider Information */}
            {user.is_provider && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Business Information</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Business Name *</Text>
                  <TextInput
                    style={[styles.input, errors.business_name && touched.business_name && styles.inputError]}
                    value={values.business_name}
                    onChangeText={handleChange('business_name')}
                    onBlur={handleBlur('business_name')}
                    placeholder="Enter your business name"
                  />
                  {errors.business_name && touched.business_name && (
                    <Text style={styles.errorText}>{errors.business_name}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Business Hours</Text>
                  <TextInput
                    style={styles.input}
                    value={values.business_hours}
                    onChangeText={handleChange('business_hours')}
                    onBlur={handleBlur('business_hours')}
                    placeholder="e.g., Mon-Fri 9AM-6PM, Sat 10AM-4PM"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Service Areas</Text>
                  <TextInput
                    style={styles.input}
                    value={values.service_areas}
                    onChangeText={handleChange('service_areas')}
                    onBlur={handleBlur('service_areas')}
                    placeholder="Enter areas you serve (comma separated)"
                  />
                  <Text style={styles.helperText}>Separate multiple areas with commas</Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Specialties</Text>
                  <TextInput
                    style={styles.input}
                    value={values.specialties}
                    onChangeText={handleChange('specialties')}
                    onBlur={handleBlur('specialties')}
                    placeholder="Enter your specialties (comma separated)"
                  />
                  <Text style={styles.helperText}>e.g., Dog grooming, Cat styling, Nail trimming</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSubmit}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 50 }} />
          </ScrollView>
        )}
      </Formik>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  coverContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: 150,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  avatarContainer: {
    alignSelf: 'center',
    position: 'relative',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationButton: {
    marginLeft: 8,
    padding: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});