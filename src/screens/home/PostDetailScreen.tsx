import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { HomeStackScreenProps } from '../../types/navigation';

type Props = HomeStackScreenProps<'PostDetail'>;

const PostDetailScreen: React.FC<Props> = ({ route }) => {
  const { postId, userId } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Post Details</Text>
      <Text variant="bodyLarge">Post ID: {postId}</Text>
      <Text variant="bodyLarge">User ID: {userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
});

export default PostDetailScreen;