import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List, Divider, useTheme } from 'react-native-paper';
import type { BookScreenProps } from '../../types/navigation';

type Props = BookScreenProps<'ServiceDetail'>;

const ServiceDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { serviceId } = route.params;
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card} mode="elevated">
        <Card.Cover source={{ uri: `https://picsum.photos/700/400` }} />
        <Card.Title 
          title="Service Name" 
          subtitle="$50 per session"
        />
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            About This Service
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            Service ID: {serviceId}
          </Text>
          <Text variant="bodyLarge" style={styles.content}>
            Professional pet care service with experienced and certified staff. 
            We provide the best care for your beloved pets with years of experience.
          </Text>

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Features
          </Text>
          <List.Item
            title="Certified Professionals"
            left={props => <List.Icon {...props} icon="check-circle" />}
          />
          <List.Item
            title="Flexible Scheduling"
            left={props => <List.Icon {...props} icon="check-circle" />}
          />
          <List.Item
            title="Affordable Pricing"
            left={props => <List.Icon {...props} icon="check-circle" />}
          />
          <List.Item
            title="24/7 Support"
            left={props => <List.Icon {...props} icon="check-circle" />}
          />

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Reviews
          </Text>
          <Text variant="bodyMedium" style={styles.rating}>
            ⭐⭐⭐⭐⭐ 4.8 (156 reviews)
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained" 
            style={styles.bookButton}
            onPress={() => navigation.navigate('Booking', { serviceId })}
          >
            Book Now
          </Button>
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
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    marginBottom: 8,
    opacity: 0.7,
  },
  content: {
    lineHeight: 24,
  },
  divider: {
    marginVertical: 16,
  },
  rating: {
    fontSize: 18,
    marginTop: 8,
  },
  bookButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default ServiceDetailScreen;
