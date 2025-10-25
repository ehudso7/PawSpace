import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Video } from 'expo-av';
import { useExportTransformation } from '../hooks/useExportTransformation';
import { ProgressBar } from '../components/ProgressBar';
import { saveToDevice } from '../utils/saveToDevice';
import { shareTransformation, shareToInstagramStories } from '../utils/sharing';

interface PreviewScreenProps {
  beforeUri: string;
  afterUri: string;
  caption: string;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({ beforeUri, afterUri, caption }) => {
  const { state, startPreview, reset } = useExportTransformation();
  const [isSaving, setIsSaving] = useState(false);

  const onPreview = useCallback(() => {
    startPreview({ beforeUri, afterUri, caption, isPublic: false, hasMusic: false, transitionType: 'crossfade' });
  }, [beforeUri, afterUri, caption, startPreview]);

  const onSave = useCallback(async () => {
    if (!state.videoUrl && !state.gifUrl) return;
    try {
      setIsSaving(true);
      const ok = await saveToDevice(state.videoUrl || state.gifUrl!);
      // eslint-disable-next-line no-alert
      alert(ok ? 'Saved to your library.' : 'Storage permission denied.');
    } finally {
      setIsSaving(false);
    }
  }, [state.videoUrl, state.gifUrl]);

  const onShare = useCallback(async () => {
    if (!state.videoUrl && !state.gifUrl) return;
    await shareTransformation(state.videoUrl || state.gifUrl!, caption);
  }, [state.videoUrl, state.gifUrl, caption]);

  const onShareIG = useCallback(async () => {
    await shareToInstagramStories();
  }, []);

  const isBusy = state.status !== 'idle' && state.status !== 'complete' && state.status !== 'error';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Preview</Text>

        {state.status === 'idle' && (
          <>
            <View style={styles.previewRow}>
              <Image source={{ uri: beforeUri }} style={styles.image} />
              <Image source={{ uri: afterUri }} style={styles.image} />
            </View>
            <Button title="Preview" onPress={onPreview} />
          </>
        )}

        {isBusy && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Creating your transformation…</Text>
            <ProgressBar progress={state.progress} />
            {state.message ? <Text style={styles.message}>{state.message}</Text> : null}
          </View>
        )}

        {state.status === 'error' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>{state.error || 'Unknown error'}</Text>
            <Button title="Try again" onPress={reset} />
          </View>
        )}

        {state.status === 'complete' && (
          <View style={styles.result}>
            {state.videoUrl ? (
              <Video
                style={styles.video}
                source={{ uri: state.videoUrl }}
                useNativeControls
                resizeMode="contain"
                isLooping
                shouldPlay
              />
            ) : state.gifUrl ? (
              <Image source={{ uri: state.gifUrl }} style={styles.video} />
            ) : null}

            <View style={styles.actions}>
              <Button title={isSaving ? 'Saving…' : 'Save to device'} onPress={onSave} disabled={isSaving} />
              <Button title="Share" onPress={onShare} />
              <Button title="Instagram Story" onPress={onShareIG} />
              <Button title="New" onPress={reset} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: '600' },
  previewRow: { flexDirection: 'row', gap: 12, justifyContent: 'center' },
  image: { width: 160, height: 240, borderRadius: 8, backgroundColor: '#eee' },
  loading: { gap: 12, alignItems: 'center' },
  loadingText: { fontSize: 16 },
  message: { color: '#666' },
  errorBox: { gap: 8, padding: 12, backgroundColor: '#FEE2E2', borderRadius: 8 },
  errorTitle: { fontWeight: '600', color: '#991B1B' },
  errorText: { color: '#7F1D1D' },
  result: { gap: 12 },
  video: { width: '100%', height: 400, backgroundColor: '#000', borderRadius: 8 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
});
