import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';
import { useEditorStore } from '../../store/editorStore';
import ImageComparer from '../../components/create/ImageComparer';
import TransitionPreview from '../../components/create/TransitionPreview';
import StickerPicker from '../../components/create/StickerPicker';
import OverlayCanvas from '../../components/create/OverlayCanvas';
import { MUSIC_CLIPS } from '../../constants/music';

const TabButton: React.FC<{ title: string; active: boolean; onPress: () => void }> = ({ title, active, onPress }) => (
  <Pressable onPress={onPress} style={[styles.tabBtn, active ? styles.tabBtnActive : null]}>
    <Text style={[styles.tabBtnText, active ? styles.tabBtnTextActive : null]}>{title}</Text>
  </Pressable>
);

type TabKey = 'transition' | 'text' | 'stickers' | 'music' | 'frame';

const EditorScreen: React.FC = () => {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const store = useEditorStore();
  const { beforeImage, afterImage, transition } = store.present;

  const [activeTab, setActiveTab] = useState<TabKey>('transition');
  const [draftText, setDraftText] = useState('My pet glow-up ✨');
  const [font, setFont] = useState('System');
  const [color, setColor] = useState('#ffffff');
  const [size, setSize] = useState(22);

  if (!beforeImage || !afterImage) {
    return (
      <View style={styles.center}> 
        <Text style={{ color: '#fff' }}>Missing images. Go back to select.</Text>
        <Pressable onPress={() => nav.goBack()} style={[styles.primaryBtn, { marginTop: 12 }]}> 
          <Text style={styles.primaryBtnText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const onAddText = () => {
    const id = `text-${Date.now()}`;
    store.addText({ id, text: draftText, font, color, size, position: { x: 0.1, y: 0.1 } });
  };

  const onPickSticker = (uri: string) => {
    const id = `sticker-${Date.now()}`;
    store.addSticker({ id, uri, position: { x: 0.5, y: 0.5 }, scale: 1, rotation: 0 });
  };

  const onPickMusic = (id: string) => {
    const track = MUSIC_CLIPS.find((t) => t.id === id);
    if (track) store.setMusic({ id: track.id, name: track.name, uri: track.uri, duration: track.duration });
  };

  const onPreview = () => nav.navigate('Preview');

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => nav.goBack()} style={styles.iconBtn}><Text style={styles.iconTxt}>←</Text></Pressable>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable disabled={!store.canUndo()} onPress={store.undo} style={styles.iconBtn}><Text style={styles.iconTxt}>↶</Text></Pressable>
          <Pressable disabled={!store.canRedo()} onPress={store.redo} style={styles.iconBtn}><Text style={styles.iconTxt}>↷</Text></Pressable>
        </View>
        <Pressable onPress={onPreview} style={styles.primaryBtn}><Text style={styles.primaryBtnText}>Preview</Text></Pressable>
      </View>

      <View style={styles.previewArea}>
        {activeTab === 'transition' ? (
          <TransitionPreview beforeUri={beforeImage} afterUri={afterImage} transition={transition} />
        ) : (
          <View style={{ flex: 1 }}>
            <ImageComparer beforeUri={beforeImage} afterUri={afterImage} />
            {/* Simple overlay for now; could capture layout width/height via onLayout */}
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              <OverlayCanvas width={0} height={0} textOverlays={store.present.textOverlays} stickers={store.present.stickers} />
            </View>
          </View>
        )}
      </View>

      <View style={styles.toolbar}>
        <View style={styles.tabsRow}>
          <TabButton title="Transition" active={activeTab === 'transition'} onPress={() => setActiveTab('transition')} />
          <TabButton title="Text" active={activeTab === 'text'} onPress={() => setActiveTab('text')} />
          <TabButton title="Stickers" active={activeTab === 'stickers'} onPress={() => setActiveTab('stickers')} />
          <TabButton title="Music" active={activeTab === 'music'} onPress={() => setActiveTab('music')} />
          <TabButton title="Frame" active={activeTab === 'frame'} onPress={() => setActiveTab('frame')} />
        </View>

        <ScrollView contentContainerStyle={styles.tabBody}>
          {activeTab === 'transition' && (
            <View style={{ gap: 8 }}>
              <View style={styles.rowWrap}>
                {(['fade', 'slide', 'swipe', 'split'] as const).map((t) => (
                  <Pressable key={t} onPress={() => store.setTransition(t)} style={[styles.pill, store.present.transition === t && styles.pillActive]}>
                    <Text style={[styles.pillText, store.present.transition === t && styles.pillTextActive]}>{t.toUpperCase()}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'text' && (
            <View style={{ gap: 12 }}>
              <Text style={styles.inputLabel}>Caption</Text>
              <TextInput value={draftText} onChangeText={setDraftText} placeholder="Add a caption" placeholderTextColor="#64748b" style={styles.input} />
              <View style={styles.rowWrap}>
                {['System', 'Serif', 'Monospace', 'Cursive', 'Marker'].map((f) => (
                  <Pressable key={f} onPress={() => setFont(f)} style={[styles.pill, font === f && styles.pillActive]}>
                    <Text style={[styles.pillText, font === f && styles.pillTextActive]}>{f}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.rowWrap}>
                {['#ffffff', '#f87171', '#fb923c', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6', '#94a3b8', '#000000'].map((c) => (
                  <Pressable key={c} onPress={() => setColor(c)} style={[styles.colorSwatch, { backgroundColor: c }, color === c && styles.colorSwatchActive]} />
                ))}
              </View>
              <View style={styles.rowWrap}>
                {[18, 22, 26, 30, 36].map((s) => (
                  <Pressable key={s} onPress={() => setSize(s)} style={[styles.pill, size === s && styles.pillActive]}>
                    <Text style={[styles.pillText, size === s && styles.pillTextActive]}>{s}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable onPress={onAddText} style={styles.primaryBtn}><Text style={styles.primaryBtnText}>Add Text</Text></Pressable>
            </View>
          )}

          {activeTab === 'stickers' && (
            <StickerPicker onPick={onPickSticker} />
          )}

          {activeTab === 'music' && (
            <View style={{ gap: 8 }}>
              {MUSIC_CLIPS.map((m) => (
                <Pressable key={m.id} onPress={() => onPickMusic(m.id)} style={styles.trackRow}>
                  <Text style={{ color: '#fff', flex: 1 }}>{m.name}</Text>
                  <Text style={{ color: '#94a3b8' }}>{m.duration}s</Text>
                </Pressable>
              ))}
            </View>
          )}

          {activeTab === 'frame' && (
            <View style={{ gap: 8 }}>
              {['#ffffff', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#a78bfa'].map((c) => (
                <Pressable key={c} onPress={() => store.setFrame({ id: c, name: 'Border', color: c, width: 8 })} style={[styles.frameChoice, { borderColor: c }]} />
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <Pressable onPress={() => {}} style={[styles.secondaryBtn, { marginRight: 8 }]}>
            <Text style={styles.secondaryBtnText}>Save Draft</Text>
          </Pressable>
          <Pressable onPress={onPreview} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Preview</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1115' },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  iconBtn: { padding: 8, borderRadius: 8, backgroundColor: '#111827' },
  iconTxt: { color: '#fff', fontSize: 18 },
  previewArea: { flex: 6, backgroundColor: '#111827', margin: 12, borderRadius: 12, overflow: 'hidden' },
  toolbar: { flex: 4, backgroundColor: '#0b1220', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  tabsRow: { flexDirection: 'row', padding: 8, justifyContent: 'space-around' },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12 },
  tabBtnActive: { backgroundColor: '#1f2937' },
  tabBtnText: { color: '#94a3b8', fontWeight: '700' },
  tabBtnTextActive: { color: '#fff' },
  tabBody: { padding: 12 },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#111827', borderRadius: 999 },
  pillActive: { backgroundColor: '#4f46e5' },
  pillText: { color: '#cbd5e1' },
  pillTextActive: { color: '#fff' },
  input: { backgroundColor: '#111827', color: '#e5e7eb', borderRadius: 10, padding: 10 },
  inputLabel: { color: '#94a3b8', fontSize: 12 },
  colorSwatch: { width: 28, height: 28, borderRadius: 6, marginRight: 8 },
  colorSwatchActive: { borderWidth: 2, borderColor: '#fff' },
  frameChoice: { height: 36, borderWidth: 3, borderRadius: 10, marginVertical: 4 },
  bottomBar: { flexDirection: 'row', padding: 12 },
  primaryBtn: { backgroundColor: '#4f46e5', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  secondaryBtn: { backgroundColor: '#111827', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  secondaryBtnText: { color: '#e5e7eb', fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1115' },
});

export default EditorScreen;
