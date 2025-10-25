import { CloudinaryConfig, CloudinaryUploadResult, UploadProgress } from '../types/api';
import { VideoGenerationOptions, TransitionType } from '../types/transformation';

class CloudinaryService {
  private config: CloudinaryConfig;
  private baseUrl: string;

  constructor(config: CloudinaryConfig) {
    this.config = config;
    this.baseUrl = `https://api.cloudinary.com/v1_1/${config.cloud_name}`;
  }

  /**
   * Upload image to Cloudinary with progress tracking
   */
  async uploadImage(
    imageUri: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    } as any);
    formData.append('upload_preset', this.config.upload_preset);
    formData.append('folder', 'transformations');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress({
            loaded: event.loaded,
            total: event.total,
            progress,
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result);
          } catch (error) {
            reject(new Error('Failed to parse upload response'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.open('POST', `${this.baseUrl}/image/upload`);
      xhr.send(formData);
    });
  }

  /**
   * Generate video transformation using Cloudinary's video API
   */
  async generateVideo(
    beforeImageId: string,
    afterImageId: string,
    options: VideoGenerationOptions
  ): Promise<string> {
    const transformations = this.buildVideoTransformations(options);
    
    // Create video URL with transformations
    const videoUrl = `https://res.cloudinary.com/${this.config.cloud_name}/video/upload/${transformations}/${beforeImageId}.mp4`;
    
    // Poll for video generation completion
    return this.pollVideoGeneration(videoUrl);
  }

  /**
   * Generate animated GIF transformation
   */
  async generateGIF(
    beforeImageId: string,
    afterImageId: string,
    options: VideoGenerationOptions
  ): Promise<string> {
    const transformations = this.buildGIFTransformations(beforeImageId, afterImageId, options);
    
    return `https://res.cloudinary.com/${this.config.cloud_name}/image/upload/${transformations}/${beforeImageId}.gif`;
  }

  /**
   * Build video transformation string for Cloudinary
   */
  private buildVideoTransformations(options: VideoGenerationOptions): string {
    const transforms = [];
    
    // Base video settings
    transforms.push('f_mp4');
    transforms.push('vc_auto');
    
    // Quality settings
    switch (options.quality) {
      case 'low':
        transforms.push('q_60,br_500k');
        break;
      case 'medium':
        transforms.push('q_80,br_1000k');
        break;
      case 'high':
        transforms.push('q_95,br_2000k');
        break;
      default:
        transforms.push('q_auto');
    }
    
    // Duration
    transforms.push(`du_${options.duration_seconds}`);
    
    return transforms.join(',');
  }

  /**
   * Build GIF transformation string with crossfade effect
   */
  private buildGIFTransformations(
    beforeImageId: string,
    afterImageId: string,
    options: VideoGenerationOptions
  ): string {
    const transforms = [];
    
    // Create animated GIF with crossfade
    transforms.push('f_gif');
    transforms.push('fl_animated');
    transforms.push(`du_${options.duration_seconds}`);
    transforms.push('fps_10');
    
    // Add overlay with fade effect
    transforms.push(`l_${afterImageId}`);
    transforms.push('fl_layer_apply');
    transforms.push('e_fade:1000');
    
    return transforms.join(',');
  }

  /**
   * Poll for video generation completion
   */
  private async pollVideoGeneration(
    videoUrl: string,
    maxAttempts: number = 30,
    interval: number = 2000
  ): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(videoUrl, { method: 'HEAD' });
        if (response.ok) {
          return videoUrl;
        }
      } catch (error) {
        // Continue polling
      }
      
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('Video generation timed out');
  }

  /**
   * Get optimized image URL for preview
   */
  getOptimizedImageUrl(publicId: string, width: number = 400, height: number = 400): string {
    return `https://res.cloudinary.com/${this.config.cloud_name}/image/upload/w_${width},h_${height},c_fill,f_auto,q_auto/${publicId}`;
  }

  /**
   * Delete resource from Cloudinary
   */
  async deleteResource(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = this.generateSignature({ public_id: publicId, timestamp });

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', this.config.api_key);
    formData.append('signature', signature);

    const response = await fetch(`${this.baseUrl}/${resourceType}/destroy`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to delete resource');
    }
  }

  /**
   * Generate signature for authenticated requests
   */
  private generateSignature(params: Record<string, any>): string {
    // Note: In production, signature generation should be done on the backend
    // This is a simplified version for demonstration
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    return `${sortedParams}${this.config.api_secret}`;
  }
}

export default CloudinaryService;