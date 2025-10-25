import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PreviewScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>PreviewScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
