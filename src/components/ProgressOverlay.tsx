import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ProgressState } from '../types/transformations';

interface Props {
  visible: boolean;
  state: ProgressState;
}

export const ProgressOverlay: React.FC<Props> = ({ visible, state }) => {
  if (!visible) return null;
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.box}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.title}>{state.message || 'Working...'}</Text>
        <View style={styles.barContainer}>
          <View style={[styles.bar, { width: `${Math.round((state.progress || 0) * 100)}%` }]} />
        </View>
        {state.error ? <Text style={styles.error}>{state.error}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: '80%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  barContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 12,
  },
  bar: {
    height: '100%',
    backgroundColor: '#4ade80',
  },
  error: {
    color: '#fecaca',
    textAlign: 'center',
    marginTop: 8,
  },
});
