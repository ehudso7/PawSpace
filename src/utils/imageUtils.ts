import * as ImagePicker from 'expo-image-picker';
import { ImagePickerResult } from '../types/transformation';
import { IMAGE_CONSTRAINTS } from '../constants/editor';

export interface ImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

export const validateImage = (result: ImagePicker.ImagePickerResult): ImagePickerResult => {
  if (result.canceled || !result.assets || result.assets.length === 0) {
    throw new ImageValidationError('No image selected');
  }

  const asset = result.assets[0];
  
  // Check file size
  if (asset.fileSize && asset.fileSize > IMAGE_CONSTRAINTS.MAX_FILE_SIZE) {
    throw new ImageValidationError('Image file size is too large (max 10MB)');
  }
  
  // Check dimensions
  if (asset.width < IMAGE_CONSTRAINTS.MIN_SIZE || asset.height < IMAGE_CONSTRAINTS.MIN_SIZE) {
    throw new ImageValidationError(`Image is too small (minimum ${IMAGE_CONSTRAINTS.MIN_SIZE}x${IMAGE_CONSTRAINTS.MIN_SIZE}px)`);
  }
  
  if (asset.width > IMAGE_CONSTRAINTS.MAX_SIZE || asset.height > IMAGE_CONSTRAINTS.MAX_SIZE) {
    throw new ImageValidationError(`Image is too large (maximum ${IMAGE_CONSTRAINTS.MAX_SIZE}x${IMAGE_CONSTRAINTS.MAX_SIZE}px)`);
  }
  
  // Check format
  if (asset.type && !IMAGE_CONSTRAINTS.SUPPORTED_FORMATS.includes(asset.type)) {
    throw new ImageValidationError('Unsupported image format. Please use JPEG, PNG, or WebP');
  }

  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    type: asset.type || 'image/jpeg',
    fileSize: asset.fileSize,
  };
};

export const pickImageFromCamera = async (options: ImagePickerOptions = {}): Promise<ImagePickerResult> => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    throw new ImageValidationError('Camera permission is required');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [1, 1],
    quality: options.quality ?? 0.8,
  });

  return validateImage(result);
};

export const pickImageFromLibrary = async (options: ImagePickerOptions = {}): Promise<ImagePickerResult> => {
  const hasPermission = await requestMediaLibraryPermission();
  if (!hasPermission) {
    throw new ImageValidationError('Media library permission is required');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [1, 1],
    quality: options.quality ?? 0.8,
  });

  return validateImage(result);
};

export const compressImage = async (uri: string, quality: number = 0.7): Promise<string> => {
  // This would typically use a library like expo-image-manipulator
  // For now, we'll return the original URI
  return uri;
};

export const resizeImage = async (
  uri: string, 
  targetWidth: number, 
  targetHeight: number
): Promise<string> => {
  // This would typically use expo-image-manipulator
  // For now, we'll return the original URI
  return uri;
};

export const getImageDimensions = async (uri: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    image.src = uri;
  });
};

export const generateThumbnail = async (uri: string, size: number = 200): Promise<string> => {
  // This would typically create a smaller version of the image
  // For now, we'll return the original URI
  return uri;
};