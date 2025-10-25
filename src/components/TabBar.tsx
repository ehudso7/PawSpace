import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface TabItem {
  key: string;
  title: string;
}

interface Props {
  tabs: TabItem[];
  activeKey: string;
  onTabChange: (key: string) => void;
}

export default function TabBar({ tabs, activeKey, onTabChange }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((t) => (
        <Pressable key={t.key} style={styles.tab} onPress={() => onTabChange(t.key)}>
          <Text style={[styles.title, activeKey === t.key && styles.active]}>{t.title}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5e5',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  title: { color: '#666' },
  active: { color: '#000', fontWeight: '700' },
});
