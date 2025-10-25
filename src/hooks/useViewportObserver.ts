import { useEffect, useRef, useCallback } from 'react';
import { ViewToken } from 'react-native';
import { ViewportObserver } from '../utils/performance';

interface UseViewportObserverOptions {
  threshold?: number;
  minimumViewTime?: number;
}

export const useViewportObserver = (options: UseViewportObserverOptions = {}) => {
  const { threshold = 0.5, minimumViewTime = 500 } = options;
  const observerRef = useRef(new ViewportObserver());

  const viewabilityConfig = {
    itemVisiblePercentThreshold: threshold * 100,
    minimumViewTime,
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: {
    viewableItems: ViewToken[];
  }) => {
    const visibleIds = viewableItems
      .filter(item => item.isViewable && item.item?.id)
      .map(item => item.item.id);
    
    observerRef.current.updateVisibility(visibleIds);
  }, []);

  const observe = useCallback((itemId: string, callback: (isVisible: boolean) => void) => {
    observerRef.current.observe(itemId, callback);
  }, []);

  const unobserve = useCallback((itemId: string) => {
    observerRef.current.unobserve(itemId);
  }, []);

  const isVisible = useCallback((itemId: string) => {
    return observerRef.current.isVisible(itemId);
  }, []);

  const getVisibleCount = useCallback(() => {
    return observerRef.current.getVisibleCount();
  }, []);

  return {
    viewabilityConfig,
    onViewableItemsChanged,
    observe,
    unobserve,
    isVisible,
    getVisibleCount,
  };
};