import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CreateStackParamList } from '../../../types/navigation';

export type ImageSelectorScreenProps = NativeStackScreenProps<CreateStackParamList, 'ImageSelector'>;

const ImageSelectorScreen: React.FC<ImageSelectorScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium">Create</Text>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('CreatePost', { imageUri: 'demo-uri' })}
      >
        Continue to Post
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default ImageSelectorScreen;
