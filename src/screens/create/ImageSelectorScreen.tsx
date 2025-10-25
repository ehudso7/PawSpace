import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEditorStore } from '../../store/editorStore';
import { pickImage, validateImageSize, compressImage } from '../../utils/imageUtils';
import { ImagePickerResult } from '../../types';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

interface UploadZoneProps {
  type: 'before' | 'after';
  imageUri: string | null;
  onImageSelect: (result: ImagePickerResult | null) => void;
  onRemoveImage: () => void;
  isProcessing: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  type,
  imageUri,
  onImageSelect,
  onRemoveImage,
  isProcessing,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async (source: 'camera' | 'library') => {
    if (isProcessing || isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await pickImage(source);
      if (result) {
        if (!validateImageSize(result.width, result.height)) {
          Alert.alert(
            'Image Size Issue',
            'Please select an image that is at least 800x800 pixels and no larger than 4096x4096 pixels.',
            [{ text: 'OK' }]
          );
          return;
        }
        
        const compressedUri = await compressImage(result.uri);
        onImageSelect({ ...result, uri: compressedUri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      `Select ${type === 'before' ? 'Before' : 'After'} Image`,
      'Choose how you want to add your image',
      [
        { text: 'Take Photo', onPress: () => handleImagePick('camera') },
        { text: 'Choose from Library', onPress: () => handleImagePick('library') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.uploadCard, imageUri && styles.uploadCardFilled]}
      onPress={showImageOptions}
      disabled={isProcessing || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.thumbnail} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemoveImage}
            disabled={isProcessing}
          >
            <Ionicons name="close-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Ionicons
            name={type === 'before' ? 'camera-outline' : 'camera-outline'}
            size={40}
            color="#8E8E93"
          />
          <Text style={styles.placeholderText}>
            {type === 'before' ? 'Before' : 'After'}
          </Text>
          <Text style={styles.placeholderSubtext}>Tap to add</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const ImageSelectorScreen: React.FC = () => {
  const {
    beforeImage,
    afterImage,
    setBeforeImage,
    setAfterImage,
    isProcessing,
    setProcessing,
  } = useEditorStore();

  const canContinue = beforeImage && afterImage;

  const handleImageSelect = (type: 'before' | 'after') => (result: ImagePickerResult | null) => {
    if (result) {
      if (type === 'before') {
        setBeforeImage(result.uri);
      } else {
        setAfterImage(result.uri);
      }
    }
  };

  const handleRemoveImage = (type: 'before' | 'after') => () => {
    if (type === 'before') {
      setBeforeImage(null);
    } else {
      setAfterImage(null);
    }
  };

  const handleContinue = () => {
    if (canContinue) {
      setProcessing(true);
      // Navigate to EditorScreen
      // navigation.navigate('Editor');
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Instructions Card */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>
            Create a transformation to showcase your pet care work
          </Text>
          <Text style={styles.instructionsSubtitle}>
            Upload before and after photos
          </Text>
        </View>

        {/* Upload Zones */}
        <View style={styles.uploadContainer}>
          <UploadZone
            type="before"
            imageUri={beforeImage}
            onImageSelect={handleImageSelect('before')}
            onRemoveImage={handleRemoveImage('before')}
            isProcessing={isProcessing}
          />
          <UploadZone
            type="after"
            imageUri={afterImage}
            onImageSelect={handleImageSelect('after')}
            onRemoveImage={handleRemoveImage('after')}
            isProcessing={isProcessing}
          />
        </View>

        {/* Image Requirements */}
        <View style={styles.requirementsCard}>
          <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.requirementsText}>
            Best quality: Square images, minimum 800x800px
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!canContinue || isProcessing}
        >
          <Text style={[styles.continueButtonText, !canContinue && styles.continueButtonTextDisabled]}>
            Continue
          </Text>
        </TouchableOpacity>

        {/* Preview Thumbnails */}
        {canContinue && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewThumbnails}>
              <Image source={{ uri: beforeImage! }} style={styles.previewThumbnail} />
              <Ionicons name="arrow-forward" size={20} color="#007AFF" />
              <Image source={{ uri: afterImage! }} style={styles.previewThumbnail} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  uploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  uploadCard: {
    width: cardWidth,
    height: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadCardFilled: {
    borderStyle: 'solid',
    borderColor: '#007AFF',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 12,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  requirementsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  requirementsText: {
    fontSize: 14,
    color: '#1976D2',
    marginLeft: 8,
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueButtonTextDisabled: {
    color: '#8E8E93',
  },
  previewContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  previewThumbnails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});

export default ImageSelectorScreen;