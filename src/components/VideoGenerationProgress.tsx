import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { VideoGenerationProgress as ProgressType } from '../types/transformation';

interface VideoGenerationProgressProps {
  progress: ProgressType;
  onCancel?: () => void;
  showCancel?: boolean;
}

const { width } = Dimensions.get('window');

export const VideoGenerationProgress: React.FC<VideoGenerationProgressProps> = ({
  progress,
  onCancel,
  showCancel = true,
}) => {
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress.progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress.progress, progressAnim]);

  const getStageIcon = (stage: ProgressType['stage']): string => {
    switch (stage) {
      case 'uploading':
        return '📤';
      case 'processing':
        return '⚙️';
      case 'generating':
        return '🎬';
      case 'finalizing':
        return '✨';
      case 'complete':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStageColor = (stage: ProgressType['stage']): string => {
    switch (stage) {
      case 'uploading':
        return '#3498db';
      case 'processing':
        return '#f39c12';
      case 'generating':
        return '#9b59b6';
      case 'finalizing':
        return '#1abc9c';
      case 'complete':
        return '#27ae60';
      case 'error':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stageIcon}>{getStageIcon(progress.stage)}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.stageTitle}>
            {progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1)}
          </Text>
          <Text style={styles.message}>{progress.message}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: '#f0f0f0' }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: getStageColor(progress.stage),
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress.progress)}%</Text>
      </View>

      {progress.estimated_time_remaining && progress.stage !== 'complete' && (
        <Text style={styles.timeRemaining}>
          Estimated time remaining: {formatTime(progress.estimated_time_remaining)}
        </Text>
      )}

      {showCancel && onCancel && progress.stage !== 'complete' && progress.stage !== 'error' && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}

      {progress.stage === 'error' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong. Please try again.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stageIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    minWidth: 40,
    textAlign: 'right',
  },
  timeRemaining: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#fdf2f2',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
  },
});