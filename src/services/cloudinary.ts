/**
 * Cloudinary Service for Video Generation and Transformations
 * 
 * This service handles:
 * - Image uploads
 * - Video generation from images
 * - Applying effects and transitions
 * - Generating transformation URLs
 * 
 * Installation required: npm install cloudinary
 */

import {
  VideoParams,
  TransitionType,
  TextOverlay,
  Effect,
  CloudinaryUploadResponse,
} from '../types/video.types';

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

class CloudinaryService {
  private config: CloudinaryConfig;
  private baseUrl: string;

  constructor(config: CloudinaryConfig) {
    this.config = config;
    this.baseUrl = `https://api.cloudinary.com/v1_1/${config.cloud_name}`;
  }

  /**
   * Upload an image to Cloudinary
   */
  async uploadImage(
    uri: string,
    folder: string = 'pet-transformations'
  ): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();
    
    // Handle both local file URIs and URLs
    const imageFile = await this.prepareImageFile(uri);
    formData.append('file', imageFile);
    formData.append('folder', folder);
    formData.append('upload_preset', 'pet_uploads'); // Set this in Cloudinary dashboard

    try {
      const response = await fetch(`${this.baseUrl}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  /**
   * Generate a transformation video from before/after images
   * This creates a video using Cloudinary's video transformation API
   */
  async createTransformationVideo(params: VideoParams): Promise<string> {
    try {
      // Upload both images if they're local URIs
      const beforePublicId = await this.getOrUploadImage(params.beforeImageUrl, 'before');
      const afterPublicId = await this.getOrUploadImage(params.afterImageUrl, 'after');

      // Build transformation URL
      const videoUrl = this.buildTransformationUrl({
        beforePublicId,
        afterPublicId,
        transition: params.transition,
        duration: params.duration,
        textOverlays: params.textOverlays,
        audioTrack: params.audioTrack,
        fps: params.fps,
      });

      return videoUrl;
    } catch (error) {
      console.error('Video creation error:', error);
      throw error;
    }
  }

  /**
   * Build a Cloudinary transformation URL for video generation
   */
  private buildTransformationUrl(params: {
    beforePublicId: string;
    afterPublicId: string;
    transition: TransitionType;
    duration: number;
    textOverlays: TextOverlay[];
    audioTrack?: string;
    fps: number;
  }): string {
    const { cloud_name } = this.config;
    const {
      beforePublicId,
      afterPublicId,
      transition,
      duration,
      textOverlays,
      audioTrack,
      fps,
    } = params;

    // Base video URL
    let transformations: string[] = [];

    // Video settings
    transformations.push(`fps_${fps}`);
    transformations.push(`du_${duration}`);

    // Add transition effect
    if (transition !== 'none') {
      const transitionDuration = duration * 0.3; // 30% of total duration
      transformations.push(`e_transition:${transition}:duration_${transitionDuration.toFixed(1)}`);
    }

    // Add text overlays
    textOverlays.forEach((overlay, index) => {
      const textTransform = this.buildTextOverlay(overlay);
      transformations.push(textTransform);
    });

    // Build the final URL using Cloudinary's video concatenation
    // This creates a video by transitioning from before to after image
    const baseTransform = transformations.join(',');
    
    // Use image-to-video conversion
    const videoUrl = `https://res.cloudinary.com/${cloud_name}/video/upload/` +
      `${baseTransform}/` +
      `l_${beforePublicId.replace(/\//g, ':')},e_fade:0,du_${(duration/2).toFixed(1)}/` +
      `l_${afterPublicId.replace(/\//g, ':')},e_fade:${(duration/2).toFixed(1)},du_${(duration/2).toFixed(1)}/` +
      `fl_splice,f_mp4/transformation_video_${Date.now()}.mp4`;

    // Add audio if provided
    if (audioTrack) {
      return `${videoUrl.replace('.mp4', '')},l_${audioTrack}/fl_layer_apply.mp4`;
    }

    return videoUrl;
  }

  /**
   * Build text overlay transformation string
   */
  private buildTextOverlay(overlay: TextOverlay): string {
    const {
      text,
      position,
      fontFamily = 'Arial',
      fontSize = 40,
      color = 'white',
      timestamp,
      duration,
    } = overlay;

    // Encode text for URL
    const encodedText = encodeURIComponent(text);
    
    // Position mapping
    const positionMap = {
      top: 'north',
      center: 'center',
      bottom: 'south',
    };

    const gravity = positionMap[position];
    
    return `l_text:${fontFamily}_${fontSize}:${encodedText},co_${color},g_${gravity},so_${timestamp},eo_${timestamp + duration}`;
  }

  /**
   * Apply effects to an existing video
   */
  async applyEffects(publicId: string, effects: Effect[]): Promise<string> {
    const effectTransforms = effects.map(effect => {
      switch (effect.type) {
        case 'brightness':
          return `e_brightness:${effect.intensity}`;
        case 'contrast':
          return `e_contrast:${effect.intensity}`;
        case 'saturation':
          return `e_saturation:${effect.intensity}`;
        case 'blur':
          return `e_blur:${effect.intensity}`;
        case 'sharpen':
          return `e_sharpen:${effect.intensity}`;
        default:
          return '';
      }
    }).filter(Boolean).join(',');

    const { cloud_name } = this.config;
    return `https://res.cloudinary.com/${cloud_name}/video/upload/${effectTransforms}/${publicId}`;
  }

  /**
   * Get public_id from URL or upload if it's a local URI
   */
  private async getOrUploadImage(uri: string, prefix: string): Promise<string> {
    // Check if it's already a Cloudinary URL
    if (uri.includes('cloudinary.com')) {
      // Extract public_id from URL
      const matches = uri.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      return matches ? matches[1] : uri;
    }

    // Upload the image
    const result = await this.uploadImage(uri, `transformations/${prefix}`);
    return result.public_id;
  }

  /**
   * Prepare image file for upload (React Native specific)
   */
  private async prepareImageFile(uri: string): Promise<Blob | File> {
    // For web
    if (typeof File !== 'undefined') {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    }

    // For React Native
    return {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any;
  }

  /**
   * Generate a thumbnail from video
   */
  getThumbnailUrl(videoPublicId: string): string {
    const { cloud_name } = this.config;
    return `https://res.cloudinary.com/${cloud_name}/video/upload/so_0,du_0.1/${videoPublicId}.jpg`;
  }

  /**
   * Download video to local storage
   */
  async downloadVideo(videoUrl: string): Promise<Blob> {
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error('Failed to download video');
    }
    return await response.blob();
  }
}

// Singleton instance
let cloudinaryInstance: CloudinaryService | null = null;

export const initializeCloudinary = (config: CloudinaryConfig) => {
  cloudinaryInstance = new CloudinaryService(config);
  return cloudinaryInstance;
};

export const getCloudinaryService = (): CloudinaryService => {
  if (!cloudinaryInstance) {
    throw new Error('Cloudinary service not initialized. Call initializeCloudinary first.');
  }
  return cloudinaryInstance;
};

export default CloudinaryService;
