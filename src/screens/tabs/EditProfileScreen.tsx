import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Avatar, useTheme, Surface } from 'react-native-paper';
import type { ProfileScreenProps } from '../../types/navigation';

type Props = ProfileScreenProps<'EditProfile'>;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState('John Doe');
  const [bio, setBio] = useState('Pet lover and dog enthusiast 🐕');
  const [location, setLocation] = useState('San Francisco, CA');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSave = async () => {
    setLoading(true);
    
    // Simulate saving
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.surface} elevation={2}>
          <View style={styles.avatarContainer}>
            <Avatar.Text size={100} label="ME" />
            <Button mode="text" style={styles.changePhotoButton}>
              Change Photo
            </Button>
          </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Profile Information
          </Text>

          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            mode="outlined"
            left={<TextInput.Icon icon="map-marker" />}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Save Changes
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            Cancel
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  surface: {
    padding: 20,
    borderRadius: 12,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  changePhotoButton: {
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default EditProfileScreen;
