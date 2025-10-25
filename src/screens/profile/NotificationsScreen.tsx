import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { ProfileStackScreenProps } from '../../types/navigation';

type Props = ProfileStackScreenProps<'Notifications'>;

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Notifications</Text>
      <Text variant="bodyLarge">Manage your notification preferences</Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Back to Profile
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

export default NotificationsScreen;