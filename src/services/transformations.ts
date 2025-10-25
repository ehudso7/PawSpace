import { 
  Transformation, 
  CreateTransformationData, 
  DraftData,
  VideoGenerationProgress,
  TransitionType 
} from '@/types/transformation';
import { CloudinaryService } from './cloudinary';
import { GifGenerator } from './gifGenerator';

export class TransformationsService {
  private static baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.example.com';

  /**
   * Create a new transformation and post to feed
   */
  static async createTransformation(
    data: CreateTransformationData
  ): Promise<Transformation> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create transformation error:', error);
      throw new Error('Failed to create transformation');
    }
  }

  /**
   * Save transformation as draft
   */
  static async saveDraft(data: DraftData): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Save draft error:', error);
      throw new Error('Failed to save draft');
    }
  }

  /**
   * Get user's transformations
   */
  static async getMyTransformations(): Promise<Transformation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/my`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get transformations error:', error);
      throw new Error('Failed to fetch transformations');
    }
  }

  /**
   * Delete transformation
   */
  static async deleteTransformation(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete transformation error:', error);
      throw new Error('Failed to delete transformation');
    }
  }

  /**
   * Share transformation to social media
   */
  static async shareToSocial(
    transformationId: string, 
    platform: 'instagram' | 'tiktok'
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${transformationId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ platform }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Share to social error:', error);
      throw new Error('Failed to share to social media');
    }
  }

  /**
   * Generate video transformation with progress tracking
   */
  static async generateVideoTransformation(
    beforeImageUri: string,
    afterImageUri: string,
    transitionType: TransitionType = 'crossfade',
    onProgress?: (progress: VideoGenerationProgress) => void
  ): Promise<{ videoUrl?: string; gifUrl?: string }> {
    try {
      // Start with uploading images
      onProgress?.({
        status: 'uploading',
        progress: 10,
        message: 'Uploading images...',
      });

      const beforeUpload = await CloudinaryService.uploadImage(beforeImageUri);
      onProgress?.({
        status: 'uploading',
        progress: 50,
        message: 'Uploading images...',
      });

      const afterUpload = await CloudinaryService.uploadImage(afterImageUri);
      onProgress?.({
        status: 'uploading',
        progress: 100,
        message: 'Images uploaded successfully',
      });

      // Try video generation first
      onProgress?.({
        status: 'processing',
        progress: 20,
        message: 'Generating video transformation...',
      });

      try {
        const videoResult = await CloudinaryService.generateVideoTransformation(
          beforeUpload.secure_url,
          afterUpload.secure_url,
          transitionType
        );

        onProgress?.({
          status: 'completed',
          progress: 100,
          message: 'Video generated successfully',
          videoUrl: videoResult.secure_url,
        });

        return { videoUrl: videoResult.secure_url };
      } catch (videoError) {
        console.warn('Video generation failed, falling back to GIF:', videoError);
        
        // Fallback to GIF generation
        onProgress?.({
          status: 'processing',
          progress: 50,
          message: 'Generating GIF transformation...',
        });

        const gifUrl = await GifGenerator.generateGifWithCloudinary(
          beforeImageUri,
          afterImageUri,
          transitionType
        );

        onProgress?.({
          status: 'completed',
          progress: 100,
          message: 'GIF generated successfully',
          gifUrl,
        });

        return { gifUrl };
      }
    } catch (error) {
      console.error('Video generation error:', error);
      onProgress?.({
        status: 'failed',
        progress: 0,
        message: 'Failed to generate transformation',
      });
      throw error;
    }
  }

  /**
   * Get authentication token (implement based on your auth system)
   */
  private static async getAuthToken(): Promise<string> {
    // This should be implemented based on your authentication system
    // For now, return a placeholder
    return 'your-auth-token-here';
  }
}