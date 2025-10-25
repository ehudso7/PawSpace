import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, useTheme, FAB } from 'react-native-paper';
import type { HomeScreenProps } from '../../types/navigation';

type Props = HomeScreenProps<'Feed'>;

const FeedScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.header}>
          Feed
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Your personalized pet feed will appear here.
        </Text>

        {/* Sample posts */}
        <Card style={styles.card} mode="elevated">
          <Card.Cover source={{ uri: 'https://picsum.photos/700/400' }} />
          <Card.Title title="Sample Post" subtitle="2 hours ago" />
          <Card.Content>
            <Text variant="bodyMedium">
              This is a sample post. Your feed will show posts from other pet owners!
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Cover source={{ uri: 'https://picsum.photos/700/401' }} />
          <Card.Title title="Another Post" subtitle="5 hours ago" />
          <Card.Content>
            <Text variant="bodyMedium">
              Share your pet's adventures with the community!
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('CreateTab', { screen: 'ImageSelector' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 24,
    opacity: 0.7,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default FeedScreen;
