// Main exports for the feed system
export { FeedScreen } from './screens/home/FeedScreen';
export { TransformationDetailScreen } from './screens/TransformationDetailScreen';
export { SearchScreen } from './screens/SearchScreen';
export { FeedFiltersScreen } from './screens/FeedFiltersScreen';

// Components
export { TransformationCard } from './components/feed/TransformationCard';
export { CommentsSection } from './components/feed/CommentsSection';
export { StoriesRow } from './components/feed/StoriesRow';
export { BeforeAfterMedia } from './components/feed/BeforeAfterMedia';

// Common components
export { FastImage } from './components/common/FastImage';
export { VideoPlayer } from './components/common/VideoPlayer';
export { LazyImage } from './components/common/LazyImage';
export * from './components/common/AnimatedComponents';

// Services
export { feedService } from './services/feed';
export { apiClient } from './services/api';

// Hooks
export { useFeed } from './hooks/useFeed';
export { useComments } from './hooks/useComments';
export { useViewportObserver } from './hooks/useViewportObserver';

// Types
export * from './types';

// Utils
export * from './utils/performance';