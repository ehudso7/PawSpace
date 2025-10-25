import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { CreateStackScreenProps } from '../../types/navigation';

export default function CreatePreviewScreen({ route, navigation }: CreateStackScreenProps<'CreatePreview'>) {
  const imageUri = route.params?.imageUri;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Preview</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      ) : (
        <Text>No image selected</Text>
      )}
      <Button mode="contained" onPress={() => navigation.goBack()} style={styles.primaryButton}>
        Post
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
  preview: {
    width: 240,
    height: 240,
    borderRadius: 12,
    marginVertical: 16,
    backgroundColor: '#eee',
  },
  primaryButton: {
    width: '100%',
    marginTop: 8,
  },
});
