import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { ProfileStackScreenProps } from '../../types/navigation';

type Props = ProfileStackScreenProps<'ProfileScreen'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label="JD" />
        <Text variant="headlineMedium" style={styles.name}>John Doe</Text>
        <Text variant="bodyLarge" style={styles.email}>john@example.com</Text>
      </View>
      
      <Card style={styles.card}>
        <Card.Content>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.button}
          >
            Edit Profile
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('MyBookings')}
            style={styles.button}
          >
            My Bookings
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('MyServices')}
            style={styles.button}
          >
            My Services
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('Settings')}
            style={styles.button}
          >
            Settings
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
    alignItems: 'center',
  },
  name: {
    marginTop: 10,
  },
  email: {
    opacity: 0.7,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  button: {
    marginVertical: 5,
  },
});

export default ProfileScreen;