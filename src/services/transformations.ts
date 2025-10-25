import {
  Transformation,
  CreateTransformationData,
  DraftData,
  SocialPlatform,
  VideoGenerationProgress,
  VideoGenerationOptions,
  ExportResult,
} from '../types/transformation';
import { ApiResponse, PaginatedResponse } from '../types/api';
import CloudinaryService from './cloudinary';

class TransformationsService {
  private baseUrl: string;
  private cloudinary: CloudinaryService;

  constructor(baseUrl: string, cloudinaryService: CloudinaryService) {
    this.baseUrl = baseUrl;
    this.cloudinary = cloudinaryService;
  }

  /**
   * Create and post transformation to feed
   */
  async createTransformation(data: CreateTransformationData): Promise<Transformation> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<Transformation> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create transformation');
      }

      return result.data;
    } catch (error) {
      console.error('Error creating transformation:', error);
      throw error;
    }
  }

  /**
   * Generate video/GIF from before/after images with progress tracking
   */
  async generateTransformationMedia(
    beforeImageUri: string,
    afterImageUri: string,
    options: VideoGenerationOptions,
    onProgress?: (progress: VideoGenerationProgress) => void
  ): Promise<ExportResult> {
    try {
      // Stage 1: Upload images
      onProgress?.({
        stage: 'uploading',
        progress: 0,
        message: 'Uploading images...',
        estimated_time_remaining: 30,
      });

      const beforeUpload = await this.cloudinary.uploadImage(beforeImageUri, (uploadProgress) => {
        onProgress?.({
          stage: 'uploading',
          progress: uploadProgress.progress * 0.4, // 40% for before image
          message: 'Uploading before image...',
        });
      });

      const afterUpload = await this.cloudinary.uploadImage(afterImageUri, (uploadProgress) => {
        onProgress?.({
          stage: 'uploading',
          progress: 40 + (uploadProgress.progress * 0.4), // 40% for after image
          message: 'Uploading after image...',
        });
      });

      onProgress?.({
        stage: 'uploading',
        progress: 80,
        message: 'Images uploaded successfully',
      });

      // Stage 2: Generate media
      onProgress?.({
        stage: 'generating',
        progress: 85,
        message: `Creating ${options.format}...`,
        estimated_time_remaining: options.format === 'video' ? 45 : 15,
      });

      let mediaUrl: string;
      
      if (options.format === 'video') {
        mediaUrl = await this.cloudinary.generateVideo(
          beforeUpload.public_id,
          afterUpload.public_id,
          options
        );
      } else {
        mediaUrl = await this.cloudinary.generateGIF(
          beforeUpload.public_id,
          afterUpload.public_id,
          options
        );
      }

      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: `${options.format.toUpperCase()} created successfully!`,
      });

      return {
        success: true,
        url: mediaUrl,
        format: options.format,
      };

    } catch (error) {
      console.error('Error generating transformation media:', error);
      
      onProgress?.({
        stage: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Generation failed',
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        format: options.format,
      };
    }
  }

  /**
   * Save transformation as draft
   */
  async saveDraft(data: DraftData): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      throw error;
    }
  }

  /**
   * Get user's transformations
   */
  async getMyTransformations(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Transformation>> {
    try {
      const response = await fetch(
        `${this.baseUrl}/transformations/me?page=${page}&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${await this.getAuthToken()}`,
          },
        }
      );

      const result: ApiResponse<PaginatedResponse<Transformation>> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to fetch transformations');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching transformations:', error);
      throw error;
    }
  }

  /**
   * Delete transformation
   */
  async deleteTransformation(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete transformation');
      }
    } catch (error) {
      console.error('Error deleting transformation:', error);
      throw error;
    }
  }

  /**
   * Share transformation to social media platform
   */
  async shareToSocial(
    transformationId: string,
    platform: SocialPlatform,
    customCaption?: string
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${transformationId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          platform,
          custom_caption: customCaption,
        }),
      });

      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to share transformation');
      }
    } catch (error) {
      console.error('Error sharing transformation:', error);
      throw error;
    }
  }

  /**
   * Get transformation by ID
   */
  async getTransformation(id: string): Promise<Transformation> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${id}`, {
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      const result: ApiResponse<Transformation> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Transformation not found');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching transformation:', error);
      throw error;
    }
  }

  /**
   * Like/unlike transformation
   */
  async toggleLike(id: string): Promise<{ liked: boolean; likes_count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      const result: ApiResponse<{ liked: boolean; likes_count: number }> = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to toggle like');
      }

      return result.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  /**
   * Get auth token (implement based on your auth system)
   */
  private async getAuthToken(): Promise<string> {
    // This should be implemented based on your authentication system
    // For now, returning a placeholder
    return 'your-auth-token';
  }
}

export default TransformationsService;