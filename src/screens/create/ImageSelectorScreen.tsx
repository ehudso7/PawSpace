import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEditorStore } from '../../store/editorStore';
import { pickImageFromCamera, pickImageFromLibrary, ImageValidationError } from '../../utils/imageUtils';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 48) / 2; // Account for padding and gap

interface ImageSelectorScreenProps {
  navigation: any;
}

const ImageSelectorScreen: React.FC<ImageSelectorScreenProps> = ({ navigation }) => {
  const {
    beforeImage,
    afterImage,
    setBeforeImage,
    setAfterImage,
    isLoading,
    setLoading,
  } = useEditorStore();

  const [activeUpload, setActiveUpload] = useState<'before' | 'after' | null>(null);

  const showImagePicker = (type: 'before' | 'after') => {
    setActiveUpload(type);
    
    Alert.alert(
      'Select Image',
      'Choose how you want to add your image',
      [
        {
          text: 'Take Photo',
          onPress: () => handleTakePhoto(type),
        },
        {
          text: 'Choose from Library',
          onPress: () => handlePickFromLibrary(type),
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setActiveUpload(null),
        },
      ]
    );
  };

  const handleTakePhoto = async (type: 'before' | 'after') => {
    try {
      setLoading(true);
      const result = await pickImageFromCamera({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (type === 'before') {
        setBeforeImage(result.uri);
      } else {
        setAfterImage(result.uri);
      }
    } catch (error) {
      if (error instanceof ImageValidationError) {
        Alert.alert('Image Error', error.message);
      } else {
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      }
    } finally {
      setLoading(false);
      setActiveUpload(null);
    }
  };

  const handlePickFromLibrary = async (type: 'before' | 'after') => {
    try {
      setLoading(true);
      const result = await pickImageFromLibrary({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (type === 'before') {
        setBeforeImage(result.uri);
      } else {
        setAfterImage(result.uri);
      }
    } catch (error) {
      if (error instanceof ImageValidationError) {
        Alert.alert('Image Error', error.message);
      } else {
        Alert.alert('Error', 'Failed to select image. Please try again.');
      }
    } finally {
      setLoading(false);
      setActiveUpload(null);
    }
  };

  const removeImage = (type: 'before' | 'after') => {
    if (type === 'before') {
      setBeforeImage('');
    } else {
      setAfterImage('');
    }
  };

  const canContinue = beforeImage && afterImage;

  const handleContinue = () => {
    if (canContinue) {
      navigation.navigate('Editor');
    }
  };

  const renderUploadCard = (type: 'before' | 'after') => {
    const image = type === 'before' ? beforeImage : afterImage;
    const isActive = activeUpload === type;
    
    return (
      <TouchableOpacity
        style={[
          styles.uploadCard,
          isActive && styles.uploadCardActive,
        ]}
        onPress={() => showImagePicker(type)}
        disabled={isLoading}
      >
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.uploadedImage} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(type)}
            >
              <Ionicons name="close-circle" size={24} color="#FF4444" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            {isLoading && isActive ? (
              <ActivityIndicator size="large" color="#4A90E2" />
            ) : (
              <>
                <Ionicons 
                  name="camera-outline" 
                  size={48} 
                  color="#9B9B9B" 
                />
                <Text style={styles.placeholderText}>
                  Tap to add {type} photo
                </Text>
              </>
            )}
          </View>
        )}
        
        <View style={styles.cardLabel}>
          <Text style={styles.cardLabelText}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Instructions Card */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>
            Create a transformation to showcase your pet care work
          </Text>
          <Text style={styles.instructionsSubtitle}>
            Upload before and after photos
          </Text>
        </View>

        {/* Upload Zone */}
        <View style={styles.uploadZone}>
          <View style={styles.uploadRow}>
            {renderUploadCard('before')}
            {renderUploadCard('after')}
          </View>
        </View>

        {/* Image Requirements */}
        <View style={styles.requirementsCard}>
          <View style={styles.requirementRow}>
            <Ionicons name="checkmark-circle" size={20} color="#7ED321" />
            <Text style={styles.requirementText}>
              Best quality: Square images, minimum 800x800px
            </Text>
          </View>
          <View style={styles.requirementRow}>
            <Ionicons name="checkmark-circle" size={20} color="#7ED321" />
            <Text style={styles.requirementText}>
              Supported formats: JPEG, PNG, WebP
            </Text>
          </View>
          <View style={styles.requirementRow}>
            <Ionicons name="checkmark-circle" size={20} color="#7ED321" />
            <Text style={styles.requirementText}>
              Maximum file size: 10MB
            </Text>
          </View>
        </View>

        {/* Preview Thumbnails */}
        {canContinue && (
          <View style={styles.previewSection}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewRow}>
              <View style={styles.previewThumbnail}>
                <Image source={{ uri: beforeImage! }} style={styles.thumbnailImage} />
                <Text style={styles.thumbnailLabel}>Before</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="#4A90E2" />
              <View style={styles.previewThumbnail}>
                <Image source={{ uri: afterImage! }} style={styles.thumbnailImage} />
                <Text style={styles.thumbnailLabel}>After</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            canContinue && styles.continueButtonEnabled,
          ]}
          onPress={handleContinue}
          disabled={!canContinue || isLoading}
        >
          <Text style={[
            styles.continueButtonText,
            canContinue && styles.continueButtonTextEnabled,
          ]}>
            Continue
          </Text>
          {canContinue && (
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionsSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  uploadZone: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  uploadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  uploadCard: {
    width: cardWidth,
    height: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  uploadCardActive: {
    borderColor: '#4A90E2',
    borderStyle: 'solid',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  placeholderText: {
    fontSize: 12,
    color: '#9B9B9B',
    textAlign: 'center',
    marginTop: 8,
  },
  cardLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 8,
  },
  cardLabelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  requirementsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    flex: 1,
  },
  previewSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  previewThumbnail: {
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  thumbnailLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  bottomSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  continueButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  continueButtonEnabled: {
    backgroundColor: '#4A90E2',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9B9B9B',
  },
  continueButtonTextEnabled: {
    color: '#FFFFFF',
  },
});

export default ImageSelectorScreen;