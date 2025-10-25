import { useState, useEffect, useCallback } from 'react';
import { transformationsService } from '@/services/transformations';
import { Transformation, CreateTransformationData } from '@/types';

export const useTransformations = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = async (pageNum = 0, refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const feedData = await transformationsService.getFeed(pageNum);
      
      if (refresh || pageNum === 0) {
        setTransformations(feedData);
      } else {
        setTransformations(prev => [...prev, ...feedData]);
      }

      setHasMore(feedData.length === 20); // Assuming 20 is the limit per page
      setPage(pageNum);
    } catch (error) {
      setError('Failed to fetch transformations');
      console.error('Error fetching feed:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchFeed(page + 1);
    }
  };

  const refresh = () => {
    fetchFeed(0, true);
  };

  const createTransformation = async (transformationData: CreateTransformationData) => {
    setError(null);

    try {
      const { transformation, error } = await transformationsService.createTransformation(transformationData);
      
      if (error) {
        setError(error);
        return { success: false, error };
      }

      if (transformation) {
        setTransformations(prev => [transformation, ...prev]);
      }

      return { success: true, transformation };
    } catch (error) {
      const errorMessage = 'Failed to create transformation';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const likeTransformation = async (transformationId: string) => {
    try {
      const { error } = await transformationsService.likeTransformation(transformationId);
      
      if (error) {
        console.error('Error liking transformation:', error);
        return;
      }

      // Optimistically update local state
      setTransformations(prev =>
        prev.map(transformation =>
          transformation.id === transformationId
            ? { 
                ...transformation, 
                isLiked: true, 
                likesCount: transformation.likesCount + 1 
              }
            : transformation
        )
      );
    } catch (error) {
      console.error('Error liking transformation:', error);
    }
  };

  const unlikeTransformation = async (transformationId: string) => {
    try {
      const { error } = await transformationsService.unlikeTransformation(transformationId);
      
      if (error) {
        console.error('Error unliking transformation:', error);
        return;
      }

      // Optimistically update local state
      setTransformations(prev =>
        prev.map(transformation =>
          transformation.id === transformationId
            ? { 
                ...transformation, 
                isLiked: false, 
                likesCount: Math.max(0, transformation.likesCount - 1) 
              }
            : transformation
        )
      );
    } catch (error) {
      console.error('Error unliking transformation:', error);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchFeed(0);
  }, []);

  return {
    transformations,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    fetchFeed,
    loadMore,
    refresh,
    createTransformation,
    likeTransformation,
    unlikeTransformation,
    clearError,
  };
};

export const useTransformation = (id: string) => {
  const [transformation, setTransformation] = useState<Transformation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransformation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const transformationData = await transformationsService.getTransformationById(id);
      setTransformation(transformationData);
    } catch (error) {
      setError('Failed to fetch transformation');
      console.error('Error fetching transformation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    if (id) {
      fetchTransformation();
    }
  }, [id]);

  return {
    transformation,
    isLoading,
    error,
    fetchTransformation,
    clearError,
  };
};

export const useUserTransformations = (userId?: string) => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTransformations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userTransformations = await transformationsService.getUserTransformations(userId);
      setTransformations(userTransformations);
    } catch (error) {
      setError('Failed to fetch user transformations');
      console.error('Error fetching user transformations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchUserTransformations();
  }, [userId]);

  return {
    transformations,
    isLoading,
    error,
    fetchUserTransformations,
    clearError,
  };
};