import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Card, Text, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { usePets } from '@/context/PetsContext';

export default function MyPetsScreen() {
  const { pets } = usePets();
  const navigation = useNavigation<any>();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Button icon="plus" mode="contained" onPress={() => navigation.navigate('PetModal')}>Add Pet</Button>
      <View style={{ height: 12 }} />
      {pets.map((p) => (
        <Card key={p.id} style={{ marginBottom: 12 }} onPress={() => navigation.navigate('PetModal', { petId: p.id })}>
          <Card.Title title={p.name} subtitle={`${p.species}${p.breed ? ' • ' + p.breed : ''}`} left={(props) => (
            p.photoUri ? <Avatar.Image {...props} source={{ uri: p.photoUri }} /> : <Avatar.Icon {...props} icon="paw" />
          )} />
          <Card.Content>
            {p.age ? <Text>Age: {p.age}</Text> : null}
            {p.weight ? <Text>Weight: {p.weight}</Text> : null}
            {p.notes ? <Text>Notes: {p.notes}</Text> : null}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
