import * as ImagePicker from 'expo-image-picker';
import { ImagePickerResult } from '../types';

export const requestPermissions = async (): Promise<boolean> => {
  const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
  const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  return cameraStatus === 'granted' && libraryStatus === 'granted';
};

export const pickImage = async (source: 'camera' | 'library'): Promise<ImagePickerResult | null> => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      throw new Error('Camera and photo library permissions are required');
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 0.8,
      exif: false,
    };

    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
      };
    }

    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

export const validateImageSize = (width: number, height: number): boolean => {
  const minSize = 800;
  const maxSize = 4096;
  
  return width >= minSize && height >= minSize && width <= maxSize && height <= maxSize;
};

export const compressImage = async (uri: string, quality: number = 0.8): Promise<string> => {
  // For now, return the original URI
  // In a real app, you'd use a library like react-native-image-resizer
  return uri;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};