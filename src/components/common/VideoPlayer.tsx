import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { FastImage } from './FastImage';
import { MediaItem } from '../../types';

interface VideoPlayerProps {
  media: MediaItem;
  isVisible: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  style?: any;
  onLoadStart?: () => void;
  onLoad?: () => void;
  onError?: (error: any) => void;
  onProgress?: (progress: { currentTime: number; duration: number }) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  media,
  isVisible,
  autoPlay = false,
  muted = true,
  style,
  onLoadStart,
  onLoad,
  onError,
  onProgress,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const hideControlsTimeout = useRef<NodeJS.Timeout>();

  // In a real app, you would use react-native-video or similar
  // This is a placeholder implementation
  const videoRef = useRef<any>(null);

  useEffect(() => {
    if (isVisible && autoPlay && !isPlaying) {
      handlePlay();
    } else if (!isVisible && isPlaying) {
      handlePause();
    }
  }, [isVisible, autoPlay]);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsLoading(true);
    onLoadStart?.();
    
    // Simulate video loading
    setTimeout(() => {
      setIsLoading(false);
      onLoad?.();
    }, 500);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
    showControlsTemporarily();
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Thumbnail/Video placeholder */}
      <FastImage
        source={{ uri: media.thumbnail_url || media.url }}
        style={styles.video}
        resizeMode="cover"
      />

      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Play/Pause overlay */}
      <TouchableOpacity
        style={styles.playOverlay}
        onPress={togglePlayPause}
        activeOpacity={0.7}
      >
        {showControls && (
          <View style={styles.playButton}>
            <Text style={styles.playButtonText}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Controls */}
      {showControls && (
        <View style={styles.controls}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }
                ]} 
              />
            </View>
            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(duration || media.duration || 0)}
            </Text>
          </View>
        </View>
      )}

      {/* Duration badge */}
      {media.duration && (
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>
            {formatTime(media.duration)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
});