import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Picker,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { supabase, Pet } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { errorTrackingService } from '../../services/errorTracking';

interface AddEditPetModalProps {
  visible: boolean;
  pet?: Pet | null;
  onClose: () => void;
  onSave: (pet: Pet) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Pet name is required').min(1, 'Name must be at least 1 character'),
  species: Yup.string().required('Species is required'),
  age: Yup.number().min(0, 'Age must be positive').max(30, 'Age must be realistic'),
  weight: Yup.number().min(0.1, 'Weight must be positive').max(500, 'Weight must be realistic'),
});

const DOG_BREEDS = [
  'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle',
  'Beagle', 'Rottweiler', 'Yorkshire Terrier', 'Dachshund', 'Siberian Husky',
  'Boxer', 'Great Dane', 'Chihuahua', 'Shih Tzu', 'Boston Terrier',
  'Pomeranian', 'Australian Shepherd', 'Cocker Spaniel', 'Border Collie', 'Maltese',
  'Mixed Breed', 'Other'
];

const CAT_BREEDS = [
  'Persian', 'Maine Coon', 'Ragdoll', 'British Shorthair', 'Abyssinian',
  'Russian Blue', 'Siamese', 'American Shorthair', 'Scottish Fold', 'Sphynx',
  'Bengal', 'Birman', 'Oriental Shorthair', 'Devon Rex', 'Cornish Rex',
  'Manx', 'Norwegian Forest Cat', 'Himalayan', 'Exotic Shorthair', 'Burmese',
  'Mixed Breed', 'Other'
];

export const AddEditPetModal: React.FC<AddEditPetModalProps> = ({
  visible,
  pet,
  onClose,
  onSave,
}) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [vaccinationFiles, setVaccinationFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pet) {
      setPhotoUri(pet.photo_url);
      setVaccinationFiles(pet.vaccination_records || []);
    } else {
      setPhotoUri(null);
      setVaccinationFiles([]);
    }
  }, [pet]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'AddEditPetModal.pickImage',
      });
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickVaccinationFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setVaccinationFiles(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'AddEditPetModal.pickVaccinationFile',
      });
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const uploadFile = async (uri: string, folder: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('pets')
        .upload(filePath, arrayBuffer, {
          contentType: fileExt === 'pdf' ? 'application/pdf' : `image/${fileExt}`,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('pets')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'AddEditPetModal.uploadFile',
        folder,
      });
      return null;
    }
  };

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let photoUrl = pet?.photo_url;
      let vaccinationUrls = pet?.vaccination_records || [];

      // Upload new photo if selected
      if (photoUri && photoUri !== pet?.photo_url) {
        const uploadedPhotoUrl = await uploadFile(photoUri, 'photos');
        if (uploadedPhotoUrl) photoUrl = uploadedPhotoUrl;
      }

      // Upload new vaccination files
      const newFiles = vaccinationFiles.filter(file => 
        !pet?.vaccination_records?.includes(file)
      );
      
      for (const file of newFiles) {
        const uploadedUrl = await uploadFile(file, 'vaccinations');
        if (uploadedUrl) {
          vaccinationUrls = [...vaccinationUrls, uploadedUrl];
        }
      }

      const petData = {
        user_id: user.id,
        name: values.name,
        species: values.species,
        breed: values.breed || null,
        age: values.age ? parseInt(values.age) : null,
        weight: values.weight ? parseFloat(values.weight) : null,
        photo_url: photoUrl,
        special_needs: values.special_needs || null,
        vaccination_records: vaccinationUrls,
      };

      let savedPet: Pet;

      if (pet) {
        // Update existing pet
        const { data, error } = await supabase
          .from('pets')
          .update(petData)
          .eq('id', pet.id)
          .select()
          .single();

        if (error) throw error;
        savedPet = data;

        analyticsService.logEvent('pet_updated', {
          pet_id: pet.id,
          species: values.species,
        });
      } else {
        // Create new pet
        const { data, error } = await supabase
          .from('pets')
          .insert(petData)
          .select()
          .single();

        if (error) throw error;
        savedPet = data;

        analyticsService.logEvent('pet_added', {
          pet_id: data.id,
          species: values.species,
        });
      }

      onSave(savedPet);
    } catch (error) {
      errorTrackingService.captureException(error as Error, {
        context: 'AddEditPetModal.handleSave',
        petId: pet?.id,
      });
      Alert.alert('Error', 'Failed to save pet');
    } finally {
      setLoading(false);
    }
  };

  const getBreedOptions = (species: string) => {
    switch (species) {
      case 'dog':
        return DOG_BREEDS;
      case 'cat':
        return CAT_BREEDS;
      default:
        return ['Other'];
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {pet ? 'Edit Pet' : 'Add Pet'}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        <Formik
          initialValues={{
            name: pet?.name || '',
            species: pet?.species || 'dog',
            breed: pet?.breed || '',
            age: pet?.age?.toString() || '',
            weight: pet?.weight?.toString() || '',
            special_needs: pet?.special_needs || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Pet Photo */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pet Photo</Text>
                <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
                  <Image
                    source={{ uri: photoUri || 'https://via.placeholder.com/120' }}
                    style={styles.photoImage}
                  />
                  <View style={styles.photoOverlay}>
                    <Ionicons name="camera" size={24} color="white" />
                    <Text style={styles.photoOverlayText}>
                      {photoUri ? 'Change Photo' : 'Add Photo'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Basic Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Basic Information</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Pet Name *</Text>
                  <TextInput
                    style={[styles.input, errors.name && touched.name && styles.inputError]}
                    value={values.name}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholder="Enter your pet's name"
                  />
                  {errors.name && touched.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Species *</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={values.species}
                      onValueChange={(value) => {
                        setFieldValue('species', value);
                        setFieldValue('breed', ''); // Reset breed when species changes
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Dog" value="dog" />
                      <Picker.Item label="Cat" value="cat" />
                      <Picker.Item label="Other" value="other" />
                    </Picker>
                  </View>
                </View>

                {values.species !== 'other' && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Breed</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={values.breed}
                        onValueChange={handleChange('breed')}
                        style={styles.picker}
                      >
                        <Picker.Item label="Select breed..." value="" />
                        {getBreedOptions(values.species).map((breed) => (
                          <Picker.Item key={breed} label={breed} value={breed} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                )}

                <View style={styles.row}>
                  <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Age (years)</Text>
                    <TextInput
                      style={[styles.input, errors.age && touched.age && styles.inputError]}
                      value={values.age}
                      onChangeText={handleChange('age')}
                      onBlur={handleBlur('age')}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                    {errors.age && touched.age && (
                      <Text style={styles.errorText}>{errors.age}</Text>
                    )}
                  </View>

                  <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>Weight (lbs)</Text>
                    <TextInput
                      style={[styles.input, errors.weight && touched.weight && styles.inputError]}
                      value={values.weight}
                      onChangeText={handleChange('weight')}
                      onBlur={handleBlur('weight')}
                      placeholder="0.0"
                      keyboardType="decimal-pad"
                    />
                    {errors.weight && touched.weight && (
                      <Text style={styles.errorText}>{errors.weight}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Special Needs/Notes</Text>
                  <TextInput
                    style={styles.textArea}
                    value={values.special_needs}
                    onChangeText={handleChange('special_needs')}
                    onBlur={handleBlur('special_needs')}
                    placeholder="Any special care instructions, medical conditions, or behavioral notes..."
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>

              {/* Vaccination Records */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vaccination Records</Text>
                <Text style={styles.sectionSubtitle}>
                  Upload vaccination certificates or medical records (PDF or images)
                </Text>
                
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickVaccinationFile}
                >
                  <Ionicons name="document-attach" size={24} color="#007AFF" />
                  <Text style={styles.uploadButtonText}>Add Document</Text>
                </TouchableOpacity>

                {vaccinationFiles.length > 0 && (
                  <View style={styles.filesContainer}>
                    {vaccinationFiles.map((file, index) => (
                      <View key={index} style={styles.fileItem}>
                        <Ionicons name="document" size={20} color="#666" />
                        <Text style={styles.fileName} numberOfLines={1}>
                          Document {index + 1}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setVaccinationFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <Ionicons name="close-circle" size={20} color="#ff6b6b" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Saving...' : pet ? 'Update Pet' : 'Add Pet'}
                </Text>
              </TouchableOpacity>

              <View style={{ height: 50 }} />
            </ScrollView>
          )}
        </Formik>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
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
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  photoContainer: {
    alignSelf: 'center',
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: 120,
    height: 120,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOverlayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
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
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: 'row',
  },
  errorText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginTop: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  filesContainer: {
    marginTop: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
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