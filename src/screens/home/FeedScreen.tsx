import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { HomeStackScreenProps } from '../../types/navigation';

type Props = HomeStackScreenProps<'FeedScreen'>;

const FeedScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">PawSpace Feed</Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Sample Post</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            This is a sample post in the feed. Tap to view details.
          </Text>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('PostDetail', { 
              postId: '1', 
              userId: 'user1' 
            })}
            style={styles.button}
          >
            View Details
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  cardText: {
    marginVertical: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default FeedScreen;