import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  Avatar,
  Divider,
} from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';

export const HomeScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const { success, error } = await signOut();
    if (!success) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <View style={styles.userInfo}>
              <Avatar.Text
                size={80}
                label={user.profile.full_name.charAt(0).toUpperCase()}
                style={styles.avatar}
              />
              <View style={styles.userDetails}>
                <Title style={styles.welcomeTitle}>
                  Welcome back, {user.profile.full_name}!
                </Title>
                <Paragraph style={styles.userType}>
                  {user.user_type === 'pet_owner' ? 'Pet Owner' : 'Service Provider'}
                </Paragraph>
                <Paragraph style={styles.userEmail}>{user.email}</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.profileCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Profile Information</Title>
            <Divider style={styles.divider} />
            
            <View style={styles.profileItem}>
              <Text style={styles.profileLabel}>Full Name:</Text>
              <Text style={styles.profileValue}>{user.profile.full_name}</Text>
            </View>
            
            {user.profile.phone && (
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Phone:</Text>
                <Text style={styles.profileValue}>{user.profile.phone}</Text>
              </View>
            )}
            
            {user.profile.location && (
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Location:</Text>
                <Text style={styles.profileValue}>{user.profile.location}</Text>
              </View>
            )}
            
            {user.profile.bio && (
              <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Bio:</Text>
                <Text style={styles.profileValue}>{user.profile.bio}</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Quick Actions</Title>
            <Divider style={styles.divider} />
            
            <Button
              mode="contained"
              onPress={() => {}}
              style={styles.actionButton}
              icon="paw"
            >
              {user.user_type === 'pet_owner' 
                ? 'Find Pet Services' 
                : 'Manage Services'
              }
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.actionButton}
              icon="account-edit"
            >
              Edit Profile
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleSignOut}
              style={styles.actionButton}
              icon="logout"
              buttonColor="#ffebee"
              textColor="#d32f2f"
            >
              Sign Out
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  welcomeCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#2E7D32',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  userType: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  profileCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 12,
  },
  actionsCard: {
    marginBottom: 20,
    elevation: 4,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 100,
  },
  profileValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 8,
  },
});