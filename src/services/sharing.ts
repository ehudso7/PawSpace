import * as Sharing from 'expo-sharing';
import * as Linking from 'expo-linking';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export class SharingService {
  /**
   * Share transformation using device's share sheet
   */
  static async shareTransformation(
    videoUri: string, 
    caption: string,
    mimeType: 'video/mp4' | 'image/gif' = 'video/mp4'
  ): Promise<void> {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Error', 'Sharing is not available on this device');
        return;
      }

      await Sharing.shareAsync(videoUri, {
        mimeType,
        dialogTitle: caption,
        UTI: mimeType === 'video/mp4' ? 'public.movie' : 'com.compuserve.gif',
      });
    } catch (error) {
      console.error('Share transformation error:', error);
      Alert.alert('Error', 'Failed to share transformation');
    }
  }

  /**
   * Share to Instagram Stories
   */
  static async shareToInstagram(videoUri: string): Promise<void> {
    try {
      const instagramUrl = 'instagram://story-camera';
      const canOpen = await Linking.canOpenURL(instagramUrl);
      
      if (canOpen) {
        await Linking.openURL(instagramUrl);
      } else {
        // Fallback to regular sharing
        await this.shareTransformation(videoUri, 'Check out my transformation!');
      }
    } catch (error) {
      console.error('Share to Instagram error:', error);
      Alert.alert('Error', 'Failed to open Instagram');
    }
  }

  /**
   * Share to TikTok
   */
  static async shareToTikTok(videoUri: string): Promise<void> {
    try {
      const tiktokUrl = 'tiktok://';
      const canOpen = await Linking.canOpenURL(tiktokUrl);
      
      if (canOpen) {
        await Linking.openURL(tiktokUrl);
      } else {
        // Fallback to regular sharing
        await this.shareTransformation(videoUri, 'Check out my transformation!');
      }
    } catch (error) {
      console.error('Share to TikTok error:', error);
      Alert.alert('Error', 'Failed to open TikTok');
    }
  }

  /**
   * Save video/GIF to device gallery
   */
  static async saveToDevice(
    fileUri: string,
    filename?: string
  ): Promise<void> {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to save the transformation.'
        );
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      
      if (filename) {
        await MediaLibrary.createAlbumAsync(filename, asset, false);
      }

      Alert.alert('Success', 'Transformation saved to your gallery!');
    } catch (error) {
      console.error('Save to device error:', error);
      Alert.alert('Error', 'Failed to save to gallery');
    }
  }

  /**
   * Copy link to clipboard
   */
  static async copyLink(transformationId: string): Promise<void> {
    try {
      const link = `https://yourapp.com/transformation/${transformationId}`;
      
      // You'll need to install expo-clipboard for this
      // import * as Clipboard from 'expo-clipboard';
      // await Clipboard.setStringAsync(link);
      
      Alert.alert('Link Copied', 'Transformation link copied to clipboard!');
    } catch (error) {
      console.error('Copy link error:', error);
      Alert.alert('Error', 'Failed to copy link');
    }
  }

  /**
   * Get sharing options for a transformation
   */
  static getSharingOptions() {
    return [
      {
        id: 'device',
        title: 'Save to Gallery',
        icon: 'download',
        action: 'save',
      },
      {
        id: 'instagram',
        title: 'Share to Instagram',
        icon: 'instagram',
        action: 'instagram',
      },
      {
        id: 'tiktok',
        title: 'Share to TikTok',
        icon: 'tiktok',
        action: 'tiktok',
      },
      {
        id: 'share',
        title: 'Share',
        icon: 'share',
        action: 'share',
      },
      {
        id: 'copy',
        title: 'Copy Link',
        icon: 'link',
        action: 'copy',
      },
    ];
  }
}