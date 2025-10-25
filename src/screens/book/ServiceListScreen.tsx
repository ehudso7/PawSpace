import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { BookStackScreenProps } from '../../types/navigation';

type Props = BookStackScreenProps<'ServiceListScreen'>;

const ServiceListScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Pet Services</Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Dog Walking</Text>
          <Text variant="bodyMedium" style={styles.cardText}>
            Professional dog walking service
          </Text>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('ServiceDetail', { 
              serviceId: '1', 
              serviceName: 'Dog Walking' 
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

export default ServiceListScreen;