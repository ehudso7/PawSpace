/**
 * Preview Screen
 * Shows transformation preview with video/GIF generation and sharing options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { videoGenerationService } from '../services/videoGeneration';
import { sharingService } from '../services/sharing';
import { transformationsService } from '../services/transformations';
import type {
  VideoGenerationProgress,
  TransitionType,
  CreateTransformationData,
} from '../types/transformation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PreviewScreenProps {
  beforeImageUri: string;
  afterImageUri: string;
  caption: string;
  transitionType: TransitionType;
  serviceId?: string;
  isPublic: boolean;
  hasMusic: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  beforeImageUri,
  afterImageUri,
  caption,
  transitionType,
  serviceId,
  isPublic,
  hasMusic,
  onComplete,
  onCancel,
}) => {
  const [generationProgress, setGenerationProgress] = useState<VideoGenerationProgress>({
    status: 'uploading',
    progress: 0,
    message: 'Preparing your transformation...',
  });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [transformationId, setTransformationId] = useState<string | null>(null);

  useEffect(() => {
    generateTransformation();
  }, []);

  const generateTransformation = async () => {
    try {
      setError(null);
      
      const result = await videoGenerationService.generateTransformation(
        beforeImageUri,
        afterImageUri,
        {
          transitionType,
          duration: 3,
          hasMusic,
          mode: 'auto',
        },
        (progress) => {
          setGenerationProgress(progress);
        }
      );

      if (result.videoUrl) {
        setVideoUrl(result.videoUrl);
      } else if (result.gifUrl) {
        setGifUrl(result.gifUrl);
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate transformation');
      setGenerationProgress({
        status: 'failed',
        progress: 0,
        message: 'Generation failed',
      });
    }
  };

  const handleSaveToFeed = async () => {
    if (!videoUrl && !gifUrl) {
      Alert.alert('Error', 'No media to save');
      return;
    }

    try {
      setIsSaving(true);

      const transformationData: CreateTransformationData = {
        before_image_url: beforeImageUri,
        after_image_url: afterImageUri,
        video_url: videoUrl || undefined,
        gif_url: gifUrl || undefined,
        caption,
        service_id: serviceId,
        is_public: isPublic,
        transition_type: transitionType,
        has_music: hasMusic,
      };

      const transformation = await transformationsService.createTransformation(
        transformationData
      );

      setTransformationId(transformation.id);

      Alert.alert(
        'Success!',
        'Your transformation has been posted to your profile',
        [
          { text: 'OK', onPress: onComplete },
        ]
      );
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Failed to save transformation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    if (!videoUrl && !gifUrl) {
      Alert.alert('Error', 'No media to share');
      return;
    }

    try {
      await sharingService.shareToDevice({
        videoUri: videoUrl || undefined,
        gifUri: gifUrl || undefined,
        caption,
        transformationId: transformationId || undefined,
      });
    } catch (err) {
      console.error('Share error:', err);
      Alert.alert('Error', 'Failed to share');
    }
  };

  const handleSaveToDevice = async () => {
    if (!videoUrl && !gifUrl) {
      Alert.alert('Error', 'No media to save');
      return;
    }

    try {
      await sharingService.saveToDevice(videoUrl || gifUrl!);
    } catch (err) {
      console.error('Save to device error:', err);
      Alert.alert(
        'Permission Required',
        'Please grant access to save to your gallery',
        [{ text: 'OK' }]
      );
    }
  };

  const handleShareToInstagram = async () => {
    if (!videoUrl && !gifUrl) {
      Alert.alert('Error', 'No media to share');
      return;
    }

    try {
      await sharingService.shareToInstagram({
        videoUri: videoUrl || undefined,
        gifUri: gifUrl || undefined,
        caption,
        transformationId: transformationId || undefined,
      });
    } catch (err) {
      console.error('Instagram share error:', err);
      Alert.alert('Error', 'Failed to share to Instagram');
    }
  };

  const handleRetry = () => {
    setError(null);
    setVideoUrl(null);
    setGifUrl(null);
    generateTransformation();
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.loadingGradient}
      >
        <View style={styles.loadingContent}>
          {/* Progress Circle */}
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>
              {Math.round(generationProgress.progress)}%
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${generationProgress.progress}%` },
              ]}
            />
          </View>

          {/* Status Message */}
          <Text style={styles.statusMessage}>{generationProgress.message}</Text>

          {generationProgress.estimated_time_remaining && (
            <Text style={styles.timeRemaining}>
              ~{generationProgress.estimated_time_remaining}s remaining
            </Text>
          )}

          {/* Loading Animation */}
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={styles.spinner}
          />

          {/* Preview Images */}
          <View style={styles.previewImages}>
            <Image source={{ uri: beforeImageUri }} style={styles.previewImage} />
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>→</Text>
            </View>
            <Image source={{ uri: afterImageUri }} style={styles.previewImage} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Generation Failed</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPreview = () => (
    <ScrollView style={styles.previewContainer}>
      {/* Video/GIF Preview */}
      <View style={styles.mediaContainer}>
        {videoUrl ? (
          <Video
            source={{ uri: videoUrl }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
            shouldPlay
          />
        ) : gifUrl ? (
          <Image
            source={{ uri: gifUrl }}
            style={styles.gif}
            contentFit="contain"
          />
        ) : null}
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>{caption}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.primaryButton, isSaving && styles.buttonDisabled]}
          onPress={handleSaveToFeed}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isPublic ? 'Post to Feed' : 'Save to Profile'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.shareButtonsRow}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonIcon}>↗️</Text>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareToInstagram}
          >
            <Text style={styles.shareButtonIcon}>📸</Text>
            <Text style={styles.shareButtonText}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleSaveToDevice}>
            <Text style={styles.shareButtonIcon}>💾</Text>
            <Text style={styles.shareButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Main render logic
  if (error) {
    return renderErrorState();
  }

  if (generationProgress.status === 'completed' && (videoUrl || gifUrl)) {
    return renderPreview();
  }

  return renderLoadingState();
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressBarContainer: {
    width: SCREEN_WIDTH - 80,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  statusMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  timeRemaining: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
  },
  spinner: {
    marginBottom: 40,
  },
  previewImages: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 15,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  gif: {
    width: '100%',
    height: '100%',
  },
  captionContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  caption: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actionsContainer: {
    padding: 20,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  shareButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  shareButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});
