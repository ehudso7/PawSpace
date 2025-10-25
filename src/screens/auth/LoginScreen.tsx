import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

interface Props {
  navigation: any;
}

export default function LoginScreen({ navigation }: Props) {
  const { signIn, loading, error, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const onLogin = useCallback(async () => {
    setFormError(null);
    if (!validateEmail(email)) {
      setFormError('Please enter a valid email.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }
    await signIn(email.trim(), password);
  }, [email, password, signIn]);

  React.useEffect(() => {
    if (user) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    }
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>Welcome back</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {(formError || error) && (
        <Text style={styles.errorText}>{formError || error}</Text>
      )}

      <Button mode="contained" onPress={onLogin} disabled={loading} style={styles.button}>
        {loading ? <ActivityIndicator animating color="white" /> : 'Login'}
      </Button>

      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 12 },
  button: { marginTop: 8 },
  linksRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  link: { color: '#0a7', fontWeight: '600' },
  errorText: { color: '#B00020', marginTop: 8 },
});
