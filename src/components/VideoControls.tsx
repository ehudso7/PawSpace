import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Slider,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlayerState } from '../types/video';

interface VideoControlsProps {
  playerState: VideoPlayerState;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onLoopToggle: () => void;
  onSeek: (time: number) => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  playerState,
  onPlayPause,
  onMuteToggle,
  onLoopToggle,
  onSeek,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>
          {formatTime(playerState.currentTime)}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={playerState.duration}
          value={playerState.currentTime}
          onValueChange={onSeek}
          minimumTrackTintColor="#FF6B6B"
          maximumTrackTintColor="rgba(255, 255, 255, 0.3)"
          thumbStyle={styles.thumb}
        />
        <Text style={styles.timeText}>
          {formatTime(playerState.duration)}
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onMuteToggle}
        >
          <Ionicons
            name={playerState.isMuted ? 'volume-mute' : 'volume-high'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={onPlayPause}
        >
          <Ionicons
            name={playerState.isPlaying ? 'pause' : 'play'}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onLoopToggle}
        >
          <Ionicons
            name="repeat"
            size={24}
            color={playerState.isLooping ? '#FF6B6B' : '#fff'}
          />
        </TouchableOpacity>
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
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    minWidth: 40,
    textAlign: 'center',
  },
  slider: {
    flex: 1,
    height: 20,
    marginHorizontal: 10,
  },
  thumb: {
    backgroundColor: '#FF6B6B',
    width: 16,
    height: 16,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});

export default VideoControls;