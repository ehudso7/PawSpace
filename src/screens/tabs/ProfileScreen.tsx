import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Button, Divider, List, useTheme } from 'react-native-paper';
import { supabase } from '../../lib/supabase';
import type { ProfileScreenProps } from '../../types/navigation';

type Props = ProfileScreenProps<'ProfileMain'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Navigation will be handled automatically by AppNavigator
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label="ME" />
        <Text variant="headlineMedium" style={styles.name}>
          My Profile
        </Text>
        <Text variant="bodyMedium" style={styles.email}>
          user@example.com
        </Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text variant="titleLarge" style={styles.statNumber}>24</Text>
            <Text variant="bodyMedium" style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text variant="titleLarge" style={styles.statNumber}>89</Text>
            <Text variant="bodyMedium" style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text variant="titleLarge" style={styles.statNumber}>156</Text>
            <Text variant="bodyMedium" style={styles.statLabel}>Following</Text>
          </View>
        </View>
        <Button 
          mode="outlined" 
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          Edit Profile
        </Button>
      </View>

      <Divider style={styles.divider} />

      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="My Pets"
          description="Manage your pets"
          left={props => <List.Icon {...props} icon="dog" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('MyPets')}
        />
        <List.Item
          title="My Bookings"
          description="View your service bookings"
          left={props => <List.Icon {...props} icon="calendar" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('MyBookings')}
        />
        <List.Item
          title="Settings"
          description="App preferences"
          left={props => <List.Icon {...props} icon="cog" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Settings')}
        />
      </List.Section>

      <Divider style={styles.divider} />

      <View style={styles.footer}>
        <Button 
          mode="contained" 
          onPress={handleLogout}
          buttonColor={theme.colors.error}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  email: {
    marginTop: 4,
    opacity: 0.7,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontWeight: 'bold',
  },
  statLabel: {
    opacity: 0.7,
    marginTop: 4,
  },
  editButton: {
    marginTop: 8,
    paddingHorizontal: 32,
  },
  divider: {
    marginVertical: 16,
  },
  footer: {
    padding: 20,
  },
  logoutButton: {
    paddingVertical: 4,
  },
});

export default ProfileScreen;
