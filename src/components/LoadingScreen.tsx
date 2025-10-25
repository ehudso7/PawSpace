import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { VideoGenerationProgress } from '@/types/transformation';

interface LoadingScreenProps {
  progress: VideoGenerationProgress;
  onCancel?: () => void;
}

const { width } = Dimensions.get('window');

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  onCancel,
}) => {
  const getStatusIcon = () => {
    switch (progress.status) {
      case 'uploading':
        return '📤';
      case 'processing':
        return '⚙️';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'uploading':
        return '#007AFF';
      case 'processing':
        return '#FF9500';
      case 'completed':
        return '#34C759';
      case 'failed':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>{getStatusIcon()}</Text>
        
        <Text style={styles.title}>Creating your transformation...</Text>
        
        <Text style={styles.message}>{progress.message}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress.progress}%`,
                  backgroundColor: getStatusColor(),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress.progress)}%</Text>
        </View>

        {progress.status === 'processing' && (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={getStatusColor()} />
          </View>
        )}

        {progress.status === 'failed' && onCancel && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Something went wrong. Please try again.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
  },
  progressContainer: {
    width: width * 0.8,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  spinnerContainer: {
    marginTop: 24,
  },
  errorContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 8,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 14,
  },
});