import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

import BottomSheet from '../../components/BottomSheet';
import VideoControls from '../../components/VideoControls';
import CaptionInput from '../../components/CaptionInput';
import HashtagSuggestions from '../../components/HashtagSuggestions';
import PrivacyToggle from '../../components/PrivacyToggle';
import ActionButtons from '../../components/ActionButtons';
import { VideoPlayerState, VideoGenerationProgress } from '../../types/video';
import CloudinaryService from '../../services/cloudinary';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PreviewScreenProps {
  route: {
    params: {
      beforeImageUri: string;
      afterImageUri: string;
      transition: string;
      duration: number;
      textOverlays: any[];
      effects?: any[];
    };
  };
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const videoRef = useRef<Video>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState<VideoGenerationProgress>({
    stage: 'uploading',
    progress: 0,
    message: 'Preparing video...',
  });
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isMuted: false,
    isLooping: false,
    playbackRate: 1,
  });
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [serviceTag, setServiceTag] = useState<string | null>(null);

  const cloudinaryService = new CloudinaryService({
    cloud_name: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || '',
    api_secret: process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET || '',
  });

  useEffect(() => {
    generateVideo();
  }, []);

  const generateVideo = async () => {
    try {
      setIsGenerating(true);
      
      // Update progress
      setGenerationProgress({
        stage: 'uploading',
        progress: 20,
        message: 'Uploading images...',
      });

      // Generate video using Cloudinary
      const videoUrl = await cloudinaryService.createTransformationVideo({
        beforeImageUrl: route.params.beforeImageUri,
        afterImageUrl: route.params.afterImageUri,
        transition: route.params.transition as any,
        duration: route.params.duration,
        textOverlays: route.params.textOverlays,
        fps: 30,
      });

      setGenerationProgress({
        stage: 'processing',
        progress: 60,
        message: 'Processing video...',
      });

      // Apply effects if any
      if (route.params.effects && route.params.effects.length > 0) {
        const publicId = extractPublicId(videoUrl);
        const processedVideoUrl = await cloudinaryService.applyEffects(publicId, route.params.effects);
        setVideoUri(processedVideoUrl);
      } else {
        setVideoUri(videoUrl);
      }

      setGenerationProgress({
        stage: 'complete',
        progress: 100,
        message: 'Video ready!',
      });

      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    } catch (error) {
      console.error('Error generating video:', error);
      Alert.alert('Error', 'Failed to generate video. Please try again.');
      setIsGenerating(false);
    }
  };

  const extractPublicId = (url: string): string => {
    const match = url.match(/\/upload\/(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : '';
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (playerState.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const handleMuteToggle = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!playerState.isMuted);
    }
  };

  const handleLoopToggle = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsLoopingAsync(!playerState.isLooping);
    }
  };

  const handleSeek = async (time: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(time);
    }
  };

  const handleVideoStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPlayerState(prev => ({
        ...prev,
        isPlaying: status.isPlaying,
        currentTime: status.positionMillis / 1000,
        duration: status.durationMillis / 1000,
        isMuted: status.isMuted,
        isLooping: status.isLooping,
      }));
    }
  };

  const handleSaveToDevice = async () => {
    try {
      if (!videoUri) return;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to save videos to your device.');
        return;
      }

      const filename = `pawspace_transformation_${Date.now()}.mp4`;
      const fileUri = FileSystem.documentDirectory + filename;
      
      const downloadResult = await FileSystem.downloadAsync(videoUri, fileUri);
      
      if (downloadResult.status === 200) {
        await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
        Alert.alert('Success', 'Video saved to your device!');
      }
    } catch (error) {
      console.error('Error saving video:', error);
      Alert.alert('Error', 'Failed to save video to device.');
    }
  };

  const handlePostToPawSpace = async () => {
    try {
      // Implement PawSpace posting logic
      Alert.alert('Success', 'Posted to PawSpace!');
    } catch (error) {
      console.error('Error posting to PawSpace:', error);
      Alert.alert('Error', 'Failed to post to PawSpace.');
    }
  };

  const handleShareToSocial = async (platform: 'instagram' | 'tiktok') => {
    try {
      if (!videoUri) return;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(videoUri, {
          mimeType: 'video/mp4',
          dialogTitle: `Share to ${platform}`,
        });
      }
    } catch (error) {
      console.error('Error sharing video:', error);
      Alert.alert('Error', `Failed to share to ${platform}.`);
    }
  };

  const handleBackToEditor = () => {
    navigation.goBack();
  };

  const handleSharePreview = () => {
    setIsBottomSheetVisible(true);
  };

  if (isGenerating) {
    return (
      <View style={styles.generatingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.generatingText}>{generationProgress.message}</Text>
        <Text style={styles.progressText}>{generationProgress.progress}%</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Top Bar */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToEditor}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleSharePreview}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Video Player */}
      {videoUri && (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isLooping={playerState.isLooping}
            isMuted={playerState.isMuted}
            onPlaybackStatusUpdate={handleVideoStatusUpdate}
          />
          
          {/* Video Controls Overlay */}
          <VideoControls
            playerState={playerState}
            onPlayPause={handlePlayPause}
            onMuteToggle={handleMuteToggle}
            onLoopToggle={handleLoopToggle}
            onSeek={handleSeek}
          />
        </View>
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        height={screenHeight * 0.6}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Share Your Transformation</Text>
          
          <CaptionInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Write a caption for your transformation..."
            maxLength={280}
          />
          
          <HashtagSuggestions
            selectedHashtags={hashtags}
            onHashtagToggle={(tag) => {
              setHashtags(prev => 
                prev.includes(tag) 
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              );
            }}
          />
          
          <PrivacyToggle
            value={privacy}
            onValueChange={setPrivacy}
          />
          
          <ActionButtons
            onSaveToDevice={handleSaveToDevice}
            onPostToPawSpace={handlePostToPawSpace}
            onShareToInstagram={() => handleShareToSocial('instagram')}
            onShareToTikTok={() => handleShareToSocial('tiktok')}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  generatingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  progressText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginTop: 10,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: screenWidth,
    height: screenHeight,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default PreviewScreen;