import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BookStackParamList } from '../../../types/navigation';

export type ServiceListScreenProps = NativeStackScreenProps<BookStackParamList, 'ServiceList'>;

const ServiceListScreen: React.FC<ServiceListScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium">Services</Text>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('ServiceDetails', { serviceId: 'demo-service' })}
      >
        View Service Details
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
});

export default ServiceListScreen;
