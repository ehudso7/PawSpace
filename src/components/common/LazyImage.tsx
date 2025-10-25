import React, { useState, useEffect, memo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { FastImage } from './FastImage';
import { getOptimizedImageUrl, performanceOptimizer } from '../../utils/performance';

interface LazyImageProps {
  uri: string;
  style?: any;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  isVisible?: boolean;
  width?: number;
  height?: number;
  quality?: number;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: any) => void;
}

export const LazyImage: React.FC<LazyImageProps> = memo(({
  uri,
  style,
  resizeMode = 'cover',
  isVisible = true,
  width,
  height,
  quality = 80,
  placeholder,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(isVisible);

  useEffect(() => {
    if (isVisible && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isVisible, shouldLoad]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = (error: any) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(error);
  };

  const getImageSource = () => {
    if (!shouldLoad) return { uri: '' };

    // Check cache first
    const cachedUrl = performanceOptimizer.getCachedImage(uri);
    if (cachedUrl) {
      return { uri: cachedUrl, priority: 'high' as const };
    }

    // Optimize image URL if dimensions are provided
    const optimizedUrl = width && height 
      ? getOptimizedImageUrl(uri, width, height, quality)
      : uri;

    return { 
      uri: optimizedUrl, 
      priority: isVisible ? 'high' as const : 'normal' as const 
    };
  };

  if (!shouldLoad) {
    return (
      <View style={[styles.container, style]}>
        {placeholder || <View style={styles.placeholder} />}
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <View style={styles.errorPlaceholder} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FastImage
        source={getImageSource()}
        style={[styles.image, style]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          {placeholder || (
            <>
              <ActivityIndicator size="small" color="#007AFF" />
              <View style={styles.loadingPlaceholder} />
            </>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  loadingPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F0F0F0',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E1E1E1',
  },
});