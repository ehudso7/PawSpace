import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  imageUri?: string | null;
  onPickCamera: () => void;
  onPickLibrary: () => void;
  onPickRecent: () => void;
  onRemove: () => void;
}

export default function UploadCard({ label, imageUri, onPickCamera, onPickLibrary, onPickRecent, onRemove }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.zone} onPress={() => setOpen(true)}>
        {!imageUri ? (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={36} color="#64748b" />
            <Text style={styles.placeholderText}>Tap to upload</Text>
          </View>
        ) : (
          <>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <Pressable onPress={onRemove} style={styles.removeBtn}>
              <Ionicons name="close" size={16} color="#0b0f14" />
            </Pressable>
          </>
        )}
      </Pressable>
      <Text style={styles.hint}>Best: Square, 800-4096px</Text>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.menuBackdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <Pressable style={styles.menuItem} onPress={() => { setOpen(false); onPickCamera(); }}>
              <Ionicons name="camera" size={18} color="#fff" />
              <Text style={styles.menuText}>Take Photo</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => { setOpen(false); onPickLibrary(); }}>
              <Ionicons name="images" size={18} color="#fff" />
              <Text style={styles.menuText}>Choose from Library</Text>
            </Pressable>
            <Pressable style={styles.menuItem} onPress={() => { setOpen(false); onPickRecent(); }}>
              <Ionicons name="time" size={18} color="#fff" />
              <Text style={styles.menuText}>Recent transformations</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#121821', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1f2937', gap: 8 },
  label: { color: '#9ca3af', fontWeight: '600' },
  zone: { backgroundColor: '#0b0f14', borderRadius: 8, borderWidth: 1, borderColor: '#1f2937', height: 200, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  placeholder: { alignItems: 'center', gap: 6 },
  placeholderText: { color: '#64748b' },
  preview: { width: '100%', height: '100%' },
  removeBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: '#f59e0b', borderRadius: 999, padding: 6 },
  hint: { color: '#475569', fontSize: 12 },
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 },
  menu: { backgroundColor: '#111827', borderRadius: 12, padding: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8 },
  menuText: { color: '#e5e7eb' },
});
