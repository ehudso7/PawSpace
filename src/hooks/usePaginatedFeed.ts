import { useCallback, useEffect, useRef, useState } from 'react';
import type { FeedResponse, Transformation } from '../types/feed';
import feedService from '../services/feed';

interface Options {
  pageSize?: number;
  prefetchThreshold?: number; // 0..1
}

export function usePaginatedFeed({ pageSize = 8, prefetchThreshold = 0.8 }: Options = {}) {
  const [items, setItems] = useState<Transformation[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadingRef = useRef(false);

  const loadPage = useCallback(async (nextPage: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res: FeedResponse = await feedService.getFeed(nextPage, pageSize);
      setItems((prev) => (nextPage === 1 ? res.transformations : [...prev, ...res.transformations]));
      setHasMore(res.has_more);
      setPage(nextPage);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [pageSize]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadPage(1);
    } finally {
      setRefreshing(false);
    }
  }, [loadPage]);

  const maybePrefetch = useCallback((scrollOffset: number, contentHeight: number, viewportHeight: number) => {
    if (!hasMore || loadingRef.current) return;
    const thresholdPx = (contentHeight - viewportHeight) * prefetchThreshold;
    if (scrollOffset >= thresholdPx) {
      loadPage(page + 1);
    }
  }, [hasMore, prefetchThreshold, loadPage, page]);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  return { items, loading, hasMore, page, refresh, refreshing, loadMore: () => hasMore && loadPage(page + 1), maybePrefetch };
}

export default usePaginatedFeed;
