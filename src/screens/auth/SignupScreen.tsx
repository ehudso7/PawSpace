import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthStackScreenProps } from '../../types/navigation';

type Props = AuthStackScreenProps<'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Create Account
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Join the PawSpace community
      </Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('Login')}
        style={styles.button}
      >
        Back to Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.7,
  },
  button: {
    marginTop: 20,
  },
});

export default SignupScreen;