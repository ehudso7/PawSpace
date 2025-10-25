import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import {
  TransitionType,
  VideoGenerationOptions,
  ExportFormat,
} from '../types/transformation';
import { VideoGenerationProgress } from '../components/VideoGenerationProgress';
import { useVideoGeneration } from '../hooks/useVideoGeneration';
import TransformationsService from '../services/transformations';
import GIFGeneratorService from '../services/gifGenerator';
import SharingService from '../services/sharing';
import CloudinaryService from '../services/cloudinary';

interface PreviewScreenProps {
  beforeImageUri: string;
  afterImageUri: string;
  onBack: () => void;
  onSave?: (transformationData: any) => void;
}

const { width, height } = Dimensions.get('window');

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  beforeImageUri,
  afterImageUri,
  onBack,
  onSave,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('video');
  const [selectedTransition, setSelectedTransition] = useState<TransitionType>('crossfade');
  const [duration, setDuration] = useState(3);
  const [hasMusic, setHasMusic] = useState(false);
  const [quality, setQuality] = useState<'auto' | 'low' | 'medium' | 'high'>('auto');
  const [showOptions, setShowOptions] = useState(false);
  const [caption, setCaption] = useState('');

  // Initialize services (in real app, these would come from context/providers)
  const cloudinaryService = new CloudinaryService({
    cloud_name: 'your-cloud-name',
    api_key: 'your-api-key',
    api_secret: 'your-api-secret',
    upload_preset: 'your-upload-preset',
  });
  
  const transformationsService = new TransformationsService(
    'https://your-api-url.com/api',
    cloudinaryService
  );
  
  const gifGeneratorService = new GIFGeneratorService();
  const sharingService = new SharingService();

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

  const handlePreview = async () => {
    const options: VideoGenerationOptions = {
      transition_type: selectedTransition,
      duration_seconds: duration,
      has_music: hasMusic,
      format: selectedFormat,
      quality,
    };

    if (selectedFormat === 'video') {
      await generateVideo(beforeImageUri, afterImageUri, options);
    } else {
      await generateGIF(beforeImageUri, afterImageUri, options);
    }
  };

  const handleShare = async () => {
    if (!result?.success || (!result.url && !result.local_path)) {
      Alert.alert('Error', 'No media to share. Please generate the transformation first.');
      return;
    }

    const mediaUri = result.url || result.local_path!;
    
    await sharingService.showShareOptions(
      mediaUri,
      caption || 'Check out my transformation!',
      (platform) => {
        console.log(`Shared to ${platform || 'general'}`);
      }
    );
  };

  const handleSave = async () => {
    if (!result?.success) {
      Alert.alert('Error', 'Please generate the transformation first.');
      return;
    }

    try {
      const transformationData = {
        before_image_url: beforeImageUri,
        after_image_url: afterImageUri,
        video_url: selectedFormat === 'video' ? result.url : undefined,
        gif_url: selectedFormat === 'gif' ? result.url : undefined,
        caption: caption || 'My transformation',
        transition_type: selectedTransition,
        has_music: hasMusic,
        is_public: true,
        duration_seconds: duration,
      };

      if (onSave) {
        onSave(transformationData);
      } else {
        // Save to backend
        await transformationsService.createTransformation(transformationData);
        Alert.alert('Success', 'Transformation saved successfully!');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save transformation. Please try again.');
    }
  };

  const renderPreviewImages = () => (
    <View style={styles.previewContainer}>
      <View style={styles.imageRow}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: beforeImageUri }} style={styles.previewImage} />
          <Text style={styles.imageLabel}>Before</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image source={{ uri: afterImageUri }} style={styles.previewImage} />
          <Text style={styles.imageLabel}>After</Text>
        </View>
      </View>
    </View>
  );

  const renderGeneratedMedia = () => {
    if (!result?.success) return null;

    const mediaUri = result.url || result.local_path;
    if (!mediaUri) return null;

    return (
      <View style={styles.generatedMediaContainer}>
        {selectedFormat === 'video' ? (
          <Video
            source={{ uri: mediaUri }}
            style={styles.generatedVideo}
            useNativeControls
            resizeMode="contain"
            isLooping
            shouldPlay
          />
        ) : (
          <Image source={{ uri: mediaUri }} style={styles.generatedGif} />
        )}
      </View>
    );
  };

  const renderFormatSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Export Format</Text>
      <View style={styles.formatButtons}>
        <TouchableOpacity
          style={[
            styles.formatButton,
            selectedFormat === 'video' && styles.formatButtonActive,
          ]}
          onPress={() => setSelectedFormat('video')}
        >
          <Text style={[
            styles.formatButtonText,
            selectedFormat === 'video' && styles.formatButtonTextActive,
          ]}>
            🎬 Video
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.formatButton,
            selectedFormat === 'gif' && styles.formatButtonActive,
          ]}
          onPress={() => setSelectedFormat('gif')}
        >
          <Text style={[
            styles.formatButtonText,
            selectedFormat === 'gif' && styles.formatButtonTextActive,
          ]}>
            🎞️ GIF
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTransitionSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Transition Effect</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.transitionButtons}>
          {(['crossfade', 'slide', 'zoom', 'morph', 'wipe'] as TransitionType[]).map((transition) => (
            <TouchableOpacity
              key={transition}
              style={[
                styles.transitionButton,
                selectedTransition === transition && styles.transitionButtonActive,
              ]}
              onPress={() => setSelectedTransition(transition)}
            >
              <Text style={[
                styles.transitionButtonText,
                selectedTransition === transition && styles.transitionButtonTextActive,
              ]}>
                {transition.charAt(0).toUpperCase() + transition.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderDurationSelector = () => (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorTitle}>Duration: {duration}s</Text>
      <View style={styles.durationButtons}>
        {[1, 2, 3, 5, 8].map((dur) => (
          <TouchableOpacity
            key={dur}
            style={[
              styles.durationButton,
              duration === dur && styles.durationButtonActive,
            ]}
            onPress={() => setDuration(dur)}
          >
            <Text style={[
              styles.durationButtonText,
              duration === dur && styles.durationButtonTextActive,
            ]}>
              {dur}s
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      {!isGenerating && !result?.success && (
        <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
          <Text style={styles.previewButtonText}>
            🎬 Create {selectedFormat.toUpperCase()}
          </Text>
        </TouchableOpacity>
      )}

      {result?.success && (
        <View style={styles.resultActions}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>📤 Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>💾 Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.retryButton} onPress={reset}>
            <Text style={styles.retryButtonText}>🔄 Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Preview Transformation</Text>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => setShowOptions(true)}
        >
          <Text style={styles.optionsButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Preview Images */}
        {renderPreviewImages()}

        {/* Generated Media */}
        {renderGeneratedMedia()}

        {/* Progress Indicator */}
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
            <TouchableOpacity style={styles.retryButton} onPress={reset}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Controls */}
        {!isGenerating && (
          <>
            {renderFormatSelector()}
            {renderTransitionSelector()}
            {renderDurationSelector()}
          </>
        )}

        {/* Action Buttons */}
        {renderActionButtons()}
      </ScrollView>

      {/* Options Modal */}
      <Modal
        visible={showOptions}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Advanced Options</Text>
            <TouchableOpacity onPress={() => setShowOptions(false)}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* Quality Selector */}
            <View style={styles.optionSection}>
              <Text style={styles.optionTitle}>Quality</Text>
              <View style={styles.qualityButtons}>
                {(['auto', 'low', 'medium', 'high'] as const).map((qual) => (
                  <TouchableOpacity
                    key={qual}
                    style={[
                      styles.qualityButton,
                      quality === qual && styles.qualityButtonActive,
                    ]}
                    onPress={() => setQuality(qual)}
                  >
                    <Text style={[
                      styles.qualityButtonText,
                      quality === qual && styles.qualityButtonTextActive,
                    ]}>
                      {qual.charAt(0).toUpperCase() + qual.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Music Toggle */}
            <View style={styles.optionSection}>
              <View style={styles.toggleRow}>
                <Text style={styles.optionTitle}>Add Background Music</Text>
                <TouchableOpacity
                  style={[styles.toggle, hasMusic && styles.toggleActive]}
                  onPress={() => setHasMusic(!hasMusic)}
                >
                  <Text style={styles.toggleText}>{hasMusic ? 'ON' : 'OFF'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  optionsButton: {
    padding: 8,
  },
  optionsButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  previewContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1,
  },
  previewImage: {
    width: (width - 80) / 2,
    height: (width - 80) / 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  arrowContainer: {
    paddingHorizontal: 16,
  },
  arrow: {
    fontSize: 24,
    color: '#3498db',
  },
  generatedMediaContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  generatedVideo: {
    width: width - 64,
    height: (width - 64) * 0.75,
    borderRadius: 8,
  },
  generatedGif: {
    width: width - 64,
    height: width - 64,
    borderRadius: 8,
  },
  selectorContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  formatButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  formatButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  formatButtonActive: {
    backgroundColor: '#3498db',
  },
  formatButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  formatButtonTextActive: {
    color: 'white',
  },
  transitionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  transitionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  transitionButtonActive: {
    backgroundColor: '#3498db',
  },
  transitionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  transitionButtonTextActive: {
    color: 'white',
  },
  durationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  durationButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    minWidth: 50,
    alignItems: 'center',
  },
  durationButtonActive: {
    backgroundColor: '#3498db',
  },
  durationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  durationButtonTextActive: {
    color: 'white',
  },
  actionButtons: {
    padding: 16,
  },
  previewButton: {
    backgroundColor: '#3498db',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#f39c12',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fdf2f2',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    alignItems: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  optionSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  qualityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  qualityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  qualityButtonActive: {
    backgroundColor: '#3498db',
  },
  qualityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  qualityButtonTextActive: {
    color: 'white',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    minWidth: 50,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: '#27ae60',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});