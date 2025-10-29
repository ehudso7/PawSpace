import { useState, useEffect } from 'react';
import { transformationsService } from '@/services/transformations';
import type { Transformation } from '@/types';

export const useTransformations = () => {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = async (pageNum = 0, refresh = false) => {
    refresh ? setIsRefreshing(true) : setIsLoading(true);
    setError(null);
    try {
      const feedData = await transformationsService.getFeed(pageNum);
      setTransformations(pageNum === 0 ? feedData : [...transformations, ...feedData]);
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

  const clearError = () => setError(null);

  useEffect(() => {
    fetchFeed(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { transformations, isLoading, isRefreshing, error, hasMore, fetchFeed, loadMore, refresh, clearError };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return { transformation, isLoading, error, fetchTransformation, clearError };
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
    } catch (_e) {
      setError('Failed to fetch user transformations');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchUserTransformations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { transformations, isLoading, error, fetchUserTransformations, clearError };
};
