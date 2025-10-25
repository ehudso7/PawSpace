import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { BookStackScreenProps } from '../../types/navigation';

export default function ServiceDetailScreen({ route, navigation }: BookStackScreenProps<'ServiceDetail'>) {
  const { serviceId } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Service Detail</Text>
      <Text style={styles.subtitle}>Service ID: {serviceId}</Text>

      <Button onPress={() => navigation.goBack()}>Back to services</Button>
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
