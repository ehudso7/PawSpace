import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Button, useTheme, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { CreateScreenProps } from '../../types/navigation';

type Props = CreateScreenProps<'ImageSelector'>;

const ImageSelectorScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const theme = useTheme();

  const handleImageSelect = () => {
    // Simulate image selection
    const mockImageUri = `https://picsum.photos/800/600?random=${Date.now()}`;
    setSelectedImage(mockImageUri);
  };

  const handleContinue = () => {
    if (selectedImage) {
      navigation.navigate('PostComposer', { imageUri: selectedImage });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.surface} elevation={2}>
          <Text variant="headlineMedium" style={styles.header}>
            Create New Post
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Select a photo to share with the PawSpace community
          </Text>

          <View style={styles.imageContainer}>
            {selectedImage ? (
              <TouchableOpacity onPress={handleImageSelect} style={styles.imageWrapper}>
                <Image source={{ uri: selectedImage }} style={styles.image} />
                <View style={styles.changeOverlay}>
                  <Icon name="camera" size={32} color="white" />
                  <Text style={styles.changeText}>Change Photo</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleImageSelect} style={styles.placeholder}>
                <Icon name="camera-plus" size={64} color={theme.colors.primary} />
                <Text variant="titleMedium" style={[styles.placeholderText, { color: theme.colors.primary }]}>
                  Select Photo
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.options}>
            <Button
              mode="outlined"
              icon="camera"
              onPress={handleImageSelect}
              style={styles.optionButton}
            >
              Take Photo
            </Button>
            <Button
              mode="outlined"
              icon="image"
              onPress={handleImageSelect}
              style={styles.optionButton}
            >
              Choose from Gallery
            </Button>
          </View>

          {selectedImage && (
            <Button
              mode="contained"
              onPress={handleContinue}
              style={styles.continueButton}
              contentStyle={styles.buttonContent}
            >
              Continue
            </Button>
          )}
        </Surface>
      </ScrollView>
    </View>
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
  header: {
    marginBottom: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    marginBottom: 24,
    opacity: 0.7,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  changeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  changeText: {
    color: 'white',
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    width: '100%',
    aspectRatio: 4/3,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  placeholderText: {
    marginTop: 12,
    fontWeight: '600',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  optionButton: {
    flex: 1,
  },
  continueButton: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default ImageSelectorScreen;
