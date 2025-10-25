import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Performance optimization utilities
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private imageCache = new Map<string, string>();
  private preloadQueue: string[] = [];
  private isPreloading = false;

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  // Image caching and preloading
  cacheImage(url: string, cachedUrl: string) {
    this.imageCache.set(url, cachedUrl);
  }

  getCachedImage(url: string): string | undefined {
    return this.imageCache.get(url);
  }

  preloadImages(urls: string[]) {
    this.preloadQueue.push(...urls);
    if (!this.isPreloading) {
      this.processPreloadQueue();
    }
  }

  private async processPreloadQueue() {
    if (this.preloadQueue.length === 0) {
      this.isPreloading = false;
      return;
    }

    this.isPreloading = true;
    const url = this.preloadQueue.shift()!;
    
    try {
      // In a real app, you would use react-native-fast-image's preload
      // FastImage.preload([{ uri: url }]);
      console.log('Preloading image:', url);
    } catch (error) {
      console.warn('Failed to preload image:', url, error);
    }

    // Process next image after a small delay
    setTimeout(() => this.processPreloadQueue(), 50);
  }

  // Memory management
  clearImageCache() {
    this.imageCache.clear();
  }

  // Viewport calculations for lazy loading
  isInViewport(itemIndex: number, visibleRange: { start: number; end: number }): boolean {
    return itemIndex >= visibleRange.start && itemIndex <= visibleRange.end;
  }

  calculateVisibleRange(scrollOffset: number, itemHeight: number, windowSize: number = 10): {
    start: number;
    end: number;
  } {
    const start = Math.max(0, Math.floor(scrollOffset / itemHeight) - windowSize);
    const end = Math.ceil((scrollOffset + SCREEN_HEIGHT) / itemHeight) + windowSize;
    
    return { start, end };
  }

  // FlatList optimization helpers
  getItemLayout = (itemHeight: number) => (data: any, index: number) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });

  keyExtractor = (item: any, index: number) => {
    return item.id ? `${item.id}-${index}` : `item-${index}`;
  };

  // Debounce utility for search and scroll
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttle utility for scroll events
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Video optimization
  shouldAutoPlayVideo(
    itemIndex: number,
    visibleItems: Set<string>,
    itemId: string,
    isInForeground: boolean = true
  ): boolean {
    return (
      isInForeground &&
      visibleItems.has(itemId) &&
      visibleItems.size <= 3 // Only autoplay if few items are visible
    );
  }

  // Memory usage monitoring
  getMemoryUsage(): number {
    // In a real app, you might use a native module to get actual memory usage
    return performance.memory?.usedJSHeapSize || 0;
  }

  shouldReduceQuality(): boolean {
    const memoryUsage = this.getMemoryUsage();
    const memoryThreshold = 50 * 1024 * 1024; // 50MB threshold
    return memoryUsage > memoryThreshold;
  }

  // Batch operations
  batchUpdates<T>(
    items: T[],
    batchSize: number,
    processor: (batch: T[]) => Promise<void>
  ): Promise<void[]> {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }

    return Promise.all(batches.map(batch => processor(batch)));
  }
}

// Viewport intersection observer for React Native
export class ViewportObserver {
  private observers = new Map<string, (isVisible: boolean) => void>();
  private visibleItems = new Set<string>();

  observe(itemId: string, callback: (isVisible: boolean) => void) {
    this.observers.set(itemId, callback);
  }

  unobserve(itemId: string) {
    this.observers.delete(itemId);
    this.visibleItems.delete(itemId);
  }

  updateVisibility(visibleItemIds: string[]) {
    const newVisibleItems = new Set(visibleItemIds);
    
    // Check for newly visible items
    for (const itemId of newVisibleItems) {
      if (!this.visibleItems.has(itemId)) {
        const callback = this.observers.get(itemId);
        callback?.(true);
      }
    }

    // Check for newly hidden items
    for (const itemId of this.visibleItems) {
      if (!newVisibleItems.has(itemId)) {
        const callback = this.observers.get(itemId);
        callback?.(false);
      }
    }

    this.visibleItems = newVisibleItems;
  }

  isVisible(itemId: string): boolean {
    return this.visibleItems.has(itemId);
  }

  getVisibleCount(): number {
    return this.visibleItems.size;
  }
}

// Image size optimization
export const getOptimizedImageUrl = (
  originalUrl: string,
  targetWidth: number,
  targetHeight: number,
  quality: number = 80
): string => {
  // In a real app, you might use a CDN service like Cloudinary or ImageKit
  // This is a placeholder implementation
  const shouldReduceQuality = PerformanceOptimizer.getInstance().shouldReduceQuality();
  const finalQuality = shouldReduceQuality ? Math.min(quality, 60) : quality;
  
  // Example URL transformation (adjust based on your CDN)
  return `${originalUrl}?w=${targetWidth}&h=${targetHeight}&q=${finalQuality}&f=auto`;
};

// Lazy loading hook utility
export const useLazyLoading = (threshold: number = 0.8) => {
  return {
    onEndReachedThreshold: threshold,
    removeClippedSubviews: true,
    maxToRenderPerBatch: 5,
    updateCellsBatchingPeriod: 50,
    initialNumToRender: 3,
    windowSize: 10,
    getItemLayout: PerformanceOptimizer.getInstance().getItemLayout,
    keyExtractor: PerformanceOptimizer.getInstance().keyExtractor,
  };
};

// Performance monitoring
export class PerformanceMonitor {
  private static metrics = new Map<string, number>();
  private static startTimes = new Map<string, number>();

  static startTimer(name: string) {
    this.startTimes.set(name, Date.now());
  }

  static endTimer(name: string): number {
    const startTime = this.startTimes.get(name);
    if (!startTime) return 0;
    
    const duration = Date.now() - startTime;
    this.metrics.set(name, duration);
    this.startTimes.delete(name);
    
    return duration;
  }

  static getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  static getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  static logSlowOperations(threshold: number = 100) {
    for (const [name, duration] of this.metrics) {
      if (duration > threshold) {
        console.warn(`Slow operation detected: ${name} took ${duration}ms`);
      }
    }
  }
}

export const performanceOptimizer = PerformanceOptimizer.getInstance();