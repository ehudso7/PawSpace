import { 
  FeedResponse, 
  Transformation, 
  Comment, 
  ServiceType, 
  UserProfile, 
  FeedFilters,
  SearchResult,
  ReportReason 
} from '@/types';

class FeedService {
  private baseUrl = 'https://api.transformationapp.com/v1';

  // Get feed with pagination
  async getFeed(page: number = 1, limit: number = 20, filters?: FeedFilters): Promise<FeedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.service_type && { service_type: filters.service_type }),
        ...(filters?.sort_by && { sort_by: filters.sort_by }),
      });

      const response = await fetch(`${this.baseUrl}/feed?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    }
  }

  // Get feed for specific service type
  async getFeedByService(serviceType: string): Promise<Transformation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/feed/service/${serviceType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.transformations;
    } catch (error) {
      console.error('Error fetching feed by service:', error);
      throw error;
    }
  }

  // Search transformations
  async searchTransformations(query: string, page: number = 1, limit: number = 20): Promise<SearchResult> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching transformations:', error);
      throw error;
    }
  }

  // Like/unlike transformation
  async likeTransformation(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error liking transformation:', error);
      throw error;
    }
  }

  async unlikeTransformation(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${id}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error unliking transformation:', error);
      throw error;
    }
  }

  // Comment on transformation
  async addComment(transformationId: string, text: string, parentCommentId?: string): Promise<Comment> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${transformationId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          text,
          parent_comment_id: parentCommentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  async likeComment(commentId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  }

  // Save transformation (bookmark)
  async saveTransformation(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving transformation:', error);
      throw error;
    }
  }

  async unsaveTransformation(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${id}/save`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error unsaving transformation:', error);
      throw error;
    }
  }

  async getSavedTransformations(page: number = 1, limit: number = 20): Promise<FeedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${this.baseUrl}/saved?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching saved transformations:', error);
      throw error;
    }
  }

  // Report transformation
  async reportTransformation(id: string, reason: string, description?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${id}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          reason,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error reporting transformation:', error);
      throw error;
    }
  }

  // Follow/unfollow user
  async followUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  async unfollowUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/follow`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  // Get transformation details
  async getTransformation(id: string): Promise<Transformation> {
    try {
      const response = await fetch(`${this.baseUrl}/transformations/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transformation:', error);
      throw error;
    }
  }

  // Get comments for transformation
  async getComments(transformationId: string, page: number = 1, limit: number = 50): Promise<Comment[]> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${this.baseUrl}/transformations/${transformationId}/comments?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // Get stories
  async getStories(): Promise<Story[]> {
    try {
      const response = await fetch(`${this.baseUrl}/stories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.stories;
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  // Get report reasons
  async getReportReasons(): Promise<ReportReason[]> {
    try {
      const response = await fetch(`${this.baseUrl}/report-reasons`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.reasons;
    } catch (error) {
      console.error('Error fetching report reasons:', error);
      throw error;
    }
  }

  // Private helper method to get auth token
  private async getAuthToken(): Promise<string> {
    // This would typically come from your auth service
    // For now, return a placeholder
    return 'your-auth-token-here';
  }
}

export const feedService = new FeedService();