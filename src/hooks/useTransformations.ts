import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import { Transformation } from '@/types';

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
      const limit = 20;
      const offset = pageNum * limit;

      const { data, error } = await supabase
        .from('transformations')
        .select(`
          *,
          user:users(*),
          likes:transformation_likes(count)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      if (refresh || pageNum === 0) {
        setTransformations(data || []);
      } else {
        setTransformations(prev => [...prev, ...(data || [])]);
      }

      setHasMore((data || []).length === limit);
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

  const createTransformation = async (transformationData: {
    imageUrl: string;
    caption: string;
    category?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('transformations')
        .insert({
          user_id: user.id,
          image_url: transformationData.imageUrl,
          caption: transformationData.caption,
          category: transformationData.category,
        })
        .select(`
          *,
          user:users(*),
          likes:transformation_likes(count)
        `)
        .single();

      if (error) throw error;
      setTransformations(prev => [data, ...prev]);
      return { success: true, transformation: data };
    } catch (error) {
      const errorMessage = 'Failed to create transformation';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const likeTransformation = async (transformationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('transformation_likes')
        .insert({
          transformation_id: transformationId,
          user_id: user.id,
        });

      if (error) throw error;

      // Update local state
      setTransformations(prev => prev.map(transformation => 
        transformation.id === transformationId 
          ? { ...transformation, likesCount: (transformation.likesCount || 0) + 1 }
          : transformation
      ));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to like transformation' };
    }
  };

  const unlikeTransformation = async (transformationId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('transformation_likes')
        .delete()
        .eq('transformation_id', transformationId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setTransformations(prev => prev.map(transformation => 
        transformation.id === transformationId 
          ? { ...transformation, likesCount: Math.max((transformation.likesCount || 0) - 1, 0) }
          : transformation
      ));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to unlike transformation' };
    }
  };

  useEffect(() => {
    fetchFeed();
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
      const { data, error } = await supabase
        .from('transformations')
        .select(`
          *,
          user:users(*),
          likes:transformation_likes(count)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setTransformation(data);
    } catch (error) {
      setError('Failed to fetch transformation');
      console.error('Error fetching transformation:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
  };
};

export const useUserTransformations = (userId: string) => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTransformations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('transformations')
        .select(`
          *,
          user:users(*),
          likes:transformation_likes(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransformations(data || []);
    } catch (error) {
      setError('Failed to fetch user transformations');
      console.error('Error fetching user transformations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserTransformations();
    }
  }, [userId]);

  return {
    transformations,
    isLoading,
    error,
    fetchUserTransformations,
  };
};