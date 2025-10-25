import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { AudioTrack } from '../../types/editor';
import { useEditorStore } from '../../store/editorStore';

// Sample music tracks (in a real app, these would be actual audio files)
const MUSIC_TRACKS: AudioTrack[] = [
  { id: 'm1', name: 'Happy Paws', uri: 'happy-paws.mp3', duration: 15 },
  { id: 'm2', name: 'Playful Moments', uri: 'playful.mp3', duration: 12 },
  { id: 'm3', name: 'Gentle Grooming', uri: 'gentle.mp3', duration: 14 },
  { id: 'm4', name: 'Energetic Play', uri: 'energetic.mp3', duration: 10 },
  { id: 'm5', name: 'Relaxing Spa', uri: 'spa.mp3', duration: 15 },
  { id: 'm6', name: 'Transformation Magic', uri: 'magic.mp3', duration: 13 },
  { id: 'm7', name: 'Before & After', uri: 'before-after.mp3', duration: 11 },
  { id: 'm8', name: 'Fresh & Clean', uri: 'fresh.mp3', duration: 12 },
  { id: 'm9', name: 'Pampered Pets', uri: 'pampered.mp3', duration: 14 },
  { id: 'm10', name: 'Grooming Time', uri: 'grooming.mp3', duration: 10 },
  { id: 'm11', name: 'Pet Care Love', uri: 'care-love.mp3', duration: 15 },
  { id: 'm12', name: 'Makeover Magic', uri: 'makeover.mp3', duration: 13 },
  { id: 'm13', name: 'Beauty Transformation', uri: 'beauty.mp3', duration: 12 },
  { id: 'm14', name: 'Spa Day Vibes', uri: 'spa-vibes.mp3', duration: 14 },
  { id: 'm15', name: 'Pet Perfection', uri: 'perfection.mp3', duration: 11 },
];

interface MusicPickerProps {
  onClose?: () => void;
}

export const MusicPicker: React.FC<MusicPickerProps> = ({ onClose }) => {
  const { music, setMusic } = useEditorStore();
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [volume, setVolume] = useState(0.8);

  const handlePlayPreview = async (track: AudioTrack) => {
    try {
      // Stop current sound if playing
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      if (playingTrack === track.id) {
        setPlayingTrack(null);
        return;
      }

      // In a real app, load and play the actual audio file
      // const { sound: newSound } = await Audio.Sound.createAsync(
      //   { uri: track.uri },
      //   { shouldPlay: true, volume }
      // );
      // setSound(newSound);
      setPlayingTrack(track.id);

      // Simulate audio end
      setTimeout(() => {
        setPlayingTrack(null);
      }, track.duration * 1000);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleSelectTrack = (track: AudioTrack) => {
    setMusic(track);
  };

  const handleRemoveMusic = () => {
    setMusic(undefined);
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
      setSound(null);
    }
    setPlayingTrack(null);
  };

  const renderTrackItem = ({ item }: { item: AudioTrack }) => {
    const isSelected = music?.id === item.id;
    const isPlaying = playingTrack === item.id;

    return (
      <TouchableOpacity
        style={[styles.trackItem, isSelected && styles.trackItemSelected]}
        onPress={() => handleSelectTrack(item)}
      >
        <View style={styles.trackInfo}>
          <Text style={[styles.trackName, isSelected && styles.trackNameSelected]}>
            {item.name}
          </Text>
          <Text style={styles.trackDuration}>{item.duration}s</Text>
        </View>

        <View style={styles.trackActions}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => handlePlayPreview(item)}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={20}
              color={isSelected ? '#FFF' : '#6B4EFF'}
            />
          </TouchableOpacity>

          {isSelected && (
            <TouchableOpacity
              style={styles.checkButton}
              onPress={() => handleRemoveMusic()}
            >
              <Ionicons name="checkmark-circle" size={24} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Waveform visualization placeholder */}
        {isPlaying && (
          <View style={styles.waveform}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waveformBar,
                  { height: Math.random() * 20 + 10 },
                ]}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Background Music</Text>
        {music && (
          <TouchableOpacity onPress={handleRemoveMusic}>
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      {music && (
        <View style={styles.volumeControl}>
          <Ionicons name="volume-low" size={20} color="#666" />
          <View style={styles.volumeSliderContainer}>
            <View style={[styles.volumeSlider, { width: `${volume * 100}%` }]} />
          </View>
          <Ionicons name="volume-high" size={20} color="#666" />
        </View>
      )}

      <FlatList
        data={MUSIC_TRACKS}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.trackList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.hint}>
        <Ionicons name="information-circle-outline" size={16} color="#666" />
        <Text style={styles.hintText}>
          Tap to select, tap play button to preview
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  removeText: {
    fontSize: 14,
    color: '#FF3B30',
    fontWeight: '500',
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
  },
  volumeSliderContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  volumeSlider: {
    height: '100%',
    backgroundColor: '#6B4EFF',
    borderRadius: 2,
  },
  trackList: {
    padding: 16,
  },
  trackItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackItemSelected: {
    backgroundColor: '#6B4EFF',
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  trackNameSelected: {
    color: '#FFF',
  },
  trackDuration: {
    fontSize: 12,
    color: '#666',
  },
  trackActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkButton: {
    marginLeft: 8,
  },
  waveform: {
    position: 'absolute',
    bottom: 4,
    left: 16,
    right: 16,
    height: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    opacity: 0.3,
  },
  waveformBar: {
    width: 2,
    backgroundColor: '#6B4EFF',
    borderRadius: 1,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  hintText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
});
