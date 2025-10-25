import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { CreateStackScreenProps } from '../../types/navigation';

export default function ImageSelectorScreen({ navigation }: CreateStackScreenProps<'ImageSelector'>) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Create</Text>
      <Text style={styles.subtitle}>Pick an image to share</Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('CreatePreview', { imageUri: 'file:///image.jpg' })}
        style={styles.primaryButton}
      >
        Choose an image
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    opacity: 0.7,
  },
  primaryButton: {
    width: '100%',
    marginBottom: 8,
  },
});
