import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import BottomButton from '../../components/common/BottomButton';
import { pickFromLibrary, takePhoto, requestPermissions } from '../../utils/imagePicker';
import { useEditorStore } from '../../store/editorStore';

const Card: React.FC<{
  label: string;
  uri?: string;
  onPick: () => Promise<void>;
  onClear: () => void;
  loading: boolean;
}> = ({ label, uri, onPick, onClear, loading }) => {
  return (
    <Pressable style={styles.card} onPress={onPick}>
      <Text style={styles.cardLabel}>{label}</Text>
      <View style={styles.cardBody}>
        {loading ? (
          <ActivityIndicator color="#93c5fd" />
        ) : uri ? (
          <>
            <Image source={{ uri }} style={styles.thumb} />
            <Pressable onPress={onClear} style={styles.clearBtn}>
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.placeholder}>Tap to upload</Text>
        )}
      </View>
      <Text style={styles.hint}>Take Photo • Choose from Library</Text>
    </Pressable>
  );
};

const ImageSelectorScreen: React.FC = () => {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { present, setBefore, setAfter } = useEditorStore((s) => ({ present: s.present, setBefore: s.setBefore, setAfter: s.setAfter }));

  const [loading, setLoading] = useState<'before' | 'after' | null>(null);
  const beforeUri = present.beforeImage;
  const afterUri = present.afterImage;

  const onPick = async (which: 'before' | 'after') => {
    setLoading(which);
    try {
      const hasPerm = await requestPermissions();
      if (!hasPerm) return;

      // In a full sheet, we'd show options. Here choose library first.
      const fromLib = await pickFromLibrary();
      const image = fromLib ?? (await takePhoto());
      if (!image) return;
      if (which === 'before') setBefore(image.uri);
      else setAfter(image.uri);
    } finally {
      setLoading(null);
    }
  };

  const onContinue = () => {
    nav.navigate('Editor');
  };

  return (
    <View style={styles.container}>
      <View style={styles.instructions}>
        <Text style={styles.title}>Create a transformation to showcase your pet care work</Text>
        <Text style={styles.subtitle}>Upload before and after photos</Text>
      </View>

      <View style={styles.row}>
        <Card
          label="Before"
          uri={beforeUri}
          loading={loading === 'before'}
          onPick={() => onPick('before')}
          onClear={() => setBefore(undefined)}
        />
        <Card
          label="After"
          uri={afterUri}
          loading={loading === 'after'}
          onPick={() => onPick('after')}
          onClear={() => setAfter(undefined)}
        />
      </View>

      <View style={styles.reqs}> 
        <Text style={styles.reqsText}>Best quality: Square images, minimum 800x800px</Text>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', marginBottom: 8, opacity: beforeUri && afterUri ? 1 : 0.5 }}>
          {beforeUri ? <Image source={{ uri: beforeUri }} style={{ width: 48, height: 48, borderRadius: 8, marginRight: 8 }} /> : null}
          {afterUri ? <Image source={{ uri: afterUri }} style={{ width: 48, height: 48, borderRadius: 8 }} /> : null}
        </View>
      </View>
      <BottomButton title="Continue" disabled={!beforeUri || !afterUri} onPress={onContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115', paddingTop: 12 },
  instructions: { paddingHorizontal: 16, paddingBottom: 12 },
  title: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#cbd5e1', fontSize: 14 },
  row: { flexDirection: 'row', paddingHorizontal: 8 },
  card: {
    flex: 1,
    backgroundColor: '#111827',
    margin: 8,
    borderRadius: 16,
    padding: 12,
  },
  cardLabel: { color: '#e5e7eb', fontWeight: '700', marginBottom: 8 },
  cardBody: {
    height: 200,
    borderRadius: 12,
    backgroundColor: '#0b1220',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholder: { color: '#64748b' },
  thumb: { width: '100%', height: '100%', resizeMode: 'cover' },
  clearBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: { color: '#fff', fontSize: 18, lineHeight: 18 },
  hint: { color: '#94a3b8', fontSize: 12, marginTop: 8 },
  reqs: { paddingHorizontal: 16, paddingVertical: 12 },
  reqsText: { color: '#94a3b8', fontSize: 13 },
});

export default ImageSelectorScreen;
