/**
 * PreviewScreen Component
 * Full-screen video preview with publishing and sharing options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlayer } from '../../components/video/VideoPlayer';
import { PublishBottomSheet } from '../../components/video/PublishBottomSheet';
import { useVideoExport } from '../../hooks/useVideoExport';
import { useSocialSharing } from '../../hooks/useSocialSharing';
import { PublishOptions } from '../../types/video.types';

interface PreviewScreenProps {
  navigation: any; // React Navigation prop
  route: {
    params: {
      videoUrl?: string;
      beforeImageUrl: string;
      afterImageUrl: string;
      provider?: {
        name: string;
        link: string;
      };
    };
  };
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  navigation,
  route,
}) => {
  const { videoUrl: initialVideoUrl, beforeImageUrl, afterImageUrl, provider } = route.params;

  const [videoUrl, setVideoUrl] = useState<string | null>(initialVideoUrl || null);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(!!initialVideoUrl);

  const {
    isGenerating,
    isExporting,
    progress,
    error,
    generateVideo,
    saveToDevice,
    clearError,
  } = useVideoExport();

  const {
    isSharing,
    shareToInstagram,
    shareToTikTok,
    shareGeneric,
    sharePreview,
  } = useSocialSharing();

  useEffect(() => {
    // If no video URL provided, generate one
    if (!initialVideoUrl && beforeImageUrl && afterImageUrl) {
      handleGenerateVideo();
    }
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError },
      ]);
    }
  }, [error]);

  const handleGenerateVideo = async () => {
    try {
      const url = await generateVideo({
        beforeImageUrl,
        afterImageUrl,
        transition: 'fade',
        duration: 6, // 6 seconds
        textOverlays: [
          {
            text: 'Before',
            position: 'top',
            fontSize: 40,
            color: 'white',
            timestamp: 0,
            duration: 2.5,
          },
          {
            text: 'After',
            position: 'top',
            fontSize: 40,
            color: 'white',
            timestamp: 3.5,
            duration: 2.5,
          },
        ],
        fps: 30,
      });

      setVideoUrl(url);
      setIsVideoReady(true);
    } catch (error) {
      console.error('Failed to generate video:', error);
    }
  };

  const handleBack = () => {
    Alert.alert(
      'Discard changes?',
      'Are you sure you want to go back? Your video will not be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleSharePreview = async () => {
    if (!videoUrl) return;
    
    try {
      await sharePreview(videoUrl);
    } catch (error) {
      console.error('Share preview error:', error);
    }
  };

  const handleSaveToDevice = async () => {
    if (!videoUrl) return;

    try {
      await saveToDevice(videoUrl);
    } catch (error) {
      console.error('Save to device error:', error);
    }
  };

  const handlePublishToPawSpace = (options: PublishOptions) => {
    setShowBottomSheet(false);
    
    // TODO: Implement actual API call to publish to PawSpace
    Alert.alert(
      'Published!',
      'Your transformation has been posted to PawSpace',
      [
        {
          text: 'View Post',
          onPress: () => {
            // Navigate to post
            navigation.navigate('Feed');
          },
        },
        { text: 'OK' },
      ]
    );
  };

  const handleShareToSocial = () => {
    if (!videoUrl) return;

    Alert.alert(
      'Share to',
      'Choose where to share your video',
      [
        {
          text: 'Instagram',
          onPress: async () => {
            try {
              await shareToInstagram(videoUrl, {
                caption: 'Check out this amazing pet transformation! 🐾',
                hashtags: ['#petgrooming', '#beforeandafter'],
                isPrivate: false,
              });
            } catch (error) {
              console.error('Instagram share error:', error);
            }
          },
        },
        {
          text: 'TikTok',
          onPress: async () => {
            try {
              await shareToTikTok(videoUrl, {
                caption: 'Pet transformation ✨',
                hashtags: ['#petgrooming', '#dogsoftiktok'],
                isPrivate: false,
              });
            } catch (error) {
              console.error('TikTok share error:', error);
            }
          },
        },
        {
          text: 'Other',
          onPress: async () => {
            try {
              await shareGeneric(videoUrl, {
                caption: 'Check out this pet transformation!',
                hashtags: ['#petgrooming'],
                isPrivate: false,
              });
            } catch (error) {
              console.error('Generic share error:', error);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const isLoading = isGenerating || isExporting || isSharing;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Video Player */}
      {isVideoReady && videoUrl ? (
        <VideoPlayer
          videoUrl={videoUrl}
          autoPlay={true}
          showControls={true}
          onError={(error) => Alert.alert('Video Error', error)}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>
            {isGenerating ? 'Generating video...' : 'Loading...'}
          </Text>
          {isGenerating && (
            <Text style={styles.progressText}>{progress}%</Text>
          )}
        </View>
      )}

      {/* Top Bar */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleSharePreview}
          disabled={!isVideoReady || isLoading}
        >
          <Ionicons name="share-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Action Buttons */}
      {isVideoReady && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleSaveToDevice}
            disabled={isLoading}
          >
            {isExporting ? (
              <ActivityIndicator color="#4CAF50" />
            ) : (
              <>
                <Ionicons name="download-outline" size={24} color="#4CAF50" />
                <Text style={styles.secondaryButtonText}>Save to Device</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => setShowBottomSheet(true)}
            disabled={isLoading}
          >
            <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
            <Text style={styles.primaryButtonText}>Post to PawSpace</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleShareToSocial}
            disabled={isLoading}
          >
            {isSharing ? (
              <ActivityIndicator color="#4CAF50" />
            ) : (
              <>
                <Ionicons name="logo-instagram" size={24} color="#4CAF50" />
                <Text style={styles.secondaryButtonText}>Share to Social</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Sheet */}
      <PublishBottomSheet
        isVisible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        onPublish={handlePublishToPawSpace}
        provider={provider}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
  progressText: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: 'linear-gradient(rgba(0, 0, 0, 0.5), transparent)',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    gap: 12,
    backgroundColor: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '700',
  },
});
