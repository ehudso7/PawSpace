import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { errorTrackingService } from '../services/errorTracking';

export interface ImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

export const pickImageFromLibrary = async (options: ImagePickerOptions = {}) => {
  try {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera roll permissions to upload images.'
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: options.allowsEditing ?? true,
      aspect: options.aspect ?? [1, 1],
      quality: options.quality ?? 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    errorTrackingService.captureException(error as Error, {
      context: 'imageUtils.pickImageFromLibrary',
    });
    Alert.alert('Error', 'Failed to pick image from library');
    return null;
  }
};

export const takePicture = async (options: ImagePickerOptions = {}) => {
  try {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take pictures.'
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: options.allowsEditing ?? true,
      aspect: options.aspect ?? [1, 1],
      quality: options.quality ?? 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    errorTrackingService.captureException(error as Error, {
      context: 'imageUtils.takePicture',
    });
    Alert.alert('Error', 'Failed to take picture');
    return null;
  }
};

export const showImagePickerOptions = (
  onImageSelected: (imageUri: string) => void,
  options: ImagePickerOptions = {}
) => {
  Alert.alert(
    'Select Image',
    'Choose how you want to select an image',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Camera',
        onPress: async () => {
          const result = await takePicture(options);
          if (result) {
            onImageSelected(result.uri);
          }
        },
      },
      {
        text: 'Photo Library',
        onPress: async () => {
          const result = await pickImageFromLibrary(options);
          if (result) {
            onImageSelected(result.uri);
          }
        },
      },
    ]
  );
};