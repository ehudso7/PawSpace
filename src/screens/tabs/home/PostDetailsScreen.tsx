import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../types/navigation';

export type PostDetailsScreenProps = NativeStackScreenProps<
  HomeStackParamList,
  'PostDetails'
>;

const PostDetailsScreen: React.FC<PostDetailsScreenProps> = ({ route }) => {
  const theme = useTheme();
  const { postId } = route.params;
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium">Post Details</Text>
      <Text style={styles.meta}>Post ID: {postId}</Text>
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

export default PostDetailsScreen;
