import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, TouchableOpacity } from 'react-native';
import { theme } from '@/constants/theme';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface Pet {
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  age: string;
  weight: string;
  notes: string;
}

export default function AddPetScreen(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [pet, setPet] = useState<Pet>({
    name: '',
    type: 'dog',
    breed: '',
    age: '',
    weight: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<Pet>>({});

  const validateForm = () => {
    const newErrors: Partial<Pet> = {};
    
    if (!pet.name.trim()) {
      newErrors.name = 'Pet name is required';
    }
    
    if (!pet.breed.trim()) {
      newErrors.breed = 'Breed is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    // TODO: Save pet to API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    Alert.alert('Success', 'Pet added successfully!', [
      {
        text: 'OK',
        onPress: () => {
          // Reset form or navigate back
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Add a Pet</Text>
        <Text style={styles.subtitle}>Tell us about your furry friend</Text>

        <Input
          label="Pet Name"
          placeholder="e.g., Max, Bella"
          value={pet.name}
          onChangeText={(text) => {
            setPet({ ...pet, name: text });
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          error={errors.name}
          editable={!loading}
        />

        <View style={styles.typeSection}>
          <Text style={styles.typeLabel}>Pet Type</Text>
          <View style={styles.typeButtons}>
            {(['dog', 'cat', 'other'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  pet.type === type && styles.typeButtonActive,
                ]}
                onPress={() => setPet({ ...pet, type })}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    pet.type === type && styles.typeButtonTextActive,
                  ]}
                >
                  {type === 'dog' ? '?? Dog' : type === 'cat' ? '?? Cat' : '?? Other'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input
          label="Breed"
          placeholder="e.g., Golden Retriever, Persian"
          value={pet.breed}
          onChangeText={(text) => {
            setPet({ ...pet, breed: text });
            if (errors.breed) setErrors({ ...errors, breed: undefined });
          }}
          error={errors.breed}
          editable={!loading}
        />

        <Input
          label="Age"
          placeholder="e.g., 3 years"
          value={pet.age}
          onChangeText={(text) => setPet({ ...pet, age: text })}
          keyboardType="default"
          editable={!loading}
        />

        <Input
          label="Weight (optional)"
          placeholder="e.g., 25 lbs"
          value={pet.weight}
          onChangeText={(text) => setPet({ ...pet, weight: text })}
          keyboardType="decimal-pad"
          editable={!loading}
        />

        <Input
          label="Special Notes (optional)"
          placeholder="Any special care instructions..."
          value={pet.notes}
          onChangeText={(text) => setPet({ ...pet, notes: text })}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          editable={!loading}
        />

        <Button
          title={loading ? 'Adding Pet...' : 'Add Pet'}
          onPress={handleSave}
          disabled={loading}
          style={styles.saveButton}
        />
      </ScrollView>
      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 32,
  },
  typeSection: {
    marginBottom: 16,
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  typeButtonTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});