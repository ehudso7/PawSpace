import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
<<<<<<< HEAD
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BookingStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<BookingStackParamList, 'ProviderProfile'>;

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
