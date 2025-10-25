export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  is_provider: boolean;
  is_verified: boolean;
  follower_count: number;
  following_count: number;
  is_following?: boolean;
}

export interface ServiceType {
  id: string;
  name: string;
  category: string;
  icon?: string;
  color?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail_url?: string;
  width: number;
  height: number;
  duration?: number; // for videos in seconds
}

export interface Transformation {
  id: string;
  user_id: string;
  user: UserProfile;
  provider_id?: string;
  provider?: UserProfile;
  service_type: ServiceType;
  before_media: MediaItem[];
  after_media: MediaItem[];
  caption: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  is_liked: boolean;
  is_saved: boolean;
  is_following_user: boolean;
  created_at: string;
  updated_at: string;
  booking_url?: string;
  tags: string[];
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
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
  updated_at: string;
  mentions: UserProfile[];
}

export interface Story {
  id: string;
  user_id: string;
  user: UserProfile;
  media_items: MediaItem[];
  created_at: string;
  expires_at: string;
  is_viewed: boolean;
  views_count: number;
}

export interface FeedResponse {
  transformations: Transformation[];
  next_page: number | null;
  has_more: boolean;
  total_count: number;
}

export interface SearchResult {
  transformations: Transformation[];
  users: UserProfile[];
  services: ServiceType[];
  total_count: number;
}

export interface FeedFilter {
  service_types?: string[];
  user_types?: ('user' | 'provider')[];
  date_range?: {
    start: string;
    end: string;
  };
  location_radius?: {
    latitude: number;
    longitude: number;
    radius_km: number;
  };
}

export interface LikeAction {
  transformation_id: string;
  is_liked: boolean;
  likes_count: number;
}

export interface SaveAction {
  transformation_id: string;
  is_saved: boolean;
  saves_count: number;
}

export interface FollowAction {
  user_id: string;
  is_following: boolean;
  follower_count: number;
}

export interface CommentAction {
  transformation_id: string;
  comment: Comment;
  comments_count: number;
}

export interface ReportReason {
  id: string;
  title: string;
  description: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Animation types
export interface AnimationConfig {
  duration: number;
  easing?: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  delay?: number;
}

export interface LikeAnimationState {
  scale: number;
  opacity: number;
  isAnimating: boolean;
}

// Feed state management
export interface FeedState {
  transformations: Transformation[];
  stories: Story[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  currentPage: number;
  error: string | null;
  filter: FeedFilter;
  searchQuery: string;
}

export interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  isPosting: boolean;
  error: string | null;
  replyingTo: Comment | null;
}

// Navigation types
export interface FeedNavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
}

export interface TransformationDetailParams {
  transformationId: string;
  transformation?: Transformation;
}

export interface ProfileScreenParams {
  userId: string;
  user?: UserProfile;
}

export interface BookingScreenParams {
  providerId: string;
  serviceTypeId: string;
  transformationId?: string;
}