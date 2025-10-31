import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/constants/theme';
import { Avatar } from '@/components/common/Avatar';
import Button from '@/components/common/Button';

type Props = NativeStackScreenProps<any, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const stats = [
    { label: 'Bookings', value: '0' },
    { label: 'Transformations', value: '0' },
    { label: 'Reviews', value: '0' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Avatar
          size={80}
          source={user?.user_metadata?.avatar_url ? { uri: user.user_metadata.avatar_url } : undefined}
          name={user?.user_metadata?.full_name || user?.email || 'User'}
        />
        <Text style={styles.name}>{user?.user_metadata?.full_name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('MyBookings')}
        >
          <Text style={styles.menuIcon}>??</Text>
          <Text style={styles.menuText}>My Bookings</Text>
          <Text style={styles.menuArrow}>?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('PaymentMethods')}
        >
          <Text style={styles.menuIcon}>??</Text>
          <Text style={styles.menuText}>Payment Methods</Text>
          <Text style={styles.menuArrow}>?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Pets')}
        >
          <Text style={styles.menuIcon}>??</Text>
          <Text style={styles.menuText}>My Pets</Text>
          <Text style={styles.menuArrow}>?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.menuIcon}>??</Text>
          <Text style={styles.menuText}>Settings</Text>
          <Text style={styles.menuArrow}>?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Subscription')}
        >
          <Text style={styles.menuIcon}>?</Text>
          <Text style={styles.menuText}>Subscription</Text>
          <Text style={styles.menuArrow}>?</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Sign Out"
        onPress={handleSignOut}
        variant="outline"
        style={styles.signOutButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  editButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  menuContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  menuArrow: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
  signOutButton: {
    marginTop: 8,
  },
});

export default ProfileScreen;