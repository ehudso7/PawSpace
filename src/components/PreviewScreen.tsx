import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
  Video,
} from 'react-native';
import { VideoGenerationProgress, TransitionType } from '@/types/transformation';
import { LoadingScreen } from './LoadingScreen';
import { SharingService } from '@/services/sharing';

interface PreviewScreenProps {
  beforeImageUri: string;
  afterImageUri: string;
  transitionType: TransitionType;
  onBack: () => void;
  onRetry: () => void;
}

const { width, height } = Dimensions.get('window');

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  beforeImageUri,
  afterImageUri,
  transitionType,
  onBack,
  onRetry,
}) => {
  const [progress, setProgress] = useState<VideoGenerationProgress | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    videoUrl?: string;
    gifUrl?: string;
  } | null>(null);

  useEffect(() => {
    generateTransformation();
  }, []);

  const generateTransformation = async () => {
    try {
      setIsGenerating(true);
      setProgress({
        status: 'uploading',
        progress: 0,
        message: 'Starting generation...',
      });

      // Simulate video generation process
      await simulateVideoGeneration();
    } catch (error) {
      console.error('Generation error:', error);
      setProgress({
        status: 'failed',
        progress: 0,
        message: 'Failed to generate transformation',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const simulateVideoGeneration = async () => {
    // Simulate upload progress
    for (let i = 0; i <= 50; i += 10) {
      setProgress({
        status: 'uploading',
        progress: i,
        message: 'Uploading images...',
      });
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Simulate processing
    for (let i = 50; i <= 100; i += 10) {
      setProgress({
        status: 'processing',
        progress: i,
        message: 'Generating transformation...',
      });
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Simulate completion
    setProgress({
      status: 'completed',
      progress: 100,
      message: 'Transformation ready!',
      videoUrl: 'https://example.com/video.mp4', // Placeholder
    });

    setResult({
      videoUrl: 'https://example.com/video.mp4',
      gifUrl: 'https://example.com/gif.gif',
    });
  };

  const handleShare = async (type: 'video' | 'gif') => {
    const url = type === 'video' ? result?.videoUrl : result?.gifUrl;
    if (!url) return;

    try {
      await SharingService.shareTransformation(
        url,
        'Check out my transformation!',
        type === 'video' ? 'video/mp4' : 'image/gif'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to share transformation');
    }
  };

  const handleSaveToDevice = async () => {
    const url = result?.videoUrl || result?.gifUrl;
    if (!url) return;

    try {
      await SharingService.saveToDevice(url, 'My Transformation');
    } catch (error) {
      Alert.alert('Error', 'Failed to save to device');
    }
  };

  const showSharingOptions = () => {
    Alert.alert(
      'Share Transformation',
      'Choose how you want to share your transformation',
      [
        { text: 'Save to Gallery', onPress: handleSaveToDevice },
        { text: 'Share Video', onPress: () => handleShare('video') },
        { text: 'Share GIF', onPress: () => handleShare('gif') },
        { text: 'Share to Instagram', onPress: () => SharingService.shareToInstagram(result?.videoUrl || '') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (isGenerating && progress) {
    return (
      <LoadingScreen
        progress={progress}
        onCancel={() => {
          setIsGenerating(false);
          onBack();
        }}
      />
    );
  }

  if (progress?.status === 'failed') {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorTitle}>Generation Failed</Text>
          <Text style={styles.errorMessage}>
            Something went wrong while creating your transformation.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Preview</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.previewContainer}>
        {result?.videoUrl ? (
          <Video
            source={{ uri: result.videoUrl }}
            style={styles.media}
            resizeMode="cover"
            shouldPlay
            isLooping
          />
        ) : (
          <Image
            source={{ uri: afterImageUri }}
            style={styles.media}
            resizeMode="cover"
          />
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.shareButton} onPress={showSharingOptions}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveToDevice}>
          <Text style={styles.saveButtonText}>Save to Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  media: {
    width: width - 40,
    height: width - 40,
    borderRadius: 12,
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  shareButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});