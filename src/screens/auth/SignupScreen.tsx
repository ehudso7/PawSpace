import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, ErrorMessage } from '@/components/common';
import { useAuth } from '@/hooks';
import { theme } from '@/constants/theme';
import { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { signUp, loading, error } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !fullName) return;
    if (password !== confirmPassword) return;
    
    await signUp({
      email,
      password,
      userType: 'pet_owner',
      profile: { fullName }
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join PawSpace today</Text>
        </View>

        {error && <ErrorMessage message={error.message} style={styles.error} />}

        <Input
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
        />

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Create a password"
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm your password"
          error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined}
        />

        <Button
          title={loading ? "Creating Account..." : "Sign Up"}
          onPress={handleSignup}
          disabled={loading || !email || !password || !fullName || password !== confirmPassword}
          loading={loading}
          style={styles.button}
        />

        <Button
          title="Already have an account? Log in"
          onPress={() => navigation.navigate('Login')}
          variant="outline"
          style={styles.button}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white || '#FFF',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text || '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.gray || '#666',
  },
  error: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});

export default SignupScreen;
