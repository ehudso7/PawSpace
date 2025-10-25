import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ message, size = 'large' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#007AFF" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default Loading;
