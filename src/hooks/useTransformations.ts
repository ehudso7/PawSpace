import { useState, useEffect } from 'react';
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
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    setError(null);
    try {
      const feedData = await transformationsService.getFeed(pageNum);
      if (refresh || pageNum === 0) setTransformations(feedData);
      else setTransformations(prev => [...prev, ...feedData]);
      setHasMore(feedData.length === 20);
      setPage(pageNum);
    } catch (_e) {
      setError('Failed to fetch transformations');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) fetchFeed(page + 1);
  };

  const refresh = () => fetchFeed(0, true);

  const createTransformation = async (transformationData: CreateTransformationData) => {
    setError(null);
    try {
      const { transformation, error } = await transformationsService.createTransformation(transformationData);
      if (error) return { success: false, error };
      if (transformation) setTransformations(prev => [transformation, ...prev]);
      return { success: true, transformation };
    } catch (_e) {
      const msg = 'Failed to create transformation';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const likeTransformation = async (transformationId: string) => {
    try {
      const { error } = await transformationsService.likeTransformation(transformationId);
      if (error) return;
      setTransformations(prev => prev.map(t => t.id === transformationId ? { ...t, isLiked: true, likesCount: t.likesCount + 1 } : t));
    } catch (_e) { /* noop */ }
  };

  const unlikeTransformation = async (transformationId: string) => {
    try {
      const { error } = await transformationsService.unlikeTransformation(transformationId);
      if (error) return;
      setTransformations(prev => prev.map(t => t.id === transformationId ? { ...t, isLiked: false, likesCount: Math.max(0, t.likesCount - 1) } : t));
    } catch (_e) { /* noop */ }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchFeed(0);
  }, []);

  return { transformations, isLoading, isRefreshing, error, hasMore, fetchFeed, loadMore, refresh, createTransformation, likeTransformation, unlikeTransformation, clearError };
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
    } catch (_e) {
      setError('Failed to fetch transformation');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    if (id) fetchTransformation();
  }, [id]);

  return { transformation, isLoading, error, fetchTransformation, clearError };
};
