import React from 'react';
import { Image, ImageProps, StyleSheet } from 'react-native';

// This is a placeholder for react-native-fast-image
// In a real app, you would install and import from 'react-native-fast-image'
interface FastImageProps extends Omit<ImageProps, 'source'> {
  source: {
    uri: string;
    priority?: 'low' | 'normal' | 'high';
    cache?: 'immutable' | 'web' | 'cacheOnly';
  };
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
}

export const FastImage: React.FC<FastImageProps> = ({ 
  source, 
  resizeMode = 'cover',
  style,
  ...props 
}) => {
  return (
    <Image
      source={{ uri: source.uri }}
      resizeMode={resizeMode}
      style={style}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  // Add any default styles here
});