import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Button, Divider, List, useTheme } from 'react-native-paper';
import type { HomeScreenProps } from '../../types/navigation';

type Props = HomeScreenProps<'UserProfile'>;

const UserProfileScreen: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label="UP" />
        <Text variant="headlineMedium" style={styles.name}>
          User Profile
        </Text>
        <Text variant="bodyMedium" style={styles.bio}>
          User ID: {userId}
        </Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text variant="titleLarge" style={styles.statNumber}>42</Text>
            <Text variant="bodyMedium" style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text variant="titleLarge" style={styles.statNumber}>156</Text>
            <Text variant="bodyMedium" style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text variant="titleLarge" style={styles.statNumber}>89</Text>
            <Text variant="bodyMedium" style={styles.statLabel}>Following</Text>
          </View>
        </View>
        <Button mode="contained" style={styles.followButton}>
          Follow
        </Button>
      </View>

      <Divider style={styles.divider} />

      <List.Section>
        <List.Subheader>Recent Posts</List.Subheader>
        <Text variant="bodyMedium" style={styles.placeholder}>
          User's posts will appear here
        </Text>
      </List.Section>
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
  bio: {
    marginTop: 8,
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
  followButton: {
    marginTop: 8,
    paddingHorizontal: 32,
  },
  divider: {
    marginVertical: 16,
  },
  placeholder: {
    textAlign: 'center',
    padding: 24,
    opacity: 0.5,
  },
});

export default UserProfileScreen;
