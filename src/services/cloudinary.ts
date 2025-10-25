import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResult, CloudinaryTransformationResult } from '@/types/transformation';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.EXPO_PUBLIC_CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Upload image to Cloudinary
   */
  static async uploadImage(
    imageUri: string,
    folder: string = 'transformations'
  ): Promise<CloudinaryUploadResult> {
    try {
      const result = await cloudinary.uploader.upload(imageUri, {
        folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
      });

      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  /**
   * Generate video transformation with effects
   */
  static async generateVideoTransformation(
    beforeImageUrl: string,
    afterImageUrl: string,
    transitionType: string = 'crossfade',
    duration: number = 3
  ): Promise<CloudinaryTransformationResult> {
    try {
      // Create transformation URL for video generation
      const transformationUrl = cloudinary.url('video_transformation', {
        resource_type: 'video',
        transformation: [
          {
            width: 1080,
            height: 1080,
            crop: 'fill',
            quality: 'auto',
            fetch_format: 'auto',
          },
          {
            overlay: beforeImageUrl.split('/').pop()?.split('.')[0],
            width: '1.0',
            height: '1.0',
            crop: 'fill',
            gravity: 'center',
          },
          {
            overlay: afterImageUrl.split('/').pop()?.split('.')[0],
            width: '1.0',
            height: '1.0',
            crop: 'fill',
            gravity: 'center',
            effect: `${transitionType}_transition:${duration}`,
          },
        ],
      });

      // For now, return a placeholder - in production, you'd poll for completion
      return {
        public_id: 'video_transformation',
        secure_url: transformationUrl,
        format: 'mp4',
        duration,
      };
    } catch (error) {
      console.error('Cloudinary video generation error:', error);
      throw new Error('Failed to generate video transformation');
    }
  }

  /**
   * Generate animated GIF from images
   */
  static async generateGifTransformation(
    beforeImageUrl: string,
    afterImageUrl: string,
    transitionType: string = 'crossfade',
    duration: number = 2
  ): Promise<CloudinaryTransformationResult> {
    try {
      const gifUrl = cloudinary.url('gif_transformation', {
        resource_type: 'image',
        format: 'gif',
        transformation: [
          {
            width: 1080,
            height: 1080,
            crop: 'fill',
            quality: 'auto',
          },
          {
            overlay: beforeImageUrl.split('/').pop()?.split('.')[0],
            width: '1.0',
            height: '1.0',
            crop: 'fill',
            gravity: 'center',
          },
          {
            overlay: afterImageUrl.split('/').pop()?.split('.')[0],
            width: '1.0',
            height: '1.0',
            crop: 'fill',
            gravity: 'center',
            effect: `${transitionType}_transition:${duration}`,
          },
        ],
      });

      return {
        public_id: 'gif_transformation',
        secure_url: gifUrl,
        format: 'gif',
        duration,
      };
    } catch (error) {
      console.error('Cloudinary GIF generation error:', error);
      throw new Error('Failed to generate GIF transformation');
    }
  }

  /**
   * Poll for video generation completion
   */
  static async pollVideoGeneration(
    publicId: string,
    maxAttempts: number = 30,
    intervalMs: number = 2000
  ): Promise<CloudinaryTransformationResult> {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        const result = await cloudinary.api.resource(publicId, {
          resource_type: 'video',
        });

        if (result.status === 'complete') {
          return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            duration: result.duration,
          };
        }

        await new Promise(resolve => setTimeout(resolve, intervalMs));
        attempts++;
      } catch (error) {
        if (attempts >= maxAttempts - 1) {
          throw new Error('Video generation timeout');
        }
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        attempts++;
      }
    }

    throw new Error('Video generation timeout');
  }
}