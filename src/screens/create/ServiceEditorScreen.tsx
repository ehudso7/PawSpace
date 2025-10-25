import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { CreateStackScreenProps } from '../../types/navigation';

type Props = CreateStackScreenProps<'ServiceEditor'>;

const ServiceEditorScreen: React.FC<Props> = ({ route, navigation }) => {
  const { serviceId, isEdit } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">
        {isEdit ? 'Edit Service' : 'Create Service'}
      </Text>
      {serviceId && <Text variant="bodyLarge">Service ID: {serviceId}</Text>}
      <Button 
        mode="contained" 
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        {isEdit ? 'Update Service' : 'Create Service'}
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

export default ServiceEditorScreen;