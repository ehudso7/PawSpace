import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0..1
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = 6 }) => {
  const pct = Math.max(0, Math.min(1, progress || 0));
  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.fill, { width: `${pct * 100}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4F46E5',
  },
});
