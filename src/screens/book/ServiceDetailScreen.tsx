import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { BookStackScreenProps } from '../../types/navigation';

type Props = BookStackScreenProps<'ServiceDetail'>;

const ServiceDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { serviceId, serviceName } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">{serviceName}</Text>
      <Text variant="bodyLarge">Service ID: {serviceId}</Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('BookingForm', { 
          serviceId, 
          serviceName, 
          providerId: 'provider1' 
        })}
        style={styles.button}
      >
        Book Service
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 20,
  },
});

export default ServiceDetailScreen;