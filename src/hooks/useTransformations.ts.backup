<<<<<<< HEAD
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
=======
import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { transformationsService, type Transformation } from '@/services/transformations';

export const useTransformations = (limit = 20) => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [offset, setOffset] = useState(0);

  const fetchTransformations = async (resetOffset = false) => {
    setLoading(true);
    setError(null);
    const currentOffset = resetOffset ? 0 : offset;
    try {
      const { data, error: fetchError } = await transformationsService.getTransformations(limit, currentOffset);
      if (fetchError) throw fetchError;
      if (resetOffset) {
        setTransformations(data || []);
        setOffset(0);
      } else {
        setTransformations([...transformations, ...(data || [])]);
      }
    } catch (err) {
      setError(err as Error);
=======
import { transformationService } from '@/services/transformations';
import { Transformation } from '@/types/database';

export const useTransformations = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransformations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transformationService.getTransformations();
      setTransformations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transformations');
>>>>>>> origin/main
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  useEffect(() => {
    fetchTransformations(true);
  }, []);

  const loadMore = () => {
    setOffset(offset + limit);
    fetchTransformations();
  };

  const createTransformation = async (transformationData: Omit<Transformation, 'id' | 'created_at' | 'likes'>) => {
    setError(null);
    try {
      const { data, error: createError } = await transformationsService.createTransformation(transformationData);
      if (createError) throw createError;
      if (data) {
        setTransformations([data, ...transformations]);
      }
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { data: null, error };
    }
  };

  const likeTransformation = async (id: string) => {
    setError(null);
    try {
      const { data, error: likeError } = await transformationsService.likeTransformation(id);
      if (likeError) throw likeError;
      if (data) {
        setTransformations(transformations.map(t => t.id === id ? data : t));
      }
      return { data, error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { data: null, error };
=======
  const fetchTransformationById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await transformationService.getTransformationById(id);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transformation';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const createTransformation = async (transformationData: Omit<Transformation, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const newTransformation = await transformationService.createTransformation(transformationData);
      setTransformations(prev => [newTransformation, ...prev]);
      return { data: newTransformation, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create transformation';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateTransformation = async (id: string, updates: Partial<Transformation>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTransformation = await transformationService.updateTransformation(id, updates);
      setTransformations(prev => 
        prev.map(transformation => 
          transformation.id === id ? updatedTransformation : transformation
        )
      );
      return { data: updatedTransformation, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transformation';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
>>>>>>> origin/main
    }
  };

  const deleteTransformation = async (id: string) => {
<<<<<<< HEAD
    setError(null);
    try {
      const { error: deleteError } = await transformationsService.deleteTransformation(id);
      if (deleteError) throw deleteError;
      setTransformations(transformations.filter(t => t.id !== id));
      return { error: null };
    } catch (err) {
      const error = err as Error;
      setError(error);
      return { error };
=======
    setLoading(true);
    setError(null);
    try {
      await transformationService.deleteTransformation(id);
      setTransformations(prev => prev.filter(transformation => transformation.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transformation';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const likeTransformation = async (id: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await transformationService.likeTransformation(id, userId);
      setTransformations(prev => 
        prev.map(transformation => 
          transformation.id === id 
            ? { ...transformation, likes: transformation.likes + 1 }
            : transformation
        )
      );
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like transformation';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const unlikeTransformation = async (id: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await transformationService.unlikeTransformation(id, userId);
      setTransformations(prev => 
        prev.map(transformation => 
          transformation.id === id 
            ? { ...transformation, likes: Math.max(0, transformation.likes - 1) }
            : transformation
        )
      );
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unlike transformation';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
>>>>>>> origin/main
    }
  };

  return {
    transformations,
    loading,
    error,
<<<<<<< HEAD
    refetch: () => fetchTransformations(true),
    loadMore,
    createTransformation,
    likeTransformation,
    deleteTransformation,
  };
};

export default useTransformations;
=======
    fetchTransformations,
    fetchTransformationById,
    createTransformation,
    updateTransformation,
    deleteTransformation,
    likeTransformation,
    unlikeTransformation,
  };
};
>>>>>>> origin/main
>>>>>>> origin/main
