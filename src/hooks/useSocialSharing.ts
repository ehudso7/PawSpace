/**
 * useSocialSharing Hook
 * Handles sharing to Instagram, TikTok, and other platforms
 */

import { useState } from 'react';
import { Platform, Share, Linking, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { ShareDestination, PublishOptions } from '../types/video.types';

interface UseSocialSharingReturn {
  isSharing: boolean;
  shareToInstagram: (videoUrl: string, options: PublishOptions) => Promise<void>;
  shareToTikTok: (videoUrl: string, options: PublishOptions) => Promise<void>;
  shareGeneric: (videoUrl: string, options: PublishOptions) => Promise<void>;
  sharePreview: (videoUrl: string) => Promise<void>;
}

export const useSocialSharing = (): UseSocialSharingReturn => {
  const [isSharing, setIsSharing] = useState(false);

  const downloadVideoForSharing = async (videoUrl: string): Promise<string> => {
    const filename = `pawspace_${Date.now()}.mp4`;
    const fileUri = `${FileSystem.cacheDirectory}${filename}`;

    const downloadResult = await FileSystem.downloadAsync(videoUrl, fileUri);
    return downloadResult.uri;
  };

  const formatCaption = (options: PublishOptions): string => {
    const { caption, hashtags, serviceTag } = options;
    const hashtagString = hashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
    const serviceInfo = serviceTag ? `\n\n${serviceTag}` : '';
    
    return `${caption}${serviceInfo}\n\n${hashtagString}`;
  };

  const shareToInstagram = async (videoUrl: string, options: PublishOptions): Promise<void> => {
    setIsSharing(true);

    try {
      const localUri = await downloadVideoForSharing(videoUrl);
      const caption = formatCaption(options);

      // Instagram Reels sharing
      const instagramUrl = `instagram://library?AssetPath=${encodeURIComponent(localUri)}`;
      
      const canOpen = await Linking.canOpenURL(instagramUrl);
      
      if (canOpen) {
        // Copy caption to clipboard for user to paste
        // Note: Instagram doesn't support pre-filled captions via URL scheme
        await Linking.openURL(instagramUrl);
        Alert.alert(
          'Instagram Opened',
          'Paste your caption:\n\n' + caption,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error('Instagram not installed');
      }
    } catch (error) {
      console.error('Instagram share error:', error);
      Alert.alert('Error', 'Failed to share to Instagram. Make sure Instagram is installed.');
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  const shareToTikTok = async (videoUrl: string, options: PublishOptions): Promise<void> => {
    setIsSharing(true);

    try {
      const localUri = await downloadVideoForSharing(videoUrl);
      const caption = formatCaption(options);

      // TikTok sharing
      const tiktokUrl = Platform.select({
        ios: 'tiktok://share',
        android: 'snssdk1128://share',
      });

      if (tiktokUrl) {
        const canOpen = await Linking.canOpenURL(tiktokUrl);
        
        if (canOpen) {
          await Linking.openURL(tiktokUrl);
          Alert.alert(
            'TikTok Opened',
            'Select the video from your gallery and add this caption:\n\n' + caption,
            [{ text: 'OK' }]
          );
        } else {
          throw new Error('TikTok not installed');
        }
      }
    } catch (error) {
      console.error('TikTok share error:', error);
      Alert.alert('Error', 'Failed to share to TikTok. Make sure TikTok is installed.');
      throw error;
    } finally {
      setIsSharing(false);
    }
  };

  const shareGeneric = async (videoUrl: string, options: PublishOptions): Promise<void> => {
    setIsSharing(true);

    try {
      const caption = formatCaption(options);

      if (Platform.OS === 'web') {
        // Web API Share
        if (navigator.share) {
          await navigator.share({
            title: 'Pet Transformation',
            text: caption,
            url: videoUrl,
          });
        } else {
          // Fallback for web
          await Share.share({
            message: `${caption}\n\n${videoUrl}`,
          });
        }
      } else {
        // Mobile sharing
        const localUri = await downloadVideoForSharing(videoUrl);
        
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(localUri, {
            mimeType: 'video/mp4',
            dialogTitle: 'Share your transformation',
            UTI: 'public.movie',
          });
        } else {
          // Fallback to basic Share
          await Share.share({
            message: caption,
            url: videoUrl,
          });
        }
      }
    } catch (error) {
      if ((error as any).message !== 'Share canceled') {
        console.error('Share error:', error);
        Alert.alert('Error', 'Failed to share video');
        throw error;
      }
    } finally {
      setIsSharing(false);
    }
  };

  const sharePreview = async (videoUrl: string): Promise<void> => {
    setIsSharing(true);

    try {
      await Share.share({
        message: 'Check out this pet transformation!',
        url: videoUrl,
        title: 'Pet Transformation Preview',
      });
    } catch (error) {
      if ((error as any).message !== 'Share canceled') {
        console.error('Preview share error:', error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return {
    isSharing,
    shareToInstagram,
    shareToTikTok,
    shareGeneric,
    sharePreview,
  };
};
