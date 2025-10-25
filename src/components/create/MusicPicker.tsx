import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Slider,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { AudioTrack } from '../../types/transformation';
import { useEditorStore } from '../../store/editorStore';
import { AUDIO_TRACKS } from '../../constants/editor';

interface MusicPickerProps {
  selectedMusic: AudioTrack | null;
}

const MusicPicker: React.FC<MusicPickerProps> = ({ selectedMusic }) => {
  const { setMusic } = useEditorStore();
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playPreview = async (track: AudioTrack) => {
    try {
      setIsLoading(true);
      
      // Stop current sound if playing
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      // Load and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true, volume, isLooping: false }
      );
      
      setSound(newSound);
      setPlayingTrack(track.id);
      
      // Stop playing after track duration
      setTimeout(() => {
        setPlayingTrack(null);
        newSound.unloadAsync();
        setSound(null);
      }, track.duration * 1000);
      
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopPreview = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setPlayingTrack(null);
  };

  const handleTrackSelect = (track: AudioTrack) => {
    if (selectedMusic?.id === track.id) {
      // Deselect if already selected
      setMusic(null);
    } else {
      setMusic(track);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (sound) {
      sound.setVolumeAsync(newVolume);
    }
  };

  const renderWaveform = (track: AudioTrack) => {
    // Simple waveform visualization
    const waveformData = track.waveform || Array.from({ length: 20 }, () => Math.random());
    
    return (
      <View style={styles.waveform}>
        {waveformData.slice(0, 15).map((amplitude, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              {
                height: Math.max(2, amplitude * 20),
                backgroundColor: playingTrack === track.id ? '#4A90E2' : '#E0E0E0',
              },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderTrackItem = ({ item }: { item: AudioTrack }) => {
    const isSelected = selectedMusic?.id === item.id;
    const isPlaying = playingTrack === item.id;
    
    return (
      <View style={[styles.trackItem, isSelected && styles.trackItemSelected]}>
        <View style={styles.trackInfo}>
          <Text style={styles.trackName}>{item.name}</Text>
          <Text style={styles.trackDuration}>{item.duration}s</Text>
          {renderWaveform(item)}
        </View>
        
        <View style={styles.trackControls}>
          <TouchableOpacity
            style={[styles.previewButton, isPlaying && styles.previewButtonActive]}
            onPress={() => isPlaying ? stopPreview() : playPreview(item)}
            disabled={isLoading}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={16}
              color={isPlaying ? '#FFFFFF' : '#4A90E2'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.selectButton, isSelected && styles.selectButtonActive]}
            onPress={() => handleTrackSelect(item)}
          >
            <Ionicons
              name={isSelected ? 'checkmark' : 'add'}
              size={16}
              color={isSelected ? '#FFFFFF' : '#4A90E2'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Background Music</Text>
        {selectedMusic && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setMusic(null)}
          >
            <Text style={styles.clearButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {selectedMusic && (
        <View style={styles.selectedTrack}>
          <View style={styles.selectedTrackInfo}>
            <Ionicons name="musical-notes" size={20} color="#4A90E2" />
            <Text style={styles.selectedTrackName}>{selectedMusic.name}</Text>
          </View>
          
          <View style={styles.volumeControl}>
            <Ionicons name="volume-low" size={16} color="#666666" />
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#4A90E2"
              maximumTrackTintColor="#E0E0E0"
              thumbStyle={styles.sliderThumb}
            />
            <Ionicons name="volume-high" size={16} color="#666666" />
          </View>
        </View>
      )}

      <FlatList
        data={AUDIO_TRACKS}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.trackList}
      />

      {AUDIO_TRACKS.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes-outline" size={48} color="#CCCCCC" />
          <Text style={styles.emptyStateText}>No music tracks available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FF4444',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedTrack: {
    backgroundColor: '#F0F7FF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedTrackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  selectedTrackName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
    height: 20,
  },
  sliderThumb: {
    backgroundColor: '#4A90E2',
    width: 16,
    height: 16,
  },
  trackList: {
    padding: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  trackItemSelected: {
    borderColor: '#4A90E2',
    backgroundColor: '#F0F7FF',
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  trackDuration: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 20,
    gap: 1,
  },
  waveformBar: {
    width: 2,
    backgroundColor: '#E0E0E0',
    borderRadius: 1,
  },
  trackControls: {
    flexDirection: 'row',
    gap: 8,
  },
  previewButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewButtonActive: {
    backgroundColor: '#4A90E2',
  },
  selectButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonActive: {
    backgroundColor: '#4A90E2',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default MusicPicker;