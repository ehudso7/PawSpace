import React from 'react';
<<<<<<< HEAD
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
=======
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
>>>>>>> origin/main

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
}

<<<<<<< HEAD
const Loading: React.FC<LoadingProps> = ({ message, size = 'large' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#007AFF" />
      {message && <Text style={styles.message}>{message}</Text>}
=======
const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', size = 'large' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#007AFF" />
      <Text style={styles.text}>{message}</Text>
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
  },
  message: {
=======
    padding: 20,
  },
  text: {
>>>>>>> origin/main
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

<<<<<<< HEAD
export default Loading;
=======
export default Loading;
>>>>>>> origin/main
