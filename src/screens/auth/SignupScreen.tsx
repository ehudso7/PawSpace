import React from 'react';
<<<<<<< HEAD
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* TODO: Implement signup form */}
=======
import { View, Text, StyleSheet } from 'react-native';

const SignupScreen: React.FC = () => {
  return (
    <View style={styles.container}>
<<<<<<< HEAD
      <Text style={styles.title}>Signup Screen</Text>
=======
      <Text style={styles.title}>Sign Up</Text>
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

export default SignupScreen;
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

export default SignupScreen;
=======
    marginBottom: 20,
  },
});

export default SignupScreen;
>>>>>>> origin/main
>>>>>>> origin/main
