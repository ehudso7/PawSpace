/**
 * useVideoExport Hook
 * Handles video generation, export, and saving to device
 */

import { useState } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { getCloudinaryService } from '../services/cloudinary';
import { VideoParams, VideoMetadata } from '../types/video.types';

interface UseVideoExportReturn {
  isGenerating: boolean;
  isExporting: boolean;
  progress: number;
  error: string | null;
  generatedVideoUrl: string | null;
  generateVideo: (params: VideoParams) => Promise<string>;
  saveToDevice: (videoUrl: string) => Promise<void>;
  clearError: () => void;
}

export const useVideoExport = (): UseVideoExportReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const generateVideo = async (params: VideoParams): Promise<string> => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      const cloudinary = getCloudinaryService();

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const videoUrl = await cloudinary.createTransformationVideo(params);

      clearInterval(progressInterval);
      setProgress(100);
      setGeneratedVideoUrl(videoUrl);

      return videoUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate video';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  const requestStoragePermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'PawSpace needs access to save videos to your device',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }

    // iOS - request media library permission
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  };

  const saveToDevice = async (videoUrl: string): Promise<void> => {
    setIsExporting(true);
    setError(null);
    setProgress(0);

    try {
      // Request permissions
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        throw new Error('Storage permission denied');
      }

      setProgress(20);

      // Download the video
      const cloudinary = getCloudinaryService();
      const videoBlob = await cloudinary.downloadVideo(videoUrl);

      setProgress(60);

      // Save to device
      const filename = `pawspace_transformation_${Date.now()}.mp4`;
      
      if (Platform.OS === 'web') {
        // Web download
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Mobile (Expo)
        const fileUri = `${FileSystem.documentDirectory}${filename}`;
        
        // Convert blob to base64 and save
        const reader = new FileReader();
        reader.readAsDataURL(videoBlob);
        
        await new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              const base64data = (reader.result as string).split(',')[1];
              await FileSystem.writeAsStringAsync(fileUri, base64data, {
                encoding: FileSystem.EncodingType.Base64,
              });

              // Save to media library
              await MediaLibrary.createAssetAsync(fileUri);
              resolve(true);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
        });
      }

      setProgress(100);
      Alert.alert('Success', 'Video saved to your device!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save video';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isGenerating,
    isExporting,
    progress,
    error,
    generatedVideoUrl,
    generateVideo,
    saveToDevice,
    clearError,
  };
};
