import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { HomeStackScreenProps } from '../../types/navigation';

type Props = HomeStackScreenProps<'UserProfile'>;

const UserProfileScreen: React.FC<Props> = ({ route }) => {
  const { userId } = route.params;

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">User Profile</Text>
      <Text variant="bodyLarge">User ID: {userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
});

export default UserProfileScreen;