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
  Picker,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'react-native-document-picker';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, Pet } from '../../types';
import { supabase } from '../../services/supabase';
import { analyticsService } from '../../services/analytics';
import { errorTrackingService } from '../../services/errorTracking';

type AddEditPetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddEditPet'>;
type AddEditPetScreenRouteProp = RouteProp<RootStackParamList, 'AddEditPet'>;

interface Props {
  navigation: AddEditPetScreenNavigationProp;
  route: AddEditPetScreenRouteProp;
}

const BREEDS = {
  dog: [
    'Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'French Bulldog',
    'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'German Shorthaired Pointer',
    'Siberian Husky', 'Dachshund', 'Pembroke Welsh Corgi', 'Australian Shepherd',
    'Yorkshire Terrier', 'Boston Terrier', 'Mixed Breed', 'Other'
  ],
  cat: [
    'Persian', 'Maine Coon', 'British Shorthair', 'Ragdoll', 'American Shorthair',
    'Scottish Fold', 'Sphynx', 'Russian Blue', 'Siamese', 'Abyssinian',
    'Bengal', 'Munchkin', 'Mixed Breed', 'Other'
  ],
  other: ['Rabbit', 'Hamster', 'Guinea Pig', 'Bird', 'Fish', 'Reptile', 'Other']
};

export default function AddEditPetScreen({ navigation, route }: Props) {
  const { petId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [vaccinationRecords, setVaccinationRecords] = useState<string[]>([]);

  useEffect(() => {
    if (petId) {
      setIsEdit(true);
      loadPet();
    }
  }, [petId]);

  const loadPet = async () => {
    try {
      setLoading(true);
      
      const { data: petData, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', petId)
        .single();

      if (error) throw error;

      setName(petData.name);
      setSpecies(petData.species);
      setBreed(petData.breed);
      setAge(petData.age.toString());
      setWeight(petData.weight?.toString() || '');
      setSpecialNeeds(petData.special_needs || '');
      setPhotoUrl(petData.photo_url || '');
      setVaccinationRecords(petData.vaccination_records || []);

    } catch (error) {
      errorTrackingService.captureException(error as Error, 'AddEditPetScreen.loadPet');
      Alert.alert('Error', 'Failed to load pet details');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        
        // Upload to Supabase storage
        const { data: { user } } = await supabase.auth.getUser();
        const fileName = `${user?.id}/pet_${Date.now()}.jpg`;
        
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: `pet_${Date.now()}.jpg`,
        } as any);

        const { data, error } = await supabase.storage
          .from('pet-images')
          .upload(fileName, formData);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('pet-images')
          .getPublicUrl(fileName);

        setPhotoUrl(publicUrl);
      }
    } catch (error) {
      errorTrackingService.captureException(error as Error, 'AddEditPetScreen.pickImage');
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const pickVaccinationRecord = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: false,
      });

      if (result.length > 0) {
        const file = result[0];
        
        // Upload to Supabase storage
        const { data: { user } } = await supabase.auth.getUser();
        const fileName = `${user?.id}/vaccination_${Date.now()}.${file.name?.split('.').pop()}`;
        
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        } as any);

        const { data, error } = await supabase.storage
          .from('pet-documents')
          .upload(fileName, formData);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('pet-documents')
          .getPublicUrl(fileName);

        setVaccinationRecords([...vaccinationRecords, publicUrl]);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        // User cancelled
        return;
      }
      errorTrackingService.captureException(error as Error, 'AddEditPetScreen.pickVaccinationRecord');
      Alert.alert('Error', 'Failed to upload document');
    }
  };

  const removeVaccinationRecord = (index: number) => {
    setVaccinationRecords(vaccinationRecords.filter((_, i) => i !== index));
  };

  const savePet = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter a pet name');
        return;
      }

      if (!breed.trim()) {
        Alert.alert('Error', 'Please select a breed');
        return;
      }

      if (!age.trim() || isNaN(Number(age))) {
        Alert.alert('Error', 'Please enter a valid age');
        return;
      }

      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const petData = {
        owner_id: user.id,
        name: name.trim(),
        species,
        breed: breed.trim(),
        age: Number(age),
        weight: weight ? Number(weight) : null,
        special_needs: specialNeeds.trim() || null,
        photo_url: photoUrl || null,
        vaccination_records: vaccinationRecords,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        const { error } = await supabase
          .from('pets')
          .update(petData)
          .eq('id', petId);

        if (error) throw error;

        Alert.alert('Success', 'Pet updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);

        analyticsService.logEvent('pet_updated', {
          pet_id: petId,
          species: species,
        });
      } else {
        const { data, error } = await supabase
          .from('pets')
          .insert([{ ...petData, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;

        Alert.alert('Success', 'Pet added successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);

        analyticsService.logPetAdded(data.id, species);
      }

    } catch (error) {
      errorTrackingService.captureException(error as Error, 'AddEditPetScreen.savePet');
      Alert.alert('Error', 'Failed to save pet');
    } finally {
      setSaving(false);
    }
  };

  const renderImagePicker = () => (
    <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.imagePreview} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="camera" size={40} color="#ccc" />
          <Text style={styles.imagePlaceholderText}>Add Photo</Text>
        </View>
      )}
      <View style={styles.imageOverlay}>
        <Ionicons name="camera" size={16} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  const renderVaccinationRecords = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Vaccination Records</Text>
      
      <TouchableOpacity style={styles.addDocumentButton} onPress={pickVaccinationRecord}>
        <Ionicons name="add" size={20} color="#007AFF" />
        <Text style={styles.addDocumentText}>Add Vaccination Record</Text>
      </TouchableOpacity>

      {vaccinationRecords.map((record, index) => (
        <View key={index} style={styles.documentItem}>
          <Ionicons name="document-text" size={20} color="#666" />
          <Text style={styles.documentText} numberOfLines={1}>
            Record {index + 1}
          </Text>
          <TouchableOpacity onPress={() => removeVaccinationRecord(index)}>
            <Ionicons name="close" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

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
          <Text style={styles.headerTitle}>
            {isEdit ? 'Edit Pet' : 'Add Pet'}
          </Text>
          <TouchableOpacity onPress={savePet} disabled={saving}>
            <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pet Photo */}
        <View style={styles.photoSection}>
          <Text style={styles.label}>Pet Photo</Text>
          {renderImagePicker()}
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pet Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter pet name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Species *</Text>
            <View style={styles.speciesContainer}>
              {(['dog', 'cat', 'other'] as const).map((spec) => (
                <TouchableOpacity
                  key={spec}
                  style={[
                    styles.speciesButton,
                    species === spec && styles.speciesButtonActive
                  ]}
                  onPress={() => {
                    setSpecies(spec);
                    setBreed(''); // Reset breed when species changes
                  }}
                >
                  <Text style={[
                    styles.speciesButtonText,
                    species === spec && styles.speciesButtonTextActive
                  ]}>
                    {spec.charAt(0).toUpperCase() + spec.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Breed *</Text>
            <View style={styles.breedContainer}>
              {BREEDS[species].map((breedOption) => (
                <TouchableOpacity
                  key={breedOption}
                  style={[
                    styles.breedButton,
                    breed === breedOption && styles.breedButtonActive
                  ]}
                  onPress={() => setBreed(breedOption)}
                >
                  <Text style={[
                    styles.breedButtonText,
                    breed === breedOption && styles.breedButtonTextActive
                  ]}>
                    {breedOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Age (years) *</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Weight (lbs)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="0"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Special Needs/Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={specialNeeds}
              onChangeText={setSpecialNeeds}
              placeholder="Any special needs or notes about your pet"
              multiline
            />
          </View>
        </View>

        {renderVaccinationRecords()}
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
  photoSection: {
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
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
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
    height: 80,
    textAlignVertical: 'top',
  },
  imagePicker: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
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
  speciesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  speciesButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  speciesButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  speciesButtonText: {
    fontSize: 16,
    color: '#666',
  },
  speciesButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  breedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  breedButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
  },
  breedButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  breedButtonText: {
    fontSize: 14,
    color: '#666',
  },
  breedButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  addDocumentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 10,
  },
  addDocumentText: {
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  documentText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
});
