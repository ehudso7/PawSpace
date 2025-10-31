import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface LoadingProps {
  size?: 'small' | 'large';
  text?: string;
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  text,
  message,
  fullScreen = false,
}) => {
  const displayText = text || message;
  
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {displayText && <Text style={styles.text}>{displayText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
