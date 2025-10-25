import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { CloudinaryService } from './cloudinary';

export interface GifFrame {
  uri: string;
  duration: number;
}

export class GifGenerator {
  /**
   * Generate animated GIF using expo-image-manipulator
   */
  static async generateGIF(
    beforeImageUri: string,
    afterImageUri: string,
    options: {
      frameCount?: number;
      duration?: number;
      quality?: number;
      transitionType?: 'crossfade' | 'slide' | 'zoom';
    } = {}
  ): Promise<string> {
    const {
      frameCount = 10,
      duration = 2000, // 2 seconds total
      quality = 0.8,
      transitionType = 'crossfade'
    } = options;

    try {
      // Create frames with opacity transition
      const frames: GifFrame[] = [];
      const frameDuration = duration / frameCount;

      for (let i = 0; i <= frameCount; i++) {
        const progress = i / frameCount;
        const opacity = this.calculateOpacity(progress, transitionType);
        
        const frame = await this.createFrame(
          beforeImageUri,
          afterImageUri,
          opacity,
          progress,
          transitionType
        );
        
        frames.push({
          uri: frame.uri,
          duration: frameDuration,
        });
      }

      // For now, return the last frame as a static image
      // In a real implementation, you'd use a GIF encoder library
      return frames[frames.length - 1].uri;
    } catch (error) {
      console.error('GIF generation error:', error);
      throw new Error('Failed to generate GIF');
    }
  }

  /**
   * Create a single frame with the specified opacity and transition
   */
  private static async createFrame(
    beforeImageUri: string,
    afterImageUri: string,
    opacity: number,
    progress: number,
    transitionType: string
  ): Promise<{ uri: string }> {
    const manipulations: ImageManipulator.Action[] = [];

    // Add the after image as an overlay with opacity
    manipulations.push({
      overlay: {
        uri: afterImageUri,
        opacity,
      },
    });

    // Apply transition-specific transformations
    switch (transitionType) {
      case 'slide':
        const slideOffset = (1 - progress) * 100;
        manipulations.push({
          overlay: {
            uri: afterImageUri,
            opacity: 1,
            position: { x: slideOffset, y: 0 },
          },
        });
        break;
      
      case 'zoom':
        const scale = 0.8 + (progress * 0.4); // Scale from 0.8 to 1.2
        manipulations.push({
          overlay: {
            uri: afterImageUri,
            opacity: 1,
            scale,
          },
        });
        break;
      
      case 'crossfade':
      default:
        // Already handled by opacity
        break;
    }

    const result = await ImageManipulator.manipulateAsync(
      beforeImageUri,
      manipulations,
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return result;
  }

  /**
   * Calculate opacity based on progress and transition type
   */
  private static calculateOpacity(
    progress: number,
    transitionType: string
  ): number {
    switch (transitionType) {
      case 'crossfade':
        return progress;
      case 'slide':
        return progress > 0.5 ? 1 : 0;
      case 'zoom':
        return Math.pow(progress, 2); // Ease-in curve
      default:
        return progress;
    }
  }

  /**
   * Generate GIF using Cloudinary as fallback
   */
  static async generateGifWithCloudinary(
    beforeImageUri: string,
    afterImageUri: string,
    transitionType: string = 'crossfade'
  ): Promise<string> {
    try {
      // Upload images to Cloudinary first
      const beforeUpload = await CloudinaryService.uploadImage(beforeImageUri);
      const afterUpload = await CloudinaryService.uploadImage(afterImageUri);

      // Generate GIF transformation
      const gifResult = await CloudinaryService.generateGifTransformation(
        beforeUpload.secure_url,
        afterUpload.secure_url,
        transitionType
      );

      return gifResult.secure_url;
    } catch (error) {
      console.error('Cloudinary GIF generation error:', error);
      throw new Error('Failed to generate GIF with Cloudinary');
    }
  }
}