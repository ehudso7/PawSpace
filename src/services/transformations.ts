/**
 * Transformations Service
 * Handles CRUD operations for user transformations
 */

import type {
  Transformation,
  CreateTransformationData,
  DraftData,
  TransformationDraft,
  SharePlatform,
} from '../types/transformation';

// API base URL - configure based on your backend
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.pawspace.com';

export class TransformationsService {
  private static instance: TransformationsService;
  private authToken: string | null = null;

  static getInstance(): TransformationsService {
    if (!TransformationsService.instance) {
      TransformationsService.instance = new TransformationsService();
    }
    return TransformationsService.instance;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Get headers with auth
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
    };
  }

  /**
   * Post transformation to feed
   */
  async createTransformation(data: CreateTransformationData): Promise<Transformation> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transformations`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create transformation');
      }

      return await response.json();
    } catch (error) {
      console.error('Create transformation error:', error);
      throw new Error('Failed to post transformation');
    }
  }

  /**
   * Save draft transformation
   */
  async saveDraft(data: DraftData): Promise<TransformationDraft> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transformations/drafts`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save draft');
      }

      return await response.json();
    } catch (error) {
      console.error('Save draft error:', error);
      throw new Error('Failed to save draft');
    }
  }

  /**
   * Get my transformations
   */
  async getMyTransformations(page: number = 1, limit: number = 20): Promise<{
    transformations: Transformation[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/transformations/me?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch transformations');
      }

      return await response.json();
    } catch (error) {
      console.error('Get transformations error:', error);
      throw new Error('Failed to load transformations');
    }
  }

  /**
   * Get public feed transformations
   */
  async getFeedTransformations(page: number = 1, limit: number = 20): Promise<{
    transformations: Transformation[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/transformations/feed?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }

      return await response.json();
    } catch (error) {
      console.error('Get feed error:', error);
      throw new Error('Failed to load feed');
    }
  }

  /**
   * Get single transformation by ID
   */
  async getTransformation(id: string): Promise<Transformation> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transformations/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Transformation not found');
      }

      return await response.json();
    } catch (error) {
      console.error('Get transformation error:', error);
      throw new Error('Failed to load transformation');
    }
  }

  /**
   * Update transformation
   */
  async updateTransformation(
    id: string,
    updates: Partial<CreateTransformationData>
  ): Promise<Transformation> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transformations/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update transformation');
      }

      return await response.json();
    } catch (error) {
      console.error('Update transformation error:', error);
      throw new Error('Failed to update transformation');
    }
  }

  /**
   * Delete transformation
   */
  async deleteTransformation(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transformations/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete transformation');
      }
    } catch (error) {
      console.error('Delete transformation error:', error);
      throw new Error('Failed to delete transformation');
    }
  }

  /**
   * Like transformation
   */
  async likeTransformation(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transformations/${id}/like`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to like transformation');
      }
    } catch (error) {
      console.error('Like transformation error:', error);
      throw error;
    }
  }

  /**
   * Unlike transformation
   */
  async unlikeTransformation(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transformations/${id}/unlike`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to unlike transformation');
      }
    } catch (error) {
      console.error('Unlike transformation error:', error);
      throw error;
    }
  }

  /**
   * Increment share count
   */
  async shareToSocial(transformationId: string, platform: SharePlatform): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/transformations/${transformationId}/share`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({ platform }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to record share');
      }
    } catch (error) {
      console.error('Share tracking error:', error);
      // Non-critical - don't throw
    }
  }

  /**
   * Get drafts
   */
  async getDrafts(): Promise<TransformationDraft[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transformations/drafts`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch drafts');
      }

      return await response.json();
    } catch (error) {
      console.error('Get drafts error:', error);
      return [];
    }
  }

  /**
   * Delete draft
   */
  async deleteDraft(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/transformations/drafts/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete draft');
      }
    } catch (error) {
      console.error('Delete draft error:', error);
      throw error;
    }
  }
}

export const transformationsService = TransformationsService.getInstance();
