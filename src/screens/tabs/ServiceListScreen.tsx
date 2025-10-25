import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip, useTheme } from 'react-native-paper';
import type { BookScreenProps } from '../../types/navigation';

type Props = BookScreenProps<'ServiceList'>;

const ServiceListScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const services = [
    { id: '1', name: 'Dog Walking', price: '$25/hour', rating: '4.8' },
    { id: '2', name: 'Pet Grooming', price: '$50/session', rating: '4.9' },
    { id: '3', name: 'Veterinary Care', price: '$75/visit', rating: '4.7' },
    { id: '4', name: 'Pet Sitting', price: '$30/day', rating: '4.6' },
    { id: '5', name: 'Training Classes', price: '$100/week', rating: '4.9' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.header}>
          Pet Services
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Browse and book professional pet care services
        </Text>

        <View style={styles.filters}>
          <Chip selected>All Services</Chip>
          <Chip>Dog Care</Chip>
          <Chip>Cat Care</Chip>
          <Chip>Veterinary</Chip>
        </View>

        {services.map((service) => (
          <Card 
            key={service.id} 
            style={styles.card} 
            mode="elevated"
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
          >
            <Card.Cover source={{ uri: `https://picsum.photos/700/30${service.id}` }} />
            <Card.Title 
              title={service.name} 
              subtitle={service.price}
              right={(props) => <Chip {...props}>⭐ {service.rating}</Chip>}
            />
            <Card.Content>
              <Text variant="bodyMedium">
                Professional pet care service with experienced staff.
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}>
                View Details
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
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
    marginBottom: 16,
    opacity: 0.7,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
});

export default ServiceListScreen;
