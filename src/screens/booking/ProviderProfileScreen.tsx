import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
=======
import { View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
>>>>>>> origin/main
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<BookingStackParamList, 'ProviderProfile'>;

<<<<<<< HEAD
const ProviderProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { providerId } = route.params;

  return (
    <View style={styles.container}>
      {/* TODO: Implement provider profile with services and reviews */}
=======
const ProviderProfileScreen: React.FC<Props> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Provider Profile Screen</Text>
=======

const ProviderProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Provider Profile</Text>
>>>>>>> origin/main
>>>>>>> origin/main
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#fff',
  },
});

export default ProviderProfileScreen;
=======
<<<<<<< HEAD
    justifyContent: 'center',
    alignItems: 'center',
=======
    padding: 20,
>>>>>>> origin/main
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
<<<<<<< HEAD
  },
});

export default ProviderProfileScreen;
=======
    marginBottom: 20,
  },
});

export default ProviderProfileScreen;
>>>>>>> origin/main
>>>>>>> origin/main
