import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { ShareOptions } from '../types';

export class VideoExportService {
  /**
   * Download video from URL and save to device
   */
  async saveToDevice(videoUrl: string, filename?: string): Promise<string> {
    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Media library permission denied');
      }

      // Generate filename if not provided
      const videoFilename = filename || `pawspace_transformation_${Date.now()}.mp4`;
      const fileUri = `${FileSystem.documentDirectory}${videoFilename}`;

      // Download video file
      const downloadResult = await FileSystem.downloadAsync(videoUrl, fileUri);
      
      if (downloadResult.status !== 200) {
        throw new Error('Failed to download video');
      }

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      
      // Create album if it doesn't exist
      let album = await MediaLibrary.getAlbumAsync('PawSpace');
      if (!album) {
        album = await MediaLibrary.createAlbumAsync('PawSpace', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      return asset.uri;
    } catch (error) {
      console.error('Error saving video to device:', error);
      throw new Error('Failed to save video to device');
    }
  }

  /**
   * Share video to external apps
   */
  async shareVideo(videoUrl: string, options: ShareOptions): Promise<void> {
    try {
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        throw new Error('Sharing is not available on this device');
      }

      // Download video to temporary location
      const tempFilename = `temp_share_${Date.now()}.mp4`;
      const tempUri = `${FileSystem.cacheDirectory}${tempFilename}`;
      
      const downloadResult = await FileSystem.downloadAsync(videoUrl, tempUri);
      
      if (downloadResult.status !== 200) {
        throw new Error('Failed to download video for sharing');
      }

      // Share the video
      await Sharing.shareAsync(downloadResult.uri, {
        mimeType: options.type,
        dialogTitle: options.title,
        UTI: 'public.movie'
      });

      // Clean up temporary file
      await this.cleanupTempFile(downloadResult.uri);
    } catch (error) {
      console.error('Error sharing video:', error);
      throw new Error('Failed to share video');
    }
  }

  /**
   * Get video file info
   */
  async getVideoInfo(videoUrl: string): Promise<FileSystem.FileInfo> {
    try {
      const info = await FileSystem.getInfoAsync(videoUrl);
      return info;
    } catch (error) {
      console.error('Error getting video info:', error);
      throw new Error('Failed to get video information');
    }
  }

  /**
   * Check available storage space
   */
  async getAvailableSpace(): Promise<number> {
    try {
      const info = await FileSystem.getFreeDiskStorageAsync();
      return info;
    } catch (error) {
      console.error('Error checking available space:', error);
      return 0;
    }
  }

  /**
   * Clean up temporary files
   */
  private async cleanupTempFile(uri: string): Promise<void> {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        await FileSystem.deleteAsync(uri);
      }
    } catch (error) {
      console.error('Error cleaning up temp file:', error);
    }
  }

  /**
   * Create shareable link for social media
   */
  createShareableContent(videoUrl: string, caption: string, hashtags: string[]): {
    instagramStory: string;
    tiktokCaption: string;
    twitterPost: string;
  } {
    const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
    
    return {
      instagramStory: `${caption}\n\n${hashtagString}\n\n🎥 Created with PawSpace`,
      tiktokCaption: `${caption} ${hashtagString} #pawspace #petgrooming`,
      twitterPost: `${caption}\n\n${hashtagString}\n\nCreated with @PawSpaceApp 🐾\n\n${videoUrl}`
    };
  }

  /**
   * Generate video thumbnail
   */
  async generateThumbnail(videoUrl: string): Promise<string> {
    try {
      // For now, we'll return the video URL as thumbnail
      // In a real implementation, you'd extract a frame from the video
      return videoUrl.replace('.mp4', '_thumbnail.jpg');
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      throw new Error('Failed to generate video thumbnail');
    }
  }
}

export const videoExportService = new VideoExportService();