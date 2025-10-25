import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthStackScreenProps } from '../../types/navigation';

type Props = AuthStackScreenProps<'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to PawSpace
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Sign in to continue
      </Text>
      <Button 
        mode="contained" 
        onPress={() => navigation.navigate('Signup')}
        style={styles.button}
      >
        Go to Signup
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

export default LoginScreen;