import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

export interface VideoParams {
  beforeImageUrl: string;
  afterImageUrl: string;
  transition: TransitionType;
  duration: number; // seconds
  textOverlays: TextOverlay[];
  audioTrack?: string;
  fps: number;
}

export interface TextOverlay {
  text: string;
  position: 'top' | 'center' | 'bottom';
  fontSize: number;
  color: string;
  fontFamily: string;
  startTime: number;
  endTime: number;
}

export type TransitionType = 'fade' | 'slide' | 'zoom' | 'dissolve' | 'wipe';

export interface Effect {
  type: 'blur' | 'brightness' | 'contrast' | 'saturation' | 'vintage' | 'sepia';
  intensity: number;
  duration?: number;
}

class CloudinaryService {
  private config: CloudinaryConfig;

  constructor(config: CloudinaryConfig) {
    this.config = config;
    cloudinary.config({
      cloud_name: config.cloud_name,
      api_key: config.api_key,
      api_secret: config.api_secret,
    });
  }

  /**
   * Upload an image to Cloudinary
   */
  async uploadImage(uri: string, folder: string = 'pawspace'): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(uri, {
        folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
      });
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Generate transformation video from before/after images
   */
  async createTransformationVideo(params: VideoParams): Promise<string> {
    try {
      const {
        beforeImageUrl,
        afterImageUrl,
        transition,
        duration,
        textOverlays,
        audioTrack,
        fps,
      } = params;

      // Upload images first
      const beforePublicId = await this.uploadImageToCloudinary(beforeImageUrl);
      const afterPublicId = await this.uploadImageToCloudinary(afterImageUrl);

      // Build transformation URL
      const transformations = this.buildVideoTransformations({
        beforePublicId,
        afterPublicId,
        transition,
        duration,
        textOverlays,
        audioTrack,
        fps,
      });

      const videoUrl = `https://res.cloudinary.com/${this.config.cloud_name}/video/upload/${transformations}`;
      
      return videoUrl;
    } catch (error) {
      console.error('Error creating transformation video:', error);
      throw new Error('Failed to create transformation video');
    }
  }

  /**
   * Apply effects to a video
   */
  async applyEffects(publicId: string, effects: Effect[]): Promise<string> {
    try {
      const effectTransformations = effects.map(effect => {
        switch (effect.type) {
          case 'blur':
            return `e_blur:${effect.intensity}`;
          case 'brightness':
            return `e_brightness:${effect.intensity}`;
          case 'contrast':
            return `e_contrast:${effect.intensity}`;
          case 'saturation':
            return `e_saturation:${effect.intensity}`;
          case 'vintage':
            return 'e_vintage';
          case 'sepia':
            return 'e_sepia';
          default:
            return '';
        }
      }).filter(Boolean).join('/');

      const videoUrl = `https://res.cloudinary.com/${this.config.cloud_name}/video/upload/${effectTransformations}/${publicId}`;
      return videoUrl;
    } catch (error) {
      console.error('Error applying effects:', error);
      throw new Error('Failed to apply effects');
    }
  }

  /**
   * Generate video thumbnail
   */
  async generateThumbnail(videoUrl: string, timeOffset: number = 0): Promise<string> {
    try {
      const publicId = this.extractPublicId(videoUrl);
      const thumbnailUrl = `https://res.cloudinary.com/${this.config.cloud_name}/video/upload/so_${timeOffset}/${publicId}.jpg`;
      return thumbnailUrl;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      throw new Error('Failed to generate thumbnail');
    }
  }

  /**
   * Get video information
   */
  async getVideoInfo(publicId: string) {
    try {
      const result = await cloudinary.api.resource(publicId, {
        resource_type: 'video',
      });
      return result;
    } catch (error) {
      console.error('Error getting video info:', error);
      throw new Error('Failed to get video information');
    }
  }

  private async uploadImageToCloudinary(imageUrl: string): Promise<string> {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'pawspace/transformations',
      resource_type: 'image',
    });
    return result.public_id;
  }

  private buildVideoTransformations(params: {
    beforePublicId: string;
    afterPublicId: string;
    transition: TransitionType;
    duration: number;
    textOverlays: TextOverlay[];
    audioTrack?: string;
    fps: number;
  }): string {
    const {
      beforePublicId,
      afterPublicId,
      transition,
      duration,
      textOverlays,
      audioTrack,
      fps,
    } = params;

    const transformations = [];

    // Set video format and quality
    transformations.push('f_mp4,q_auto');

    // Set FPS
    transformations.push(`fps_${fps}`);

    // Set duration
    transformations.push(`du_${duration}`);

    // Add transition effect
    const transitionEffect = this.getTransitionEffect(transition, duration);
    if (transitionEffect) {
      transformations.push(transitionEffect);
    }

    // Add text overlays
    textOverlays.forEach((overlay, index) => {
      const textTransform = this.buildTextOverlay(overlay, index);
      if (textTransform) {
        transformations.push(textTransform);
      }
    });

    // Add audio track if provided
    if (audioTrack) {
      transformations.push(`l_${audioTrack},so_0`);
    }

    // Combine before and after images
    transformations.push(`l_${beforePublicId},so_0`);
    transformations.push(`l_${afterPublicId},so_${duration / 2}`);

    return transformations.join('/');
  }

  private getTransitionEffect(transition: TransitionType, duration: number): string {
    switch (transition) {
      case 'fade':
        return `e_transition:fade:duration_${duration}`;
      case 'slide':
        return `e_transition:slide:duration_${duration}`;
      case 'zoom':
        return `e_transition:zoom:duration_${duration}`;
      case 'dissolve':
        return `e_transition:dissolve:duration_${duration}`;
      case 'wipe':
        return `e_transition:wipe:duration_${duration}`;
      default:
        return `e_transition:fade:duration_${duration}`;
    }
  }

  private buildTextOverlay(overlay: TextOverlay, index: number): string {
    const {
      text,
      position,
      fontSize,
      color,
      fontFamily,
      startTime,
      endTime,
    } = overlay;

    const positionMap = {
      top: 'g_north',
      center: 'g_center',
      bottom: 'g_south',
    };

    return `l_text:${fontFamily}_${fontSize}:${encodeURIComponent(text)},co_${color},${positionMap[position]},so_${startTime},eo_${endTime}`;
  }

  private extractPublicId(url: string): string {
    const match = url.match(/\/upload\/(.+?)(?:\.[^.]+)?$/);
    return match ? match[1] : '';
  }
}

export default CloudinaryService;