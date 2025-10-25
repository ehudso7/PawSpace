/**
 * Sharing Utilities
 * Handles sharing transformations to social media and device
 */

import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Linking from 'expo-linking';
import { Platform, Alert } from 'react-native';
import type { SharePlatform } from '../types/transformation';
import { transformationsService } from './transformations';

export interface ShareOptions {
  videoUri?: string;
  gifUri?: string;
  caption: string;
  transformationId?: string;
}

export class SharingService {
  private static instance: SharingService;

  static getInstance(): SharingService {
    if (!SharingService.instance) {
      SharingService.instance = new SharingService();
    }
    return SharingService.instance;
  }

  /**
   * Share to device's native share sheet
   */
  async shareToDevice(options: ShareOptions): Promise<void> {
    const { videoUri, gifUri, caption } = options;
    const uri = videoUri || gifUri;

    if (!uri) {
      throw new Error('No media to share');
    }

    try {
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        throw new Error('Sharing is not available on this device');
      }

      await Sharing.shareAsync(uri, {
        mimeType: videoUri ? 'video/mp4' : 'image/gif',
        dialogTitle: caption || 'Share Transformation',
        UTI: videoUri ? 'public.mpeg-4' : 'com.compuserve.gif',
      });

      // Track share
      if (options.transformationId) {
        await transformationsService.shareToSocial(
          options.transformationId,
          'instagram' // Default platform
        );
      }
    } catch (error) {
      console.error('Share to device error:', error);
      throw new Error('Failed to share');
    }
  }

  /**
   * Save to device camera roll/gallery
   */
  async saveToDevice(videoUri: string): Promise<void> {
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Media library permission denied');
      }

      // Save to device
      const asset = await MediaLibrary.createAssetAsync(videoUri);
      
      // Optionally add to album
      await this.addToAlbum(asset, 'PawSpace Transformations');
      
      Alert.alert(
        'Success!',
        'Transformation saved to your gallery',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Save to device error:', error);
      throw new Error('Failed to save to gallery');
    }
  }

  /**
   * Add asset to custom album
   */
  private async addToAlbum(
    asset: MediaLibrary.Asset,
    albumName: string
  ): Promise<void> {
    try {
      // Get or create album
      const album = await MediaLibrary.getAlbumAsync(albumName);
      
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync(albumName, asset, false);
      }
    } catch (error) {
      console.error('Album creation error:', error);
      // Non-critical, continue
    }
  }

  /**
   * Share to Instagram Stories
   */
  async shareToInstagram(options: ShareOptions): Promise<void> {
    const { videoUri, gifUri, transformationId } = options;
    const uri = videoUri || gifUri;

    if (!uri) {
      throw new Error('No media to share');
    }

    try {
      // Instagram story deep link
      const instagramUrl = Platform.select({
        ios: 'instagram-stories://share',
        android: 'instagram://story-camera',
      });

      if (!instagramUrl) {
        throw new Error('Instagram not supported on this platform');
      }

      // Check if Instagram is installed
      const canOpen = await Linking.canOpenURL(instagramUrl);
      
      if (!canOpen) {
        Alert.alert(
          'Instagram Not Found',
          'Please install Instagram to share stories',
          [{ text: 'OK' }]
        );
        return;
      }

      // For iOS, use share sheet with Instagram
      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(uri, {
          mimeType: videoUri ? 'video/mp4' : 'image/gif',
          dialogTitle: 'Share to Instagram',
        });
      } else {
        // For Android, try to open Instagram directly
        await Linking.openURL(instagramUrl);
      }

      // Track share
      if (transformationId) {
        await transformationsService.shareToSocial(transformationId, 'instagram');
      }
    } catch (error) {
      console.error('Instagram share error:', error);
      throw new Error('Failed to share to Instagram');
    }
  }

  /**
   * Share to TikTok
   */
  async shareToTikTok(options: ShareOptions): Promise<void> {
    const { videoUri, transformationId } = options;

    if (!videoUri) {
      throw new Error('Video required for TikTok');
    }

    try {
      // TikTok deep link
      const tiktokUrl = 'tiktok://';

      const canOpen = await Linking.canOpenURL(tiktokUrl);
      
      if (!canOpen) {
        Alert.alert(
          'TikTok Not Found',
          'Please install TikTok to share videos',
          [{ text: 'OK' }]
        );
        return;
      }

      // Use share sheet - TikTok will appear if installed
      await Sharing.shareAsync(videoUri, {
        mimeType: 'video/mp4',
        dialogTitle: 'Share to TikTok',
      });

      // Track share
      if (transformationId) {
        await transformationsService.shareToSocial(transformationId, 'tiktok');
      }
    } catch (error) {
      console.error('TikTok share error:', error);
      throw new Error('Failed to share to TikTok');
    }
  }

  /**
   * Copy share link to clipboard
   */
  async copyShareLink(transformationId: string): Promise<string> {
    const shareUrl = `https://pawspace.com/transformations/${transformationId}`;
    
    // Use Expo Clipboard
    // import * as Clipboard from 'expo-clipboard';
    // await Clipboard.setStringAsync(shareUrl);
    
    Alert.alert(
      'Link Copied!',
      'Share link copied to clipboard',
      [{ text: 'OK' }]
    );
    
    return shareUrl;
  }

  /**
   * Share via other platforms (Facebook, Twitter, etc)
   */
  async shareVia(platform: SharePlatform, options: ShareOptions): Promise<void> {
    switch (platform) {
      case 'instagram':
        return this.shareToInstagram(options);
      case 'tiktok':
        return this.shareToTikTok(options);
      case 'facebook':
      case 'twitter':
        return this.shareToDevice(options);
      default:
        throw new Error('Unsupported platform');
    }
  }

  /**
   * Check if platform app is installed
   */
  async isPlatformInstalled(platform: SharePlatform): Promise<boolean> {
    const urls: Record<SharePlatform, string> = {
      instagram: Platform.select({
        ios: 'instagram://',
        android: 'instagram://',
      }) || '',
      tiktok: 'tiktok://',
      facebook: 'fb://',
      twitter: 'twitter://',
    };

    const url = urls[platform];
    if (!url) return false;

    try {
      return await Linking.canOpenURL(url);
    } catch {
      return false;
    }
  }

  /**
   * Get available sharing options
   */
  async getAvailablePlatforms(): Promise<SharePlatform[]> {
    const platforms: SharePlatform[] = ['instagram', 'tiktok', 'facebook', 'twitter'];
    const available: SharePlatform[] = [];

    for (const platform of platforms) {
      if (await this.isPlatformInstalled(platform)) {
        available.push(platform);
      }
    }

    return available;
  }
}

export const sharingService = SharingService.getInstance();
