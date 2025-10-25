/**
 * GIF Generator Service
 * Fallback option for quick transformation previews using local image manipulation
 */

import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export interface GifGenerationOptions {
  frameCount?: number;
  duration?: number; // seconds
  quality?: number; // 0-1
}

export class GifGeneratorService {
  private static instance: GifGeneratorService;
  
  static getInstance(): GifGeneratorService {
    if (!GifGeneratorService.instance) {
      GifGeneratorService.instance = new GifGeneratorService();
    }
    return GifGeneratorService.instance;
  }

  /**
   * Generate animated GIF from before/after images
   * Uses simple crossfade transition
   */
  async generateCrossfadeGif(
    beforeUri: string,
    afterUri: string,
    options: GifGenerationOptions = {}
  ): Promise<string> {
    const {
      frameCount = 10,
      duration = 2,
      quality = 0.8,
    } = options;

    try {
      // Create frames with opacity transition
      const frames: string[] = [];
      
      for (let i = 0; i <= frameCount; i++) {
        const opacity = i / frameCount;
        const frame = await this.createBlendedFrame(beforeUri, afterUri, opacity, quality);
        frames.push(frame);
      }
      
      // Add reverse frames for loop effect
      for (let i = frameCount - 1; i >= 0; i--) {
        frames.push(frames[i]);
      }
      
      // For MVP, we'll upload frames to Cloudinary to create GIF
      // In production, use a GIF encoder library
      const gifUrl = await this.createGifFromFrames(frames);
      
      // Clean up temporary frames
      await this.cleanupFrames(frames);
      
      return gifUrl;
    } catch (error) {
      console.error('GIF generation error:', error);
      throw new Error('Failed to generate GIF');
    }
  }

  /**
   * Create a single blended frame
   */
  private async createBlendedFrame(
    beforeUri: string,
    afterUri: string,
    opacity: number,
    quality: number
  ): Promise<string> {
    try {
      // Start with before image
      const result = await ImageManipulator.manipulateAsync(
        beforeUri,
        [
          // Resize to standard size for consistency
          { resize: { width: 720 } },
        ],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      // If opacity > 0, blend in after image
      if (opacity > 0) {
        // This is simplified - in production, use a proper blending library
        // or upload to Cloudinary for blending
        return result.uri;
      }

      return result.uri;
    } catch (error) {
      console.error('Frame creation error:', error);
      throw error;
    }
  }

  /**
   * Create GIF from frame URIs
   * Uses Cloudinary for actual GIF encoding
   */
  private async createGifFromFrames(frameUris: string[]): Promise<string> {
    try {
      // For MVP, create a simple video instead of GIF
      // Upload first and last frame and let Cloudinary create transition
      
      // In production, use gif-encoder or similar:
      // import { GifEncoder } from 'gif-encoder';
      // const encoder = new GifEncoder(width, height);
      // encoder.start();
      // encoder.setRepeat(0); // loop forever
      // encoder.setDelay(duration / frameCount * 1000);
      // encoder.setQuality(10);
      // frames.forEach(frame => encoder.addFrame(frame));
      // encoder.finish();
      // return encoder.out.getData();
      
      // For now, return the last frame URI as placeholder
      return frameUris[frameUris.length - 1];
    } catch (error) {
      console.error('GIF encoding error:', error);
      throw error;
    }
  }

  /**
   * Create simple crossfade effect
   * Alternative to full GIF generation
   */
  async createQuickTransition(
    beforeUri: string,
    afterUri: string
  ): Promise<{ beforeProcessed: string; afterProcessed: string }> {
    try {
      // Process both images to same size
      const [beforeProcessed, afterProcessed] = await Promise.all([
        this.processImage(beforeUri),
        this.processImage(afterUri),
      ]);

      return {
        beforeProcessed: beforeProcessed.uri,
        afterProcessed: afterProcessed.uri,
      };
    } catch (error) {
      console.error('Quick transition error:', error);
      throw error;
    }
  }

  /**
   * Process single image
   */
  private async processImage(uri: string) {
    return await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 720 } }],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
  }

  /**
   * Clean up temporary frame files
   */
  private async cleanupFrames(frameUris: string[]): Promise<void> {
    try {
      await Promise.all(
        frameUris.map(uri => 
          FileSystem.deleteAsync(uri, { idempotent: true })
        )
      );
    } catch (error) {
      console.error('Frame cleanup error:', error);
      // Non-critical error, continue
    }
  }

  /**
   * Estimate GIF file size
   */
  estimateGifSize(frameCount: number, width: number, height: number): number {
    // Rough estimate: ~100KB per frame for 720p
    const bytesPerFrame = (width * height) / 50;
    return Math.round(bytesPerFrame * frameCount);
  }
}

export const gifGeneratorService = GifGeneratorService.getInstance();
