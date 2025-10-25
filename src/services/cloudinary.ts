import { v2 as cloudinary } from 'cloudinary';
import {
  CloudinaryConfig,
  VideoParams,
  Effect,
  VideoGenerationResult,
  TransitionType,
  TextOverlay
} from '../types';

class CloudinaryService {
  private config: CloudinaryConfig;
  private isConfigured = false;

  constructor(config: CloudinaryConfig) {
    this.config = config;
    this.configure();
  }

  private configure() {
    cloudinary.config({
      cloud_name: this.config.cloud_name,
      api_key: this.config.api_key,
      api_secret: this.config.api_secret,
      secure: true
    });
    this.isConfigured = true;
  }

  /**
   * Upload image to Cloudinary
   */
  async uploadImage(uri: string, folder: string = 'pawspace/images'): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const result = await cloudinary.uploader.upload(uri, {
        folder,
        resource_type: 'image',
        quality: 'auto',
        format: 'jpg'
      });

      return result.public_id;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Generate transformation video from before/after images
   */
  async createTransformationVideo(params: VideoParams): Promise<VideoGenerationResult> {
    if (!this.isConfigured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      // Upload images if they're local URIs
      const beforePublicId = params.beforeImageUrl.startsWith('http') 
        ? this.extractPublicId(params.beforeImageUrl)
        : await this.uploadImage(params.beforeImageUrl, 'pawspace/before');

      const afterPublicId = params.afterImageUrl.startsWith('http')
        ? this.extractPublicId(params.afterImageUrl) 
        : await this.uploadImage(params.afterImageUrl, 'pawspace/after');

      // Build transformation chain
      const transformations = this.buildVideoTransformations(
        beforePublicId,
        afterPublicId,
        params
      );

      // Generate video URL
      const videoUrl = cloudinary.url(`${beforePublicId}.mp4`, {
        resource_type: 'video',
        transformation: transformations
      });

      // Create the video by triggering the transformation
      const result = await this.generateVideo(beforePublicId, transformations);

      return {
        videoUrl,
        publicId: result.public_id,
        duration: params.duration,
        format: 'mp4',
        bytes: result.bytes || 0
      };
    } catch (error) {
      console.error('Error creating transformation video:', error);
      throw new Error('Failed to create transformation video');
    }
  }

  /**
   * Apply effects to existing video
   */
  async applyEffects(publicId: string, effects: Effect[]): Promise<string> {
    if (!this.isConfigured) {
      throw new Error('Cloudinary not configured');
    }

    try {
      const effectTransformations = effects.map(effect => 
        this.buildEffectTransformation(effect)
      );

      const videoUrl = cloudinary.url(`${publicId}.mp4`, {
        resource_type: 'video',
        transformation: effectTransformations
      });

      return videoUrl;
    } catch (error) {
      console.error('Error applying effects:', error);
      throw new Error('Failed to apply effects to video');
    }
  }

  /**
   * Download video for local storage
   */
  async downloadVideo(publicId: string): Promise<string> {
    const videoUrl = cloudinary.url(`${publicId}.mp4`, {
      resource_type: 'video',
      quality: 'auto'
    });

    return videoUrl;
  }

  private buildVideoTransformations(
    beforePublicId: string,
    afterPublicId: string,
    params: VideoParams
  ): any[] {
    const transformations: any[] = [];

    // Base video settings
    transformations.push({
      width: 1080,
      height: 1920, // 9:16 aspect ratio for social media
      crop: 'fill',
      quality: 'auto',
      format: 'mp4'
    });

    // Add before image as first frame
    transformations.push({
      overlay: beforePublicId,
      width: 1080,
      height: 1920,
      crop: 'fill',
      start_offset: 0,
      end_offset: params.duration / 2
    });

    // Add transition effect
    const transitionEffect = this.buildTransitionEffect(params.transition, params.duration / 2);
    if (transitionEffect) {
      transformations.push(transitionEffect);
    }

    // Add after image as second frame
    transformations.push({
      overlay: afterPublicId,
      width: 1080,
      height: 1920,
      crop: 'fill',
      start_offset: params.duration / 2,
      end_offset: params.duration
    });

    // Add text overlays
    params.textOverlays.forEach(overlay => {
      transformations.push(this.buildTextOverlay(overlay));
    });

    // Set video duration and fps
    transformations.push({
      duration: params.duration,
      fps: params.fps
    });

    return transformations;
  }

  private buildTransitionEffect(transition: TransitionType, startTime: number): any {
    const effects: Record<TransitionType, any> = {
      fade: { effect: 'fade', duration: 1.0 },
      slide_left: { effect: 'slide', angle: 0 },
      slide_right: { effect: 'slide', angle: 180 },
      slide_up: { effect: 'slide', angle: 90 },
      slide_down: { effect: 'slide', angle: 270 },
      zoom_in: { effect: 'zoom', mode: 'in' },
      zoom_out: { effect: 'zoom', mode: 'out' },
      dissolve: { effect: 'dissolve' },
      wipe_left: { effect: 'wipe', angle: 0 },
      wipe_right: { effect: 'wipe', angle: 180 }
    };

    const effect = effects[transition];
    return effect ? { ...effect, start_offset: startTime } : null;
  }

  private buildTextOverlay(overlay: TextOverlay): any {
    return {
      overlay: {
        text: overlay.text,
        font_family: overlay.style.fontFamily,
        font_size: overlay.style.fontSize,
        font_weight: overlay.style.bold ? 'bold' : 'normal',
        font_style: overlay.style.italic ? 'italic' : 'normal',
        color: overlay.style.color.replace('#', ''),
        background: overlay.style.backgroundColor?.replace('#', '')
      },
      gravity: 'north_west',
      x: `${overlay.position.x}%`,
      y: `${overlay.position.y}%`,
      start_offset: overlay.startTime,
      end_offset: overlay.startTime + overlay.duration
    };
  }

  private buildEffectTransformation(effect: Effect): any {
    const effects: Record<string, (intensity: number) => any> = {
      blur: (intensity) => ({ effect: `blur:${intensity * 100}` }),
      brightness: (intensity) => ({ effect: `brightness:${intensity * 100}` }),
      contrast: (intensity) => ({ effect: `contrast:${intensity * 100}` }),
      saturation: (intensity) => ({ effect: `saturation:${intensity * 100}` }),
      sepia: (intensity) => ({ effect: `sepia:${intensity * 100}` }),
      grayscale: () => ({ effect: 'grayscale' }),
      vignette: (intensity) => ({ effect: `vignette:${intensity * 100}` })
    };

    const transformation = effects[effect.type]?.(effect.intensity);
    
    if (effect.startTime !== undefined && effect.duration !== undefined) {
      return {
        ...transformation,
        start_offset: effect.startTime,
        end_offset: effect.startTime + effect.duration
      };
    }

    return transformation;
  }

  private async generateVideo(publicId: string, transformations: any[]): Promise<any> {
    // This would typically involve calling Cloudinary's video generation API
    // For now, we'll simulate the response
    return {
      public_id: `pawspace/videos/${publicId}_transformed`,
      bytes: 1024 * 1024 * 5, // 5MB
      duration: 3.0,
      format: 'mp4'
    };
  }

  private extractPublicId(url: string): string {
    // Extract public ID from Cloudinary URL
    const match = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|mp4|webm)/);
    return match ? match[1] : url;
  }
}

// Singleton instance
let cloudinaryService: CloudinaryService | null = null;

export const initializeCloudinary = (config: CloudinaryConfig): CloudinaryService => {
  if (!cloudinaryService) {
    cloudinaryService = new CloudinaryService(config);
  }
  return cloudinaryService;
};

export const getCloudinaryService = (): CloudinaryService => {
  if (!cloudinaryService) {
    throw new Error('Cloudinary service not initialized. Call initializeCloudinary first.');
  }
  return cloudinaryService;
};

export default CloudinaryService;