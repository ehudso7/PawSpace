import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserTransformations } from '@/hooks/useTransformations';
import { Button, Loading, ErrorMessage } from '@/components/common';
import { theme } from '@/constants/theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const { transformations, isLoading, error } = useUserTransformations(user?.id || '');

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleSubscription = () => {
    navigation.navigate('Subscription');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  if (isLoading) {
    return <Loading text="Loading profile..." fullScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <ErrorMessage message={error} />
        <Button
          title="Try Again"
          onPress={() => navigation.goBack()}
          style={styles.retryButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            {user?.location && (
              <Text style={styles.location}>📍 {user.location}</Text>
            )}
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{transformations.length}</Text>
            <Text style={styles.statLabel}>Transformations</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Edit Profile"
          onPress={handleEditProfile}
          variant="outline"
          style={styles.actionButton}
        />
        <Button
          title="Settings"
          onPress={handleSettings}
          variant="outline"
          style={styles.actionButton}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Transformations</Text>
        {transformations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transformations yet</Text>
            <Text style={styles.emptySubtext}>
              Start sharing your pet's amazing transformations!
            </Text>
          </View>
        ) : (
          <View style={styles.transformationsGrid}>
            {transformations.map((transformation) => (
              <Image
                key={transformation.id}
                source={{ uri: transformation.imageUrl }}
                style={styles.transformationImage}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Button
          title="Subscription"
          onPress={handleSubscription}
          variant="outline"
          style={styles.subscriptionButton}
        />
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          style={styles.signOutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: theme.spacing.lg,
  },
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: theme.fonts.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.fonts.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  location: {
    fontSize: theme.fonts.sm,
    color: theme.colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.fonts.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.fonts.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fonts.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.fonts.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.fonts.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  transformationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  transformationImage: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.md,
  },
  subscriptionButton: {
    marginBottom: theme.spacing.md,
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
  },
});

export default ProfileScreen;