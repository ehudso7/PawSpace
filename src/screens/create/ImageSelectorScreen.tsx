import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { useEditorStore } from '../../store/editorStore';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface UploadedImage {
  uri: string;
  width: number;
  height: number;
}

export const ImageSelectorScreen = () => {
  const navigation = useNavigation();
  const { setImages } = useEditorStore();
  const [beforeImage, setBeforeImage] = useState<UploadedImage | null>(null);
  const [afterImage, setAfterImage] = useState<UploadedImage | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || libraryPermission.status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and photo library permissions to upload images.'
      );
      return false;
    }
    return true;
  };

  const validateAndProcessImage = async (uri: string): Promise<UploadedImage | null> => {
    try {
      setLoading(true);
      
      // Get image info
      const imageInfo = await ImageManipulator.manipulateAsync(
        uri,
        [],
        { format: ImageManipulator.SaveFormat.JPEG }
      );

      const { width, height } = imageInfo;

      // Validate minimum size
      if (width < 800 || height < 800) {
        Alert.alert(
          'Image Too Small',
          'Please select an image that is at least 800x800 pixels for best quality.'
        );
        return null;
      }

      // Compress if too large
      let processedUri = uri;
      if (width > 4096 || height > 4096) {
        const compressed = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 4096 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        processedUri = compressed.uri;
      }

      return {
        uri: processedUri,
        width: Math.min(width, 4096),
        height: Math.min(height, 4096),
      };
    } catch (error) {
      Alert.alert('Error', 'Failed to process image. Please try another image.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const showImagePickerOptions = (type: 'before' | 'after') => {
    Alert.alert(
      'Upload Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: () => takePhoto(type),
        },
        {
          text: 'Choose from Library',
          onPress: () => pickFromLibrary(type),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const takePhoto = async (type: 'before' | 'after') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      const processed = await validateAndProcessImage(result.assets[0].uri);
      if (processed) {
        if (type === 'before') {
          setBeforeImage(processed);
        } else {
          setAfterImage(processed);
        }
      }
    }
  };

  const pickFromLibrary = async (type: 'before' | 'after') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });

    if (!result.canceled && result.assets[0]) {
      const processed = await validateAndProcessImage(result.assets[0].uri);
      if (processed) {
        if (type === 'before') {
          setBeforeImage(processed);
        } else {
          setAfterImage(processed);
        }
      }
    }
  };

  const removeImage = (type: 'before' | 'after') => {
    if (type === 'before') {
      setBeforeImage(null);
    } else {
      setAfterImage(null);
    }
  };

  const handleContinue = () => {
    if (beforeImage && afterImage) {
      setImages(beforeImage.uri, afterImage.uri);
      navigation.navigate('Editor' as never);
    }
  };

  const renderUploadCard = (type: 'before' | 'after', image: UploadedImage | null) => (
    <View style={styles.uploadCard}>
      <Text style={styles.cardLabel}>{type === 'before' ? 'Before' : 'After'}</Text>
      
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => showImagePickerOptions(type)}
        disabled={loading}
      >
        {image ? (
          <>
            <Image source={{ uri: image.uri }} style={styles.thumbnail} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(type)}
            >
              <Ionicons name="close-circle" size={28} color="#FF3B30" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={48} color="#999" />
            <Text style={styles.placeholderText}>Tap to upload</Text>
          </View>
        )}
      </TouchableOpacity>

      {image && (
        <Text style={styles.imageDimensions}>
          {image.width} x {image.height}px
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6B4EFF" />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Create Transformation</Text>
      </View>

      <View style={styles.instructionsCard}>
        <Ionicons name="sparkles" size={24} color="#6B4EFF" />
        <Text style={styles.instructionsTitle}>
          Create a transformation to showcase your pet care work
        </Text>
        <Text style={styles.instructionsSubtitle}>
          Upload before and after photos
        </Text>
      </View>

      <View style={styles.uploadSection}>
        {renderUploadCard('before', beforeImage)}
        {renderUploadCard('after', afterImage)}
      </View>

      <View style={styles.requirementsCard}>
        <Ionicons name="information-circle-outline" size={20} color="#666" />
        <Text style={styles.requirementsText}>
          Best quality: Square images, minimum 800x800px
        </Text>
      </View>

      {beforeImage && afterImage && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Preview</Text>
          <View style={styles.previewThumbnails}>
            <Image source={{ uri: beforeImage.uri }} style={styles.previewThumb} />
            <Ionicons name="arrow-forward" size={24} color="#6B4EFF" />
            <Image source={{ uri: afterImage.uri }} style={styles.previewThumb} />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.continueButton,
          (!beforeImage || !afterImage) && styles.continueButtonDisabled,
        ]}
        onPress={handleContinue}
        disabled={!beforeImage || !afterImage || loading}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFF" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  instructionsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 12,
    marginBottom: 8,
  },
  instructionsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  uploadSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  uploadCard: {
    width: CARD_WIDTH,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  imageContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 12,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFF',
    borderRadius: 14,
  },
  imageDimensions: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  requirementsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  requirementsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  previewSection: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  previewThumbnails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  previewThumb: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: '#6B4EFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCC',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 8,
  },
});
