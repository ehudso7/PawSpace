import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CreateStackParamList } from '../../../types/navigation';

export type CreatePostScreenProps = NativeStackScreenProps<
  CreateStackParamList,
  'CreatePost'
>;

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ route }) => {
  const theme = useTheme();
  const imageUri = route.params?.imageUri;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium">Create Post</Text>
      {imageUri ? <Text style={styles.meta}>Image: {imageUri}</Text> : null}
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
  meta: {
    marginTop: 8,
  },
});

export default CreatePostScreen;
