import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlayerState } from '../types';

interface VideoPlayerControlsProps {
  playerState: VideoPlayerState;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onLoopToggle: () => void;
}

export const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
  playerState,
  onPlayPause,
  onMuteToggle,
  onLoopToggle
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (playerState.duration === 0) return 0;
    return (playerState.currentTime / playerState.duration) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${getProgressPercentage()}%` }
            ]} 
          />
        </View>
        <Text style={styles.timeText}>
          {formatTime(playerState.currentTime)} / {formatTime(playerState.duration)}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        {/* Play/Pause Button */}
        <TouchableOpacity 
          style={styles.playButton}
          onPress={onPlayPause}
        >
          <Ionicons
            name={playerState.isPlaying ? 'pause' : 'play'}
            size={32}
            color="white"
          />
        </TouchableOpacity>

        {/* Secondary Controls */}
        <View style={styles.secondaryControls}>
          {/* Mute Button */}
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={onMuteToggle}
          >
            <Ionicons
              name={playerState.isMuted ? 'volume-mute' : 'volume-high'}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          {/* Loop Button */}
          <TouchableOpacity 
            style={[
              styles.controlButton,
              playerState.isLooping && styles.activeControl
            ]}
            onPress={onLoopToggle}
          >
            <Ionicons
              name="repeat"
              size={24}
              color={playerState.isLooping ? '#4CAF50' : 'white'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeControl: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
});

export default VideoPlayerControls;