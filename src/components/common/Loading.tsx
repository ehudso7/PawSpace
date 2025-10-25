import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Loading(): JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
