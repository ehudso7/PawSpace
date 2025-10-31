import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@/components/common';
import { theme } from '@/constants/theme';
import { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to PawSpace</Text>
        <Text style={styles.subtitle}>
          Connect with trusted pet care professionals in your area
        </Text>
      </View>

      <View style={styles.buttons}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          style={styles.button}
        />
        <Button
          title="I already have an account"
          onPress={handleLogin}
          variant="outline"
          style={styles.button}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white || '#FFF',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text || '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.gray || '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttons: {
    paddingBottom: 40,
  },
  button: {
    marginTop: 16,
  },
});

export default OnboardingScreen;
