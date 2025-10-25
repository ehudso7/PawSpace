/**
 * Video Generation Service
 * Orchestrates the complete video/GIF generation flow
 */

import { cloudinaryService } from './cloudinary';
import { gifGeneratorService } from './gifGenerator';
import type {
  VideoGenerationOptions,
  VideoGenerationProgress,
  TransitionType,
} from '../types/transformation';

export interface GenerationResult {
  videoUrl?: string;
  gifUrl?: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  duration: number;
}

export type GenerationMode = 'video' | 'gif' | 'auto';

export class VideoGenerationService {
  private static instance: VideoGenerationService;

  static getInstance(): VideoGenerationService {
    if (!VideoGenerationService.instance) {
      VideoGenerationService.instance = new VideoGenerationService();
    }
    return VideoGenerationService.instance;
  }

  /**
   * Main generation flow
   * Handles uploading, processing, and progress tracking
   */
  async generateTransformation(
    beforeImageUri: string,
    afterImageUri: string,
    options: {
      transitionType: TransitionType;
      duration?: number;
      hasMusic?: boolean;
      musicUrl?: string;
      mode?: GenerationMode;
    },
    onProgress?: (progress: VideoGenerationProgress) => void
  ): Promise<GenerationResult> {
    const {
      transitionType,
      duration = 3,
      hasMusic = false,
      musicUrl,
      mode = 'auto',
    } = options;

    try {
      // Step 1: Upload images (20% progress)
      onProgress?.({
        status: 'uploading',
        progress: 10,
        message: 'Uploading your images...',
      });

      const [beforeUpload, afterUpload] = await Promise.all([
        cloudinaryService.uploadImage(beforeImageUri),
        cloudinaryService.uploadImage(afterImageUri),
      ]);

      onProgress?.({
        status: 'uploading',
        progress: 20,
        message: 'Images uploaded successfully',
      });

      // Step 2: Decide generation mode
      const shouldGenerateVideo = mode === 'video' || (mode === 'auto' && duration > 2);

      if (shouldGenerateVideo) {
        // Generate video with Cloudinary
        return await this.generateVideo(
          beforeUpload.secure_url,
          afterUpload.secure_url,
          beforeUpload.public_id,
          afterUpload.public_id,
          { transitionType, duration, hasMusic, musicUrl },
          onProgress
        );
      } else {
        // Generate GIF for faster processing
        return await this.generateGif(
          beforeImageUri,
          afterImageUri,
          beforeUpload.secure_url,
          afterUpload.secure_url,
          { transitionType, duration },
          onProgress
        );
      }
    } catch (error) {
      console.error('Generation error:', error);
      onProgress?.({
        status: 'failed',
        progress: 0,
        message: error instanceof Error ? error.message : 'Generation failed',
      });
      throw error;
    }
  }

  /**
   * Generate video using Cloudinary
   */
  private async generateVideo(
    beforeUrl: string,
    afterUrl: string,
    beforePublicId: string,
    afterPublicId: string,
    options: {
      transitionType: TransitionType;
      duration: number;
      hasMusic: boolean;
      musicUrl?: string;
    },
    onProgress?: (progress: VideoGenerationProgress) => void
  ): Promise<GenerationResult> {
    // Step 3: Generate video (20-80% progress)
    onProgress?.({
      status: 'processing',
      progress: 30,
      message: 'Creating your transformation video...',
      estimated_time_remaining: 30,
    });

    const videoGenerationOptions: VideoGenerationOptions = {
      transition_type: options.transitionType,
      duration_seconds: options.duration,
      has_music: options.hasMusic,
      music_url: options.musicUrl,
      format: 'mp4',
    };

    const videoUrl = await cloudinaryService.generateTransformationVideo(
      beforePublicId,
      afterPublicId,
      videoGenerationOptions
    );

    // Step 4: Poll for completion
    onProgress?.({
      status: 'processing',
      progress: 50,
      message: 'Processing video...',
      estimated_time_remaining: 20,
    });

    await cloudinaryService.pollVideoStatus(
      beforePublicId,
      (pollProgress) => {
        const adjustedProgress = 50 + (pollProgress.progress * 0.4); // 50-90%
        onProgress?.({
          ...pollProgress,
          progress: adjustedProgress,
        });
      }
    );

    // Step 5: Complete
    onProgress?.({
      status: 'completed',
      progress: 100,
      message: 'Transformation ready!',
    });

    return {
      videoUrl,
      beforeImageUrl: beforeUrl,
      afterImageUrl: afterUrl,
      duration: options.duration,
    };
  }

  /**
   * Generate GIF as fallback (faster)
   */
  private async generateGif(
    beforeUri: string,
    afterUri: string,
    beforeUrl: string,
    afterUrl: string,
    options: {
      transitionType: TransitionType;
      duration: number;
    },
    onProgress?: (progress: VideoGenerationProgress) => void
  ): Promise<GenerationResult> {
    onProgress?.({
      status: 'processing',
      progress: 40,
      message: 'Creating GIF animation...',
    });

    // Generate GIF locally
    const gifUri = await gifGeneratorService.generateCrossfadeGif(
      beforeUri,
      afterUri,
      {
        frameCount: 10,
        duration: options.duration,
        quality: 0.8,
      }
    );

    onProgress?.({
      status: 'processing',
      progress: 70,
      message: 'Uploading GIF...',
    });

    // Upload GIF to Cloudinary
    const gifUpload = await cloudinaryService.uploadImage(gifUri);

    onProgress?.({
      status: 'completed',
      progress: 100,
      message: 'Transformation ready!',
    });

    return {
      gifUrl: gifUpload.secure_url,
      beforeImageUrl: beforeUrl,
      afterImageUrl: afterUrl,
      duration: options.duration,
    };
  }

  /**
   * Quick preview without full processing
   */
  async generateQuickPreview(
    beforeImageUri: string,
    afterImageUri: string
  ): Promise<{ beforeProcessed: string; afterProcessed: string }> {
    return await gifGeneratorService.createQuickTransition(
      beforeImageUri,
      afterImageUri
    );
  }

  /**
   * Estimate generation time
   */
  estimateGenerationTime(mode: GenerationMode, duration: number): number {
    if (mode === 'gif') {
      return 10; // ~10 seconds for GIF
    } else if (mode === 'video') {
      return 30 + (duration * 5); // ~30-60 seconds for video
    } else {
      // Auto mode
      return duration > 2 ? 45 : 10;
    }
  }
}

export const videoGenerationService = VideoGenerationService.getInstance();
