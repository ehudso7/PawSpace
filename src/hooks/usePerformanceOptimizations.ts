import { useCallback, useMemo, useRef, useEffect } from 'react';
import { InteractionManager, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Debounce hook for search and other frequent updates
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttle hook for scroll events
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: any[]) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<any>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [elementRef, options]);

  return isIntersecting;
}

// Memoized list item renderer
export function useMemoizedListItem<T>(
  data: T[],
  renderItem: (item: T, index: number) => React.ReactElement,
  keyExtractor: (item: T, index: number) => string
) {
  return useMemo(() => {
    return data.map((item, index) => ({
      key: keyExtractor(item, index),
      element: renderItem(item, index),
    }));
  }, [data, renderItem, keyExtractor]);
}

// Performance-optimized FlatList props
export function useOptimizedFlatListProps<T>(
  data: T[],
  keyExtractor: (item: T, index: number) => string,
  getItemLayout?: (data: T[] | null | undefined, index: number) => { length: number; offset: number; index: number }
) {
  return useMemo(() => ({
    data,
    keyExtractor,
    getItemLayout,
    removeClippedSubviews: true,
    maxToRenderPerBatch: 10,
    updateCellsBatchingPeriod: 50,
    initialNumToRender: 10,
    windowSize: 10,
    legacyImplementation: false,
  }), [data, keyExtractor, getItemLayout]);
}

// Image preloading hook
export function useImagePreloading(urls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const preloadImage = useCallback(async (url: string) => {
    if (loadedImages.has(url) || loadingImages.has(url)) return;

    setLoadingImages(prev => new Set([...prev, url]));

    try {
      // Use FastImage preload
      await FastImage.preload([{ uri: url }]);
      setLoadedImages(prev => new Set([...prev, url]));
    } catch (error) {
      console.warn('Failed to preload image:', url, error);
    } finally {
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(url);
        return newSet;
      });
    }
  }, [loadedImages, loadingImages]);

  const preloadImages = useCallback(async (urls: string[]) => {
    const promises = urls.map(url => preloadImage(url));
    await Promise.allSettled(promises);
  }, [preloadImage]);

  return {
    loadedImages,
    loadingImages,
    preloadImage,
    preloadImages,
  };
}

// Video lazy loading hook
export function useVideoLazyLoading(
  videoUrl: string,
  isInViewport: boolean,
  delay: number = 1000
) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!isInViewport) return;

    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [isInViewport, delay]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return {
    shouldLoad,
    isLoaded,
    handleLoad,
  };
}

// Memory management hook
export function useMemoryManagement() {
  const [memoryWarning, setMemoryWarning] = useState(false);

  useEffect(() => {
    const handleMemoryWarning = () => {
      setMemoryWarning(true);
      // Clear caches, reduce image quality, etc.
      setTimeout(() => setMemoryWarning(false), 5000);
    };

    // Listen for memory warnings
    // This would be platform-specific implementation
    // For React Native, you might use a native module

    return () => {
      // Cleanup
    };
  }, []);

  return { memoryWarning };
}

// Batch updates hook
export function useBatchedUpdates<T>(
  updateFn: (updates: T[]) => void,
  batchSize: number = 10,
  delay: number = 100
) {
  const [pendingUpdates, setPendingUpdates] = useState<T[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addUpdate = useCallback((update: T) => {
    setPendingUpdates(prev => {
      const newUpdates = [...prev, update];
      
      if (newUpdates.length >= batchSize) {
        updateFn(newUpdates);
        return [];
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        updateFn(newUpdates);
        setPendingUpdates([]);
      }, delay);
      
      return newUpdates;
    });
  }, [updateFn, batchSize, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { addUpdate, pendingUpdates };
}

// Scroll performance hook
export function useScrollPerformance() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback((event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
    
    setScrollDirection(direction);
    lastScrollY.current = currentScrollY;
    
    if (!isScrolling) {
      setIsScrolling(true);
    }
  }, [isScrolling]);

  const handleScrollEnd = useCallback(() => {
    setIsScrolling(false);
    setScrollDirection(null);
  }, []);

  return {
    isScrolling,
    scrollDirection,
    handleScroll,
    handleScrollEnd,
  };
}

// Import FastImage for preloading
import FastImage from 'react-native-fast-image';
import { useState } from 'react';