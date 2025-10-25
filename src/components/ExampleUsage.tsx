import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

import { useServices } from '../services';
import { useVideoGeneration } from '../hooks/useVideoGeneration';
import { VideoGenerationProgress } from './VideoGenerationProgress';
import { VideoGenerationOptions } from '../types/transformation';
import { NotificationUtils } from '../utils/notifications';
import { ValidationUtils } from '../utils/validation';

/**
 * Example component demonstrating the complete video generation and sharing flow
 */
export const ExampleUsage: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);

  const { transformationsService, gifGeneratorService, sharingService } = useServices();
  
  const {
    isGenerating,
    progress,
    result,
    error,
    generateVideo,
    generateGIF,
    reset,
    cancel,
  } = useVideoGeneration(transformationsService, gifGeneratorService);

  /**
   * Pick image from device library
   */
  const pickImage = async (type: 'before' | 'after') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        // Validate the selected image
        ValidationUtils.validateImageUri(imageUri);
        
        if (type === 'before') {
          setBeforeImage(imageUri);
        } else {
          setAfterImage(imageUri);
        }
        
        NotificationUtils.showSuccess(`${type} image selected!`);
      }
    } catch (error) {
      NotificationUtils.showError('Failed to select image');
    }
  };

  /**
   * Generate video transformation
   */
  const handleGenerateVideo = async () => {
    if (!beforeImage || !afterImage) {
      NotificationUtils.showError('Please select both before and after images');
      return;
    }

    try {
      // Validate images
      ValidationUtils.validateTransformationData({
        before_image_url: beforeImage,
        after_image_url: afterImage,
        transition_type: 'crossfade',
        duration_seconds: 3,
      });

      const options: VideoGenerationOptions = {
        transition_type: 'crossfade',
        duration_seconds: 3,
        has_music: false,
        format: 'video',
        quality: 'auto',
      };

      await generateVideo(beforeImage, afterImage, options);
      
      if (result?.success) {
        NotificationUtils.showGenerationComplete('video');
      }
    } catch (error) {
      NotificationUtils.showError('Failed to generate video');
    }
  };

  /**
   * Generate GIF transformation (fallback)
   */
  const handleGenerateGIF = async () => {
    if (!beforeImage || !afterImage) {
      NotificationUtils.showError('Please select both before and after images');
      return;
    }

    try {
      const options: VideoGenerationOptions = {
        transition_type: 'crossfade',
        duration_seconds: 2,
        has_music: false,
        format: 'gif',
        quality: 'medium',
      };

      await generateGIF(beforeImage, afterImage, options);
      
      if (result?.success) {
        NotificationUtils.showGenerationComplete('gif');
      }
    } catch (error) {
      NotificationUtils.showError('Failed to generate GIF');
    }
  };

  /**
   * Share the generated media
   */
  const handleShare = async () => {
    if (!result?.success || (!result.url && !result.local_path)) {
      NotificationUtils.showError('No media to share');
      return;
    }

    const mediaUri = result.url || result.local_path!;
    
    await sharingService.showShareOptions(
      mediaUri,
      'Check out my amazing transformation! 🎬',
      (platform) => {
        if (platform) {
          NotificationUtils.showShareSuccess(platform);
        } else {
          NotificationUtils.showShareSuccess();
        }
      }
    );
  };

  /**
   * Save to device
   */
  const handleSaveToDevice = async () => {
    if (!result?.success || (!result.url && !result.local_path)) {
      NotificationUtils.showError('No media to save');
      return;
    }

    const mediaUri = result.url || result.local_path!;
    
    try {
      const saveResult = await sharingService.saveToDevice(mediaUri);
      
      if (saveResult.success) {
        NotificationUtils.showSaveSuccess(result.format);
      } else {
        NotificationUtils.showError(saveResult.error || 'Failed to save');
      }
    } catch (error) {
      NotificationUtils.showError('Failed to save to device');
    }
  };

  /**
   * Reset the generation state
   */
  const handleReset = () => {
    reset();
    setBeforeImage(null);
    setAfterImage(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Transformation Demo</Text>

      {/* Image Selection */}
      <View style={styles.imageSection}>
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage('before')}
          >
            {beforeImage ? (
              <Image source={{ uri: beforeImage }} style={styles.selectedImage} />
            ) : (
              <Text style={styles.imagePickerText}>Select Before Image</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.imageLabel}>Before</Text>
        </View>

        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>

        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.imagePicker}
            onPress={() => pickImage('after')}
          >
            {afterImage ? (
              <Image source={{ uri: afterImage }} style={styles.selectedImage} />
            ) : (
              <Text style={styles.imagePickerText}>Select After Image</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.imageLabel}>After</Text>
        </View>
      </View>

      {/* Generation Progress */}
      {isGenerating && progress && (
        <VideoGenerationProgress
          progress={progress}
          onCancel={cancel}
          showCancel={true}
        />
      )}

      {/* Error Display */}
      {error && !isGenerating && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}

      {/* Generated Media */}
      {result?.success && (result.url || result.local_path) && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>
            {result.format.toUpperCase()} Generated Successfully! 🎉
          </Text>
          
          {result.format === 'video' ? (
            <Video
              source={{ uri: result.url || result.local_path! }}
              style={styles.generatedVideo}
              useNativeControls
              resizeMode="contain"
              isLooping
              shouldPlay
            />
          ) : (
            <Image
              source={{ uri: result.url || result.local_path! }}
              style={styles.generatedGif}
            />
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {!isGenerating && !result?.success && beforeImage && afterImage && (
          <>
            <TouchableOpacity style={styles.videoButton} onPress={handleGenerateVideo}>
              <Text style={styles.buttonText}>🎬 Generate Video</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.gifButton} onPress={handleGenerateGIF}>
              <Text style={styles.buttonText}>🎞️ Generate GIF</Text>
            </TouchableOpacity>
          </>
        )}

        {result?.success && (
          <>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.buttonText}>📤 Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveToDevice}>
              <Text style={styles.buttonText}>💾 Save to Device</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.buttonText}>🔄 Start Over</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },
  imageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePickerText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginTop: 8,
  },
  arrowContainer: {
    paddingHorizontal: 16,
  },
  arrow: {
    fontSize: 24,
    color: '#3498db',
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginBottom: 16,
    textAlign: 'center',
  },
  generatedVideo: {
    width: 280,
    height: 210,
    borderRadius: 8,
  },
  generatedGif: {
    width: 280,
    height: 280,
    borderRadius: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  videoButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  gifButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});