import { apiClient } from './api';
import {
  FeedResponse,
  Transformation,
  Comment,
  Story,
  ServiceType,
  SearchResult,
  FeedFilter,
  ReportReason,
  UserProfile,
} from '../types';

class FeedService {
  // Feed operations
  async getFeed(page: number = 1, limit: number = 20): Promise<FeedResponse> {
    return apiClient.get<FeedResponse>('/feed', { page, limit });
  }

  async getFeedByService(serviceType: string, page: number = 1, limit: number = 20): Promise<FeedResponse> {
    return apiClient.get<FeedResponse>('/feed/service', { 
      service_type: serviceType, 
      page, 
      limit 
    });
  }

  async getFeedByUser(userId: string, page: number = 1, limit: number = 20): Promise<FeedResponse> {
    return apiClient.get<FeedResponse>(`/users/${userId}/transformations`, { page, limit });
  }

  async getFilteredFeed(filter: FeedFilter, page: number = 1, limit: number = 20): Promise<FeedResponse> {
    return apiClient.post<FeedResponse>('/feed/filter', { 
      filter, 
      page, 
      limit 
    });
  }

  // Search operations
  async searchTransformations(query: string, page: number = 1, limit: number = 20): Promise<SearchResult> {
    return apiClient.get<SearchResult>('/search', { 
      q: query, 
      type: 'transformations',
      page, 
      limit 
    });
  }

  async searchUsers(query: string, page: number = 1, limit: number = 20): Promise<SearchResult> {
    return apiClient.get<SearchResult>('/search', { 
      q: query, 
      type: 'users',
      page, 
      limit 
    });
  }

  async searchAll(query: string, page: number = 1, limit: number = 20): Promise<SearchResult> {
    return apiClient.get<SearchResult>('/search', { 
      q: query, 
      type: 'all',
      page, 
      limit 
    });
  }

  // Like operations with optimistic updates
  async likeTransformation(transformationId: string): Promise<void> {
    return apiClient.post(`/transformations/${transformationId}/like`);
  }

  async unlikeTransformation(transformationId: string): Promise<void> {
    return apiClient.delete(`/transformations/${transformationId}/like`);
  }

  // Comment operations
  async getComments(transformationId: string, page: number = 1, limit: number = 50): Promise<{
    comments: Comment[];
    has_more: boolean;
    next_page: number | null;
  }> {
    return apiClient.get(`/transformations/${transformationId}/comments`, { page, limit });
  }

  async addComment(transformationId: string, text: string, parentCommentId?: string): Promise<Comment> {
    return apiClient.post(`/transformations/${transformationId}/comments`, {
      text,
      parent_comment_id: parentCommentId,
    });
  }

  async deleteComment(commentId: string): Promise<void> {
    return apiClient.delete(`/comments/${commentId}`);
  }

  async likeComment(commentId: string): Promise<void> {
    return apiClient.post(`/comments/${commentId}/like`);
  }

  async unlikeComment(commentId: string): Promise<void> {
    return apiClient.delete(`/comments/${commentId}/like`);
  }

  // Save/bookmark operations
  async saveTransformation(transformationId: string): Promise<void> {
    return apiClient.post(`/transformations/${transformationId}/save`);
  }

  async unsaveTransformation(transformationId: string): Promise<void> {
    return apiClient.delete(`/transformations/${transformationId}/save`);
  }

  async getSavedTransformations(page: number = 1, limit: number = 20): Promise<FeedResponse> {
    return apiClient.get('/user/saved-transformations', { page, limit });
  }

  // Follow operations
  async followUser(userId: string): Promise<void> {
    return apiClient.post(`/users/${userId}/follow`);
  }

  async unfollowUser(userId: string): Promise<void> {
    return apiClient.delete(`/users/${userId}/follow`);
  }

  async getFollowing(userId: string, page: number = 1, limit: number = 50): Promise<{
    users: UserProfile[];
    has_more: boolean;
    next_page: number | null;
  }> {
    return apiClient.get(`/users/${userId}/following`, { page, limit });
  }

  async getFollowers(userId: string, page: number = 1, limit: number = 50): Promise<{
    users: UserProfile[];
    has_more: boolean;
    next_page: number | null;
  }> {
    return apiClient.get(`/users/${userId}/followers`, { page, limit });
  }

  // Share operations
  async shareTransformation(transformationId: string, platform?: string): Promise<{ share_url: string }> {
    return apiClient.post(`/transformations/${transformationId}/share`, { platform });
  }

  // Report operations
  async getReportReasons(): Promise<ReportReason[]> {
    return apiClient.get('/report-reasons');
  }

  async reportTransformation(transformationId: string, reasonId: string, details?: string): Promise<void> {
    return apiClient.post(`/transformations/${transformationId}/report`, {
      reason_id: reasonId,
      details,
    });
  }

  async reportUser(userId: string, reasonId: string, details?: string): Promise<void> {
    return apiClient.post(`/users/${userId}/report`, {
      reason_id: reasonId,
      details,
    });
  }

  async reportComment(commentId: string, reasonId: string, details?: string): Promise<void> {
    return apiClient.post(`/comments/${commentId}/report`, {
      reason_id: reasonId,
      details,
    });
  }

  // Stories operations
  async getStories(): Promise<Story[]> {
    return apiClient.get('/stories');
  }

  async getUserStories(userId: string): Promise<Story[]> {
    return apiClient.get(`/users/${userId}/stories`);
  }

  async markStoryAsViewed(storyId: string): Promise<void> {
    return apiClient.post(`/stories/${storyId}/view`);
  }

  // Service types
  async getServiceTypes(): Promise<ServiceType[]> {
    return apiClient.get('/service-types');
  }

  // Transformation details
  async getTransformation(transformationId: string): Promise<Transformation> {
    return apiClient.get(`/transformations/${transformationId}`);
  }

  // User profile
  async getUserProfile(userId: string): Promise<UserProfile> {
    return apiClient.get(`/users/${userId}`);
  }

  // Trending and recommendations
  async getTrendingTransformations(limit: number = 20): Promise<Transformation[]> {
    return apiClient.get('/feed/trending', { limit });
  }

  async getRecommendedUsers(limit: number = 10): Promise<UserProfile[]> {
    return apiClient.get('/users/recommended', { limit });
  }

  async getRecommendedTransformations(limit: number = 20): Promise<Transformation[]> {
    return apiClient.get('/feed/recommended', { limit });
  }
}

export const feedService = new FeedService();

// Optimistic update helpers
export class OptimisticUpdateManager {
  private pendingUpdates = new Map<string, any>();

  addPendingUpdate(key: string, update: any) {
    this.pendingUpdates.set(key, update);
  }

  removePendingUpdate(key: string) {
    this.pendingUpdates.delete(key);
  }

  hasPendingUpdate(key: string): boolean {
    return this.pendingUpdates.has(key);
  }

  getPendingUpdate(key: string): any {
    return this.pendingUpdates.get(key);
  }

  clear() {
    this.pendingUpdates.clear();
  }
}

export const optimisticUpdateManager = new OptimisticUpdateManager();