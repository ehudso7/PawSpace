export interface UserProfile {
  id: string;
  name: string;
  avatar_url?: string;
  is_provider: boolean;
  provider_info?: {
    business_name: string;
    verified: boolean;
  };
}

export interface ServiceType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transformation {
  id: string;
  user_id: string;
  user: UserProfile;
  before_image_url: string;
  after_image_url: string;
  before_video_url?: string;
  after_video_url?: string;
  caption: string;
  service_type: ServiceType;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_saved: boolean;
  is_following_user: boolean;
  created_at: string;
  location?: string;
  tags?: string[];
}

export interface Comment {
  id: string;
  transformation_id: string;
  user_id: string;
  user: UserProfile;
  text: string;
  likes_count: number;
  is_liked: boolean;
  parent_comment_id?: string;
  replies?: Comment[];
  created_at: string;
}

export interface FeedResponse {
  transformations: Transformation[];
  next_page: number | null;
  has_more: boolean;
}

export interface Story {
  id: string;
  user_id: string;
  user: UserProfile;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
  expires_at: string;
  is_viewed: boolean;
}

export interface StoryGroup {
  user: UserProfile;
  stories: Story[];
  has_unviewed: boolean;
}

export type FeedFilter = 'all' | 'following' | ServiceType['id'];

export interface ReportReason {
  id: string;
  label: string;
  description: string;
}
