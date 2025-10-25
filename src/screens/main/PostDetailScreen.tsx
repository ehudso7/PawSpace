import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { HomeStackScreenProps } from '../../types/navigation';

export default function PostDetailScreen({ route, navigation }: HomeStackScreenProps<'PostDetail'>) {
  const { postId } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Post Detail</Text>
      <Text style={styles.subtitle}>Post ID: {postId}</Text>

      <Button onPress={() => navigation.goBack()}>Back to feed</Button>
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
});
