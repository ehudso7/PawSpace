import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import type { BookStackScreenProps } from '../../types/navigation';

export default function ServiceListScreen({ navigation }: BookStackScreenProps<'ServiceList'>) {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Book a Service</Text>
      <Text style={styles.subtitle}>Browse pet care services</Text>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('ServiceDetail', { serviceId: 'dog-walking' })}
        style={styles.primaryButton}
      >
        View service detail
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
