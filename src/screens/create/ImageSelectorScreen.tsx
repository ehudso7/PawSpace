import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ActivityIndicator, Alert, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { ensurePermissionsOrThrow, pickFromLibrary, takePhoto, type PickedImage } from '@/utils/image';
import UploadCard from '@/components/create/UploadCard';
import { useEditorStore } from '@/store/editorStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_KEY = 'recentImages';

type Slot = 'before' | 'after';

export default function ImageSelectorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setBefore = useEditorStore((s) => s.setBeforeImage);
  const setAfter = useEditorStore((s) => s.setAfterImage);
  const [before, setBeforeLocal] = useState<PickedImage | null>(null);
  const [after, setAfterLocal] = useState<PickedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [pickerFor, setPickerFor] = useState<Slot | null>(null);
  const [showRecent, setShowRecent] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(RECENT_KEY).then((raw) => {
      if (raw) setRecent(JSON.parse(raw));
    });
  }, []);

  const openPicker = useCallback(async (slot: Slot, source: 'camera' | 'library' | 'recent') => {
    try {
      if (source === 'recent') {
        setPickerFor(slot);
        setShowRecent(true);
        return;
      }
      setLoading(true);
      await ensurePermissionsOrThrow();
      const img = source === 'camera' ? await takePhoto() : await pickFromLibrary();
      if (!img) return;
      if (slot === 'before') setBeforeLocal(img); else setAfterLocal(img);
    } catch (e: any) {
      Alert.alert('Image Error', e?.message ?? 'Failed to select image.');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeImg = useCallback((slot: Slot) => {
    if (slot === 'before') setBeforeLocal(null); else setAfterLocal(null);
  }, []);

  const canContinue = !!before && !!after;

  const onContinue = useCallback(async () => {
    if (!before || !after) return;
    setBefore(before.uri);
    setAfter(after.uri);
    // store recents
    const nextRecent = [before.uri, after.uri, ...recent].filter(Boolean).slice(0, 30);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));
    navigation.navigate('Editor');
  }, [before, after, navigation, recent, setAfter, setBefore]);

  const renderRecent = useCallback(({ item }: { item: string }) => (
    <Pressable style={styles.recentItem} onPress={() => {
      if (!pickerFor) return;
      const img: PickedImage = { uri: item, width: 1000, height: 1000 };
      if (pickerFor === 'before') setBeforeLocal(img); else setAfterLocal(img);
      setShowRecent(false);
    }}>
      <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} />
    </Pressable>
  ), [pickerFor]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create a transformation to showcase your pet care work</Text>
        <Text style={styles.subtitle}>Upload before and after photos</Text>
      </View>

      <View style={styles.row}>
        <UploadCard
          label="Before"
          imageUri={before?.uri}
          onPickCamera={() => openPicker('before', 'camera')}
          onPickLibrary={() => openPicker('before', 'library')}
          onPickRecent={() => openPicker('before', 'recent')}
          onRemove={() => removeImg('before')}
        />
        <UploadCard
          label="After"
          imageUri={after?.uri}
          onPickCamera={() => openPicker('after', 'camera')}
          onPickLibrary={() => openPicker('after', 'library')}
          onPickRecent={() => openPicker('after', 'recent')}
          onRemove={() => removeImg('after')}
        />
      </View>

      <View style={styles.requirements}>
        <Text style={styles.reqText}>Best quality: Square images, minimum 800x800px</Text>
      </View>

      <Pressable disabled={!canContinue} onPress={onContinue} style={[styles.cta, !canContinue && { opacity: 0.5 }]}> 
        {canContinue && (
          <View style={styles.previewThumbs}>
            <Image source={{ uri: before!.uri }} style={styles.thumb} />
            <Image source={{ uri: after!.uri }} style={styles.thumb} />
          </View>
        )}
        <Text style={styles.ctaText}>Continue</Text>
      </Pressable>

      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: '#fff', marginTop: 8 }}>Processing image…</Text>
        </View>
      </Modal>

      <Modal visible={showRecent} transparent animationType="slide" onRequestClose={() => setShowRecent(false)}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Recent images</Text>
          <FlatList data={recent} numColumns={3} keyExtractor={(u, i) => u + i} renderItem={renderRecent} contentContainerStyle={{ gap: 8 }} columnWrapperStyle={{ gap: 8 }} />
          <Pressable onPress={() => setShowRecent(false)} style={styles.sheetClose}><Text style={{ color: '#fff', fontWeight: '600' }}>Close</Text></Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16, backgroundColor: '#0b0f14' },
  card: { backgroundColor: '#121821', borderRadius: 12, padding: 16, borderColor: '#1f2937', borderWidth: 1 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#9ca3af' },
  row: { flexDirection: 'row', gap: 12 },
  requirements: { padding: 12, alignItems: 'center' },
  reqText: { color: '#9ca3af' },
  cta: { marginTop: 'auto', backgroundColor: '#22c55e', paddingVertical: 14, alignItems: 'center', borderRadius: 12, flexDirection: 'row', justifyContent: 'center', gap: 12 },
  ctaText: { color: '#0b0f14', fontWeight: '700', fontSize: 16 },
  previewThumbs: { position: 'absolute', left: 16, flexDirection: 'row', gap: 8 },
  thumb: { width: 28, height: 28, borderRadius: 6 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  sheet: { marginTop: 'auto', backgroundColor: '#121821', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, gap: 12 },
  sheetTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sheetClose: { backgroundColor: '#334155', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  recentItem: { width: '31%', aspectRatio: 1, borderRadius: 8, overflow: 'hidden', backgroundColor: '#111827' },
});
