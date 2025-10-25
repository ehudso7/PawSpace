import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, FAB, useTheme } from 'react-native-paper';
import type { ProfileScreenProps } from '../../types/navigation';

type Props = ProfileScreenProps<'MyPets'>;

const MyPetsScreen: React.FC<Props> = () => {
  const theme = useTheme();

  const pets = [
    {
      id: '1',
      name: 'Max',
      type: 'Dog',
      breed: 'Golden Retriever',
      age: '3 years',
      image: 'https://picsum.photos/400/300?random=1',
    },
    {
      id: '2',
      name: 'Luna',
      type: 'Cat',
      breed: 'Persian',
      age: '2 years',
      image: 'https://picsum.photos/400/300?random=2',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.header}>
          My Pets
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Manage your pet profiles
        </Text>

        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No pets added yet
            </Text>
            <Button mode="contained" style={styles.emptyButton}>
              Add Your First Pet
            </Button>
          </View>
        ) : (
          pets.map((pet) => (
            <Card key={pet.id} style={styles.card} mode="elevated">
              <Card.Cover source={{ uri: pet.image }} />
              <Card.Title
                title={pet.name}
                subtitle={`${pet.breed} • ${pet.age}`}
              />
              <Card.Content>
                <Text variant="bodyMedium">
                  Type: {pet.type}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button>Edit</Button>
                <Button>View Profile</Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        label="Add Pet"
        onPress={() => {}}
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
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default MyPetsScreen;
