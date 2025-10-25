import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* TODO: Implement app settings and preferences */}
=======
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Settings Screen</Text>
=======
      <Text style={styles.title}>Settings</Text>
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

export default SettingsScreen;
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

export default SettingsScreen;
=======
    marginBottom: 20,
  },
});

export default SettingsScreen;
>>>>>>> origin/main
>>>>>>> origin/main
