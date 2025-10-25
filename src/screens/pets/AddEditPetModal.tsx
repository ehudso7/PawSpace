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
  Picker,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Pet } from '../../types';
import { supabase } from '../../services/supabase';
import AnalyticsService from '../../services/analytics';

const AddEditPetModal: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pet } = route.params as { pet: Pet | null };
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as 'dog' | 'cat' | 'other',
    breed: '',
    age: '',
    weight: '',
    special_needs: '',
    photo: '',
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age.toString(),
        weight: pet.weight?.toString() || '',
        special_needs: pet.special_needs || '',
        photo: pet.photo || '',
      });
    }
    AnalyticsService.getInstance().logScreenView('AddEditPetModal');
  }, [pet]);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setFormData(prev => ({ ...prev, photo: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a pet name');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const petData = {
        name: formData.name.trim(),
        species: formData.species,
        breed: formData.breed.trim(),
        age: parseInt(formData.age) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        special_needs: formData.special_needs.trim() || null,
        photo: formData.photo,
        user_id: user.id,
      };

      if (pet) {
        // Update existing pet
        const { error } = await supabase
          .from('pets')
          .update(petData)
          .eq('id', pet.id);

        if (error) throw error;
        AnalyticsService.getInstance().logEvent('pet_updated', { pet_id: pet.id });
      } else {
        // Create new pet
        const { error } = await supabase
          .from('pets')
          .insert([petData]);

        if (error) throw error;
        AnalyticsService.getInstance().logEvent('pet_added', { 
          species: formData.species 
        });
      }

      Alert.alert('Success', `Pet ${pet ? 'updated' : 'added'} successfully`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving pet:', error);
      Alert.alert('Error', `Failed to ${pet ? 'update' : 'add'} pet`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Pet Photo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Photo</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
            {formData.photo ? (
              <Image source={{ uri: formData.photo }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Tap to add photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Pet Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Pet Name *"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Species</Text>
            <Picker
              selectedValue={formData.species}
              onValueChange={(value) => setFormData(prev => ({ ...prev, species: value }))}
              style={styles.picker}
            >
              <Picker.Item label="Dog" value="dog" />
              <Picker.Item label="Cat" value="cat" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={formData.breed}
            onChangeText={(text) => setFormData(prev => ({ ...prev, breed: text }))}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Age (years)"
              value={formData.age}
              onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Weight (lbs)"
              value={formData.weight}
              onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
              keyboardType="numeric"
            />
          </View>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Special needs or notes"
            value={formData.special_needs}
            onChangeText={(text) => setFormData(prev => ({ ...prev, special_needs: text }))}
            multiline
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : (pet ? 'Update Pet' : 'Add Pet')}
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  pickerContainer: {
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
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

export default AddEditPetModal;