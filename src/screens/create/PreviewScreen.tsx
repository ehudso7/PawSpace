import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { PublishingBottomSheet } from '../../components/PublishingBottomSheet';
import { VideoPlayerControls } from '../../components/VideoPlayerControls';
import { videoExportService } from '../../services/videoExport';
import { socialSharingService } from '../../services/socialSharing';
import { VideoPlayerState, PublishingOptions, Platform } from '../../types';

type PreviewScreenProps = {
  navigation: StackNavigationProp<any>;
  route: RouteProp<{
    params: {
      videoUrl: string;
      videoPublicId: string;
      beforeImageUrl: string;
      afterImageUrl: string;
    };
  }>;
};

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  navigation,
  route
}) => {
  const { videoUrl, videoPublicId, beforeImageUrl, afterImageUrl } = route.params;
  
  const videoRef = useRef<Video>(null);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    isMuted: false,
    isLooping: true,
    currentTime: 0,
    duration: 0,
    isLoading: true
  });
  
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    // Auto-play video when screen loads
    if (videoRef.current) {
      videoRef.current.playAsync();
    }
  }, []);

  const handlePlayPause = async () => {
    if (!videoRef.current) return;

    if (playerState.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleMuteToggle = async () => {
    if (!videoRef.current) return;

    await videoRef.current.setIsMutedAsync(!playerState.isMuted);
    setPlayerState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleLoopToggle = async () => {
    if (!videoRef.current) return;

    await videoRef.current.setIsLoopingAsync(!playerState.isLooping);
    setPlayerState(prev => ({ ...prev, isLooping: !prev.isLooping }));
  };

  const handleVideoStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlayerState(prev => ({
        ...prev,
        isPlaying: status.isPlaying,
        currentTime: status.positionMillis / 1000,
        duration: status.durationMillis / 1000,
        isLoading: false
      }));
    }
  };

  const handleSaveToDevice = async () => {
    try {
      setIsExporting(true);
      
      const savedUri = await videoExportService.saveToDevice(
        videoUrl,
        `pawspace_transformation_${Date.now()}.mp4`
      );
      
      Alert.alert(
        'Success!',
        'Video saved to your photo library',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save video to device. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareToSocial = async () => {
    try {
      setIsSharing(true);
      
      // Open bottom sheet for publishing options
      setShowBottomSheet(true);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to prepare video for sharing. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handlePublish = async (options: PublishingOptions) => {
    try {
      setIsSharing(true);
      setShowBottomSheet(false);

      const results = await socialSharingService.shareToMultiplePlatforms(
        videoUrl,
        options
      );

      const successCount = Object.values(results).filter(Boolean).length;
      const totalCount = Object.keys(results).length;

      if (successCount === totalCount) {
        Alert.alert(
          'Success!',
          'Video shared to all selected platforms',
          [{ text: 'OK' }]
        );
      } else if (successCount > 0) {
        Alert.alert(
          'Partial Success',
          `Video shared to ${successCount} of ${totalCount} platforms`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          'Failed to share video to any platform. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to share video. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSharing(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSharePreview = async () => {
    try {
      await videoExportService.shareVideo(videoUrl, {
        title: 'Check out this transformation!',
        message: 'Amazing pet grooming transformation created with PawSpace',
        url: videoUrl,
        type: 'video/mp4'
      });
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to share preview. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} style={styles.topBarButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.topBarTitle}>Preview</Text>
        
        <TouchableOpacity onPress={handleSharePreview} style={styles.topBarButton}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: videoUrl }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={playerState.isLooping}
          isMuted={playerState.isMuted}
          onPlaybackStatusUpdate={handleVideoStatusUpdate}
        />
        
        {playerState.isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}

        <VideoPlayerControls
          playerState={playerState}
          onPlayPause={handlePlayPause}
          onMuteToggle={handleMuteToggle}
          onLoopToggle={handleLoopToggle}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSaveToDevice}
          disabled={isExporting}
        >
          {isExporting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="download-outline" size={20} color="white" />
          )}
          <Text style={styles.actionButtonText}>
            {isExporting ? 'Saving...' : 'Save to Device'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.postButton]}
          onPress={handleShareToSocial}
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="share-social-outline" size={20} color="white" />
          )}
          <Text style={styles.actionButtonText}>
            {isSharing ? 'Preparing...' : 'Share to Social'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Publishing Bottom Sheet */}
      <PublishingBottomSheet
        visible={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        onPublish={handlePublish}
        videoUrl={videoUrl}
        beforeImageUrl={beforeImageUrl}
        afterImageUrl={afterImageUrl}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  topBarButton: {
    padding: 8,
  },
  topBarTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  postButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreviewScreen;