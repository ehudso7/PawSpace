import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { useEditorStore } from '../../store/editorStore';
import TransitionPreview from '../../components/create/TransitionPreview';

const PreviewScreen: React.FC = () => {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { beforeImage, afterImage, transition } = useEditorStore((s) => s.present);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => nav.goBack()} style={styles.iconBtn}><Text style={styles.iconTxt}>←</Text></Pressable>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Preview</Text>
        <View style={{ width: 32 }} />
      </View>

      {beforeImage && afterImage ? (
        <View style={styles.previewBox}>
          <TransitionPreview beforeUri={beforeImage} afterUri={afterImage} transition={transition} />
        </View>
      ) : (
        <View style={[styles.previewBox, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: '#94a3b8' }}>No images</Text>
        </View>
      )}

      <View style={styles.bottomBar}>
        <Pressable onPress={() => nav.goBack()} style={styles.secondaryBtn}><Text style={styles.secondaryBtnText}>Back</Text></Pressable>
        <Pressable onPress={() => {}} style={styles.primaryBtn}><Text style={styles.primaryBtnText}>Save</Text></Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  topBar: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  iconBtn: { padding: 8, borderRadius: 8, backgroundColor: '#111827' },
  iconTxt: { color: '#fff', fontSize: 18 },
  previewBox: { flex: 1, margin: 16, borderRadius: 16, overflow: 'hidden', backgroundColor: '#111827' },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  primaryBtn: { backgroundColor: '#4f46e5', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: { backgroundColor: '#111827', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  secondaryBtnText: { color: '#e5e7eb', fontWeight: '700' },
});

export default PreviewScreen;
