import axios from 'axios';
import {
  FeedResponse,
  Transformation,
  Comment,
  ServiceType,
  StoryGroup,
  ReportReason,
} from '../types/feed';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class FeedService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  constructor() {
    // Add auth interceptor
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * Get paginated feed
   */
  async getFeed(page: number = 1, limit: number = 10): Promise<FeedResponse> {
    const response = await this.api.get<FeedResponse>('/feed', {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Get feed filtered by service type
   */
  async getFeedByService(
    serviceType: string,
    page: number = 1,
    limit: number = 10
  ): Promise<FeedResponse> {
    const response = await this.api.get<FeedResponse>('/feed/service', {
      params: { service_type: serviceType, page, limit },
    });
    return response.data;
  }

  /**
   * Get feed for followed users only
   */
  async getFollowingFeed(page: number = 1, limit: number = 10): Promise<FeedResponse> {
    const response = await this.api.get<FeedResponse>('/feed/following', {
      params: { page, limit },
    });
    return response.data;
  }

  /**
   * Search transformations
   */
  async searchTransformations(query: string): Promise<Transformation[]> {
    const response = await this.api.get<Transformation[]>('/feed/search', {
      params: { q: query },
    });
    return response.data;
  }

  /**
   * Get stories
   */
  async getStories(): Promise<StoryGroup[]> {
    const response = await this.api.get<StoryGroup[]>('/stories');
    return response.data;
  }

  /**
   * Mark story as viewed
   */
  async markStoryViewed(storyId: string): Promise<void> {
    await this.api.post(`/stories/${storyId}/view`);
  }

  /**
   * Like transformation
   */
  async likeTransformation(id: string): Promise<void> {
    await this.api.post(`/transformations/${id}/like`);
  }

  /**
   * Unlike transformation
   */
  async unlikeTransformation(id: string): Promise<void> {
    await this.api.delete(`/transformations/${id}/like`);
  }

  /**
   * Get transformation details
   */
  async getTransformation(id: string): Promise<Transformation> {
    const response = await this.api.get<Transformation>(`/transformations/${id}`);
    return response.data;
  }

  /**
   * Get comments for a transformation
   */
  async getComments(transformationId: string): Promise<Comment[]> {
    const response = await this.api.get<Comment[]>(
      `/transformations/${transformationId}/comments`
    );
    return response.data;
  }

  /**
   * Add comment
   */
  async addComment(
    transformationId: string,
    text: string,
    parentCommentId?: string
  ): Promise<Comment> {
    const response = await this.api.post<Comment>(
      `/transformations/${transformationId}/comments`,
      {
        text,
        parent_comment_id: parentCommentId,
      }
    );
    return response.data;
  }

  /**
   * Delete comment
   */
  async deleteComment(commentId: string): Promise<void> {
    await this.api.delete(`/comments/${commentId}`);
  }

  /**
   * Like comment
   */
  async likeComment(commentId: string): Promise<void> {
    await this.api.post(`/comments/${commentId}/like`);
  }

  /**
   * Unlike comment
   */
  async unlikeComment(commentId: string): Promise<void> {
    await this.api.delete(`/comments/${commentId}/like`);
  }

  /**
   * Save transformation (bookmark)
   */
  async saveTransformation(id: string): Promise<void> {
    await this.api.post(`/transformations/${id}/save`);
  }

  /**
   * Unsave transformation
   */
  async unsaveTransformation(id: string): Promise<void> {
    await this.api.delete(`/transformations/${id}/save`);
  }

  /**
   * Get saved transformations
   */
  async getSavedTransformations(): Promise<Transformation[]> {
    const response = await this.api.get<Transformation[]>('/transformations/saved');
    return response.data;
  }

  /**
   * Report transformation
   */
  async reportTransformation(id: string, reason: string, details?: string): Promise<void> {
    await this.api.post(`/transformations/${id}/report`, {
      reason,
      details,
    });
  }

  /**
   * Get report reasons
   */
  async getReportReasons(): Promise<ReportReason[]> {
    const response = await this.api.get<ReportReason[]>('/reports/reasons');
    return response.data;
  }

  /**
   * Follow user
   */
  async followUser(userId: string): Promise<void> {
    await this.api.post(`/users/${userId}/follow`);
  }

  /**
   * Unfollow user
   */
  async unfollowUser(userId: string): Promise<void> {
    await this.api.delete(`/users/${userId}/follow`);
  }

  /**
   * Share transformation (track sharing)
   */
  async shareTransformation(id: string, platform?: string): Promise<void> {
    await this.api.post(`/transformations/${id}/share`, { platform });
  }
}

export const feedService = new FeedService();
export default feedService;
