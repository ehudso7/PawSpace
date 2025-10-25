/**
 * API Service for PawSpace Backend
 * Handles video publishing to PawSpace platform
 */

import { PublishOptions, VideoMetadata } from '../types/video.types';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.pawspace.com';

interface PublishResponse {
  success: boolean;
  postId: string;
  url: string;
  message: string;
}

interface UploadProgressCallback {
  (progress: number): void;
}

class PawSpaceAPI {
  private authToken: string | null = null;

  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Publish video to PawSpace
   */
  async publishVideo(
    videoUrl: string,
    options: PublishOptions,
    onProgress?: UploadProgressCallback
  ): Promise<PublishResponse> {
    if (!this.authToken) {
      throw new Error('Not authenticated. Please log in first.');
    }

    try {
      const formData = new FormData();
      formData.append('video_url', videoUrl);
      formData.append('caption', options.caption);
      formData.append('hashtags', JSON.stringify(options.hashtags));
      formData.append('is_private', String(options.isPrivate));

      if (options.serviceTag) {
        formData.append('service_tag', options.serviceTag);
      }

      if (options.provider) {
        formData.append('provider', JSON.stringify(options.provider));
      }

      const response = await fetch(`${API_BASE_URL}/v1/posts/video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to publish video');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Publish video error:', error);
      throw error;
    }
  }

  /**
   * Get user's video posts
   */
  async getVideoPosts(userId: string): Promise<VideoMetadata[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/users/${userId}/videos`,
        {
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      return await response.json();
    } catch (error) {
      console.error('Get videos error:', error);
      throw error;
    }
  }

  /**
   * Delete a video post
   */
  async deleteVideoPost(postId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Delete video error:', error);
      throw error;
    }
  }

  /**
   * Update video post privacy
   */
  async updatePrivacy(postId: string, isPrivate: boolean): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/posts/${postId}/privacy`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_private: isPrivate }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Update privacy error:', error);
      throw error;
    }
  }
}

// Singleton instance
let apiInstance: PawSpaceAPI | null = null;

export const getPawSpaceAPI = (): PawSpaceAPI => {
  if (!apiInstance) {
    apiInstance = new PawSpaceAPI();
  }
  return apiInstance;
};

export default PawSpaceAPI;
