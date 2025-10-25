import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useVideoGeneration } from '../hooks/useVideoGeneration';
import { ProgressOverlay } from '../components/ProgressOverlay';
import { saveToDevice } from '../utils/save';
import { shareTransformation } from '../utils/sharing';

interface Props {
  beforeUri: string;
  afterUri: string;
}

export const PreviewScreen: React.FC<Props> = ({ beforeUri, afterUri }) => {
  const { state, generate, reset } = useVideoGeneration();
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [gifUrl, setGifUrl] = useState<string | undefined>();

  const onPreview = async () => {
    try {
      const res = await generate({ beforeUri, afterUri, caption: 'My transformation', transition: 'crossfade' });
      setVideoUrl(res.videoUrl);
      setGifUrl(res.gifUrl);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  const onSave = async () => {
    const uri = videoUrl || gifUrl;
    if (!uri) return;
    const ok = await saveToDevice(uri);
    Alert.alert(ok ? 'Saved' : 'Not saved', ok ? 'Saved to gallery' : 'Permission denied');
  };

  const onShare = async () => {
    const uri = videoUrl || gifUrl;
    if (!uri) return;
    await shareTransformation(uri, 'Check out my look!', videoUrl ? 'video/mp4' : 'image/gif');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Preview</Text>
        <View style={styles.row}>
          <Image source={{ uri: beforeUri }} style={styles.image} />
          <Image source={{ uri: afterUri }} style={styles.image} />
        </View>

        <TouchableOpacity style={styles.button} onPress={onPreview}>
          <Text style={styles.buttonText}>Create Transformation</Text>
        </TouchableOpacity>

        {videoUrl ? (
          <Video
            source={{ uri: videoUrl }}
            isLooping
            shouldPlay
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
          />
        ) : null}
        {!videoUrl && gifUrl ? (
          <Image source={{ uri: gifUrl }} style={styles.video} />
        ) : null}

        {(videoUrl || gifUrl) ? (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.secondary} onPress={onSave}>
              <Text style={styles.secondaryText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={onShare}>
              <Text style={styles.secondaryText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={reset}>
              <Text style={styles.secondaryText}>Reset</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>

      <ProgressOverlay visible={state.status !== 'idle' && state.status !== 'done' && state.status !== 'error'} state={state} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  content: { padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  image: { width: '48%', aspectRatio: 3/4, borderRadius: 10, backgroundColor: '#111' },
  button: { backgroundColor: '#4f46e5', paddingVertical: 12, borderRadius: 10, marginTop: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  video: { width: '100%', aspectRatio: 9/16, borderRadius: 10, backgroundColor: '#111', marginTop: 16 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  secondary: { flex: 1, paddingVertical: 10, backgroundColor: '#1f2937', borderRadius: 10, marginHorizontal: 4, alignItems: 'center' },
  secondaryText: { color: '#fff' },
});
