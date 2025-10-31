import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, ErrorMessage, Loading } from '@/components/common';
import { useAuth } from '@/hooks';
import { theme } from '@/constants/theme';
import { AuthStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return;
    await signIn({ email, password });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to your account</Text>
        </View>

        {error && <ErrorMessage message={error.message} style={styles.error} />}

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
          placeholder="Enter your password"
        />

        <Button
          title={loading ? "Logging in..." : "Log In"}
          onPress={handleLogin}
          disabled={loading || !email || !password}
          loading={loading}
          style={styles.button}
        />

        <Button
          title="Create Account"
          onPress={() => navigation.navigate('Signup')}
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

export default LoginScreen;
