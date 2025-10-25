import React from 'react';
<<<<<<< HEAD
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  text,
  fullScreen = false,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {text && <Text style={styles.text}>{text}</Text>}
=======
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
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< HEAD
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default Loading;
=======
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
>>>>>>> origin/main
