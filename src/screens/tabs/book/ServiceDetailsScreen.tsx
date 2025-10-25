import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BookStackParamList } from '../../../types/navigation';

export type ServiceDetailsScreenProps = NativeStackScreenProps<
  BookStackParamList,
  'ServiceDetails'
>;

const ServiceDetailsScreen: React.FC<ServiceDetailsScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { serviceId } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium">Service Details</Text>
      <Text style={styles.meta}>Service ID: {serviceId}</Text>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() =>
          navigation.navigate('BookingCheckout', { serviceId, date: new Date().toISOString() })
        }
      >
        Book Now
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
  meta: {
    marginTop: 8,
  },
});

export default ServiceDetailsScreen;
