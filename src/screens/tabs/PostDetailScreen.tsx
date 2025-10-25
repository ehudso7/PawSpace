import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';
import type { HomeScreenProps } from '../../types/navigation';

type Props = HomeScreenProps<'PostDetail'>;

const PostDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { postId } = route.params;
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card} mode="elevated">
        <Card.Cover source={{ uri: 'https://picsum.photos/700/400' }} />
        <Card.Title title="Post Detail" subtitle="Posted by User" />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.description}>
            Post ID: {postId}
          </Text>
          <Text variant="bodyLarge" style={styles.content}>
            This is the detailed view of a post. Here you can see the full content,
            comments, and interact with the post.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button>Like</Button>
          <Button>Comment</Button>
          <Button>Share</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
  },
  content: {
    lineHeight: 24,
  },
});

export default PostDetailScreen;
