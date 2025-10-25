/**
 * Cloudinary Service
 * Handles image uploads and video generation using Cloudinary API
 */

import { CLOUDINARY_CONFIG, CLOUDINARY_URLS } from '../config/cloudinary';
import type {
  CloudinaryUploadResponse,
  CloudinaryVideoResponse,
  VideoGenerationOptions,
  VideoGenerationProgress,
  TransitionType,
} from '../types/transformation';

export class CloudinaryService {
  private static instance: CloudinaryService;
  
  static getInstance(): CloudinaryService {
    if (!CloudinaryService.instance) {
      CloudinaryService.instance = new CloudinaryService();
    }
    return CloudinaryService.instance;
  }

  /**
   * Upload image to Cloudinary
   */
  async uploadImage(imageUri: string): Promise<CloudinaryUploadResponse> {
    try {
      const formData = new FormData();
      
      // Create file object from URI
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('file', {
        uri: imageUri,
        name: filename,
        type,
      } as any);
      
      formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloud_name);
      
      const response = await fetch(CLOUDINARY_URLS.upload, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Upload failed');
      }

      const data = await response.json();
      return {
        public_id: data.public_id,
        secure_url: data.secure_url,
        url: data.url,
        format: data.format,
        resource_type: data.resource_type,
      };
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Generate transformation video using Cloudinary
   */
  async generateTransformationVideo(
    beforePublicId: string,
    afterPublicId: string,
    options: VideoGenerationOptions
  ): Promise<string> {
    try {
      // Build transformation URL with effects
      const transformation = this.buildTransformation(options);
      
      // Create video with overlays
      const videoUrl = this.buildVideoUrl(beforePublicId, afterPublicId, transformation);
      
      // For actual generation, use Cloudinary's explicit API
      const generatedUrl = await this.createVideoExplicit(beforePublicId, afterPublicId, options);
      
      return generatedUrl;
    } catch (error) {
      console.error('Video generation error:', error);
      throw new Error('Failed to generate transformation video');
    }
  }

  /**
   * Build transformation parameters based on transition type
   */
  private buildTransformation(options: VideoGenerationOptions): string {
    const { transition_type, duration_seconds } = options;
    const frameCount = Math.floor(duration_seconds * 30); // 30 fps
    
    let transformation = '';
    
    switch (transition_type) {
      case 'fade':
      case 'crossfade':
        transformation = `e_fade:${duration_seconds * 1000}`;
        break;
      case 'slide':
        transformation = `e_slide,du_${duration_seconds}`;
        break;
      case 'zoom':
        transformation = `e_zoompan,du_${duration_seconds}`;
        break;
      case 'swipe':
        transformation = `e_wipe,du_${duration_seconds}`;
        break;
      default:
        transformation = `e_fade:${duration_seconds * 1000}`;
    }
    
    return transformation;
  }

  /**
   * Build video URL with transformations
   */
  private buildVideoUrl(
    beforePublicId: string,
    afterPublicId: string,
    transformation: string
  ): string {
    const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/video/upload`;
    
    // Create URL with overlay transformation
    const url = `${baseUrl}/${transformation},l_${afterPublicId.replace(/\//g, ':')},fl_layer_apply/${beforePublicId}.mp4`;
    
    return url;
  }

  /**
   * Create video using Cloudinary's explicit API
   */
  private async createVideoExplicit(
    beforePublicId: string,
    afterPublicId: string,
    options: VideoGenerationOptions
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('public_id', beforePublicId);
      formData.append('type', 'upload');
      formData.append('resource_type', 'video');
      
      // Add transformation
      const transformation = this.buildTransformation(options);
      formData.append('eager', transformation);
      
      // Add overlay
      formData.append('overlay', afterPublicId);
      
      formData.append('cloud_name', CLOUDINARY_CONFIG.cloud_name);
      formData.append('api_key', CLOUDINARY_CONFIG.api_key);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/video/explicit`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Video generation failed');
      }

      const data = await response.json();
      return data.secure_url || data.url;
    } catch (error) {
      console.error('Video explicit creation error:', error);
      throw error;
    }
  }

  /**
   * Poll for video generation status
   */
  async pollVideoStatus(
    publicId: string,
    onProgress?: (progress: VideoGenerationProgress) => void
  ): Promise<CloudinaryVideoResponse> {
    const maxAttempts = 60; // 60 seconds max
    const pollInterval = 1000; // 1 second
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(
          `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/video/upload/${publicId}.json`
        );

        if (response.ok) {
          const progress = Math.min(((attempt + 1) / maxAttempts) * 100, 100);
          
          if (onProgress) {
            onProgress({
              status: 'processing',
              progress,
              message: 'Generating your transformation...',
              estimated_time_remaining: maxAttempts - attempt,
            });
          }

          // Video is ready
          const videoUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/video/upload/${publicId}.mp4`;
          
          return {
            status: 'complete',
            video_url: videoUrl,
            public_id: publicId,
            progress: 100,
          };
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.error('Poll error:', error);
      }
    }

    throw new Error('Video generation timeout');
  }

  /**
   * Generate video URL with transformations (for immediate preview)
   */
  getTransformationVideoUrl(
    beforePublicId: string,
    afterPublicId: string,
    transitionType: TransitionType,
    duration: number = 3
  ): string {
    const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/video/upload`;
    
    // Create transformation string
    let effect = '';
    switch (transitionType) {
      case 'fade':
        effect = `e_fade:${duration * 1000}`;
        break;
      case 'slide':
        effect = `e_transition,du_${duration}`;
        break;
      default:
        effect = `e_fade:${duration * 1000}`;
    }
    
    // Build URL with overlay
    return `${baseUrl}/${effect},l_${afterPublicId.replace(/\//g, ':')},fl_layer_apply/${beforePublicId}.mp4`;
  }
}

export const cloudinaryService = CloudinaryService.getInstance();
