import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* TODO: Implement onboarding carousel */}
=======
import { View, Text, StyleSheet } from 'react-native';

const OnboardingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Onboarding Screen</Text>
=======
      <Text style={styles.title}>Welcome to PawSpace</Text>
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

export default OnboardingScreen;
=======
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
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

export default OnboardingScreen;
=======
    marginBottom: 20,
  },
});

export default OnboardingScreen;
>>>>>>> origin/main
>>>>>>> origin/main
