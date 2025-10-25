import { useState, useEffect, useCallback, useRef } from 'react';
import { feedService, optimisticUpdateManager } from '../services/feed';
import {
  FeedState,
  Transformation,
  FeedFilter,
  ApiError,
} from '../types';

interface UseFeedOptions {
  initialPage?: number;
  pageSize?: number;
  filter?: FeedFilter;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useFeed = (options: UseFeedOptions = {}) => {
  const {
    initialPage = 1,
    pageSize = 20,
    filter = {},
    autoRefresh = false,
    refreshInterval = 30000, // 30 seconds
  } = options;

  const [state, setState] = useState<FeedState>({
    transformations: [],
    stories: [],
    isLoading: false,
    isRefreshing: false,
    isLoadingMore: false,
    hasMore: true,
    currentPage: initialPage,
    error: null,
    filter,
    searchQuery: '',
  });

  const refreshIntervalRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const loadFeed = useCallback(async (
    page: number = 1,
    isRefresh: boolean = false,
    isLoadMore: boolean = false
  ) => {
    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setState(prev => ({
        ...prev,
        isLoading: !isRefresh && !isLoadMore && page === 1,
        isRefreshing: isRefresh,
        isLoadingMore: isLoadMore,
        error: null,
      }));

      let response;
      if (Object.keys(filter).length > 0) {
        response = await feedService.getFilteredFeed(filter, page, pageSize);
      } else {
        response = await feedService.getFeed(page, pageSize);
      }

      setState(prev => ({
        ...prev,
        transformations: isRefresh || page === 1 
          ? response.transformations 
          : [...prev.transformations, ...response.transformations],
        hasMore: response.has_more,
        currentPage: page,
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false,
      }));

      // Load stories on first page
      if (page === 1) {
        try {
          const stories = await feedService.getStories();
          setState(prev => ({ ...prev, stories }));
        } catch (error) {
          console.warn('Failed to load stories:', error);
        }
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled
      }

      setState(prev => ({
        ...prev,
        error: (error as ApiError).message || 'Failed to load feed',
        isLoading: false,
        isRefreshing: false,
        isLoadingMore: false,
      }));
    }
  }, [filter, pageSize]);

  const refresh = useCallback(() => {
    loadFeed(1, true, false);
  }, [loadFeed]);

  const loadMore = useCallback(() => {
    if (state.hasMore && !state.isLoadingMore) {
      loadFeed(state.currentPage + 1, false, true);
    }
  }, [state.hasMore, state.isLoadingMore, state.currentPage, loadFeed]);

  const updateFilter = useCallback((newFilter: FeedFilter) => {
    setState(prev => ({ ...prev, filter: newFilter }));
    loadFeed(1, false, false);
  }, [loadFeed]);

  const search = useCallback(async (query: string) => {
    try {
      setState(prev => ({ ...prev, searchQuery: query, isLoading: true, error: null }));
      
      const response = await feedService.searchTransformations(query, 1, pageSize);
      
      setState(prev => ({
        ...prev,
        transformations: response.transformations,
        hasMore: response.transformations.length === pageSize,
        currentPage: 1,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: (error as ApiError).message || 'Search failed',
        isLoading: false,
      }));
    }
  }, [pageSize]);

  // Optimistic like/unlike
  const toggleLike = useCallback(async (transformationId: string) => {
    const transformation = state.transformations.find(t => t.id === transformationId);
    if (!transformation) return;

    const wasLiked = transformation.is_liked;
    const newLikesCount = wasLiked ? transformation.likes_count - 1 : transformation.likes_count + 1;

    // Optimistic update
    setState(prev => ({
      ...prev,
      transformations: prev.transformations.map(t =>
        t.id === transformationId
          ? { ...t, is_liked: !wasLiked, likes_count: newLikesCount }
          : t
      ),
    }));

    // Track optimistic update
    optimisticUpdateManager.addPendingUpdate(`like_${transformationId}`, {
      transformationId,
      wasLiked,
      originalLikesCount: transformation.likes_count,
    });

    try {
      if (wasLiked) {
        await feedService.unlikeTransformation(transformationId);
      } else {
        await feedService.likeTransformation(transformationId);
      }
      
      // Remove from pending updates on success
      optimisticUpdateManager.removePendingUpdate(`like_${transformationId}`);
    } catch (error) {
      // Revert optimistic update on failure
      setState(prev => ({
        ...prev,
        transformations: prev.transformations.map(t =>
          t.id === transformationId
            ? { ...t, is_liked: wasLiked, likes_count: transformation.likes_count }
            : t
        ),
      }));
      
      optimisticUpdateManager.removePendingUpdate(`like_${transformationId}`);
      console.error('Failed to toggle like:', error);
    }
  }, [state.transformations]);

  // Optimistic save/unsave
  const toggleSave = useCallback(async (transformationId: string) => {
    const transformation = state.transformations.find(t => t.id === transformationId);
    if (!transformation) return;

    const wasSaved = transformation.is_saved;

    // Optimistic update
    setState(prev => ({
      ...prev,
      transformations: prev.transformations.map(t =>
        t.id === transformationId
          ? { ...t, is_saved: !wasSaved }
          : t
      ),
    }));

    try {
      if (wasSaved) {
        await feedService.unsaveTransformation(transformationId);
      } else {
        await feedService.saveTransformation(transformationId);
      }
    } catch (error) {
      // Revert optimistic update on failure
      setState(prev => ({
        ...prev,
        transformations: prev.transformations.map(t =>
          t.id === transformationId
            ? { ...t, is_saved: wasSaved }
            : t
        ),
      }));
      console.error('Failed to toggle save:', error);
    }
  }, [state.transformations]);

  // Optimistic follow/unfollow
  const toggleFollow = useCallback(async (userId: string) => {
    const transformation = state.transformations.find(t => t.user.id === userId || t.provider?.id === userId);
    if (!transformation) return;

    const targetUser = transformation.user.id === userId ? transformation.user : transformation.provider;
    if (!targetUser) return;

    const wasFollowing = targetUser.is_following;
    const newFollowerCount = wasFollowing ? targetUser.follower_count - 1 : targetUser.follower_count + 1;

    // Optimistic update
    setState(prev => ({
      ...prev,
      transformations: prev.transformations.map(t => {
        const updatedTransformation = { ...t };
        if (t.user.id === userId) {
          updatedTransformation.user = {
            ...t.user,
            is_following: !wasFollowing,
            follower_count: newFollowerCount,
          };
          updatedTransformation.is_following_user = !wasFollowing;
        }
        if (t.provider?.id === userId) {
          updatedTransformation.provider = {
            ...t.provider,
            is_following: !wasFollowing,
            follower_count: newFollowerCount,
          };
        }
        return updatedTransformation;
      }),
    }));

    try {
      if (wasFollowing) {
        await feedService.unfollowUser(userId);
      } else {
        await feedService.followUser(userId);
      }
    } catch (error) {
      // Revert optimistic update on failure
      setState(prev => ({
        ...prev,
        transformations: prev.transformations.map(t => {
          const revertedTransformation = { ...t };
          if (t.user.id === userId) {
            revertedTransformation.user = {
              ...t.user,
              is_following: wasFollowing,
              follower_count: targetUser.follower_count,
            };
            revertedTransformation.is_following_user = wasFollowing;
          }
          if (t.provider?.id === userId) {
            revertedTransformation.provider = {
              ...t.provider,
              is_following: wasFollowing,
              follower_count: targetUser.follower_count,
            };
          }
          return revertedTransformation;
        }),
      }));
      console.error('Failed to toggle follow:', error);
    }
  }, [state.transformations]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        if (!state.isLoading && !state.isRefreshing && !state.isLoadingMore) {
          refresh();
        }
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refresh, state.isLoading, state.isRefreshing, state.isLoadingMore]);

  // Initial load
  useEffect(() => {
    loadFeed(initialPage);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    refresh,
    loadMore,
    updateFilter,
    search,
    toggleLike,
    toggleSave,
    toggleFollow,
  };
};