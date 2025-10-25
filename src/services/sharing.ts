import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';
import { ShareOptions, SocialPlatform, ExportResult } from '../types/transformation';
import { Alert, Platform } from 'react-native';

class SharingService {
  /**
   * Share transformation with native share sheet
   */
  async shareTransformation(
    mediaUri: string,
    caption: string,
    options: ShareOptions = { save_to_device: false, include_watermark: false }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Sharing is not available on this device');
      }

      // Determine MIME type
      const mimeType = this.getMimeType(mediaUri);
      
      // Share the media
      await Sharing.shareAsync(mediaUri, {
        mimeType,
        dialogTitle: caption,
        UTI: mimeType === 'video/mp4' ? 'public.mpeg-4' : 'public.image',
      });

      // Save to device if requested
      if (options.save_to_device) {
        await this.saveToDevice(mediaUri);
      }

      return { success: true };

    } catch (error) {
      console.error('Error sharing transformation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Sharing failed',
      };
    }
  }

  /**
   * Save media to device photo library
   */
  async saveToDevice(mediaUri: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Request permissions
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error('Permission to access media library was denied');
      }

      // Save the media
      const asset = await MediaLibrary.createAssetAsync(mediaUri);
      
      // Create album if it doesn't exist
      const albumName = 'PawSpace Transformations';
      let album = await MediaLibrary.getAlbumAsync(albumName);
      
      if (!album) {
        album = await MediaLibrary.createAlbumAsync(albumName, asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      return { success: true };

    } catch (error) {
      console.error('Error saving to device:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Save failed',
      };
    }
  }

  /**
   * Share to Instagram Stories
   */
  async shareToInstagram(
    mediaUri: string,
    caption?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if Instagram is installed
      const instagramUrl = 'instagram://story-camera';
      const canOpen = await Linking.canOpenURL(instagramUrl);
      
      if (!canOpen) {
        // Fallback to regular sharing
        return this.shareTransformation(mediaUri, caption || 'Check out my transformation!');
      }

      // For iOS, we can use the Instagram URL scheme
      if (Platform.OS === 'ios') {
        // Copy media to a temporary location accessible by Instagram
        const tempUri = await this.copyToTempLocation(mediaUri);
        
        // Open Instagram with the media
        await Linking.openURL(`instagram://library?LocalIdentifier=${tempUri}`);
        
        return { success: true };
      } else {
        // For Android, use sharing intent
        const mimeType = this.getMimeType(mediaUri);
        
        await Sharing.shareAsync(mediaUri, {
          mimeType,
          dialogTitle: caption,
        });
        
        return { success: true };
      }

    } catch (error) {
      console.error('Error sharing to Instagram:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Instagram sharing failed',
      };
    }
  }

  /**
   * Share to TikTok
   */
  async shareToTikTok(
    mediaUri: string,
    caption?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if TikTok is installed
      const tiktokUrl = 'snssdk1233://';
      const canOpen = await Linking.canOpenURL(tiktokUrl);
      
      if (!canOpen) {
        // Fallback to regular sharing
        return this.shareTransformation(mediaUri, caption || 'Check out my transformation!');
      }

      // Use sharing intent for TikTok
      const mimeType = this.getMimeType(mediaUri);
      
      await Sharing.shareAsync(mediaUri, {
        mimeType,
        dialogTitle: caption || 'Share to TikTok',
      });

      return { success: true };

    } catch (error) {
      console.error('Error sharing to TikTok:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'TikTok sharing failed',
      };
    }
  }

  /**
   * Share to Snapchat
   */
  async shareToSnapchat(
    mediaUri: string,
    caption?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if Snapchat is installed
      const snapchatUrl = 'snapchat://';
      const canOpen = await Linking.canOpenURL(snapchatUrl);
      
      if (!canOpen) {
        // Fallback to regular sharing
        return this.shareTransformation(mediaUri, caption || 'Check out my transformation!');
      }

      // Use sharing intent for Snapchat
      const mimeType = this.getMimeType(mediaUri);
      
      await Sharing.shareAsync(mediaUri, {
        mimeType,
        dialogTitle: caption || 'Share to Snapchat',
      });

      return { success: true };

    } catch (error) {
      console.error('Error sharing to Snapchat:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Snapchat sharing failed',
      };
    }
  }

  /**
   * Share to specific social platform
   */
  async shareToSocial(
    platform: SocialPlatform,
    mediaUri: string,
    caption?: string
  ): Promise<{ success: boolean; error?: string }> {
    switch (platform) {
      case 'instagram':
        return this.shareToInstagram(mediaUri, caption);
      case 'tiktok':
        return this.shareToTikTok(mediaUri, caption);
      case 'snapchat':
        return this.shareToSnapchat(mediaUri, caption);
      default:
        return {
          success: false,
          error: `Unsupported platform: ${platform}`,
        };
    }
  }

  /**
   * Copy media to temporary location for sharing
   */
  private async copyToTempLocation(mediaUri: string): Promise<string> {
    const filename = mediaUri.split('/').pop() || 'media';
    const tempUri = `${FileSystem.documentDirectory}temp_${Date.now()}_${filename}`;
    
    await FileSystem.copyAsync({
      from: mediaUri,
      to: tempUri,
    });
    
    return tempUri;
  }

  /**
   * Get MIME type from file URI
   */
  private getMimeType(uri: string): string {
    const extension = uri.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'mp4':
      case 'mov':
        return 'video/mp4';
      case 'gif':
        return 'image/gif';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }

  /**
   * Show share options alert
   */
  async showShareOptions(
    mediaUri: string,
    caption: string,
    onShare?: (platform?: SocialPlatform) => void
  ): Promise<void> {
    const buttons = [
      {
        text: 'Save to Photos',
        onPress: async () => {
          const result = await this.saveToDevice(mediaUri);
          if (result.success) {
            Alert.alert('Success', 'Saved to your photo library!');
          } else {
            Alert.alert('Error', result.error || 'Failed to save');
          }
          onShare?.();
        },
      },
      {
        text: 'Share',
        onPress: async () => {
          await this.shareTransformation(mediaUri, caption);
          onShare?.();
        },
      },
      {
        text: 'Instagram',
        onPress: async () => {
          await this.shareToInstagram(mediaUri, caption);
          onShare?.('instagram');
        },
      },
      {
        text: 'TikTok',
        onPress: async () => {
          await this.shareToTikTok(mediaUri, caption);
          onShare?.('tiktok');
        },
      },
      {
        text: 'Cancel',
        style: 'cancel' as const,
      },
    ];

    Alert.alert('Share Transformation', 'Choose how to share your transformation:', buttons);
  }

  /**
   * Clean up temporary files
   */
  async cleanup(): Promise<void> {
    try {
      const documentDir = FileSystem.documentDirectory;
      if (!documentDir) return;

      const files = await FileSystem.readDirectoryAsync(documentDir);
      const tempFiles = files.filter(file => file.startsWith('temp_'));
      
      for (const file of tempFiles) {
        await FileSystem.deleteAsync(`${documentDir}${file}`, { idempotent: true });
      }
    } catch (error) {
      console.warn('Error cleaning up temp files:', error);
    }
  }
}

export default SharingService;